"use client";

import { useEffect } from "react";

const LOCK_MS = 800; // roughly how long the browser's smooth scroll takes
const SWIPE_PX = 40;

type Dir = 1 | -1;

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-snap-section], footer"));
}

function currentIndex(sections: HTMLElement[]): number {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return sections.length - 1;
  const probe = window.innerHeight * 0.5;
  let current = 0;
  sections.forEach((el, index) => {
    if (el.getBoundingClientRect().top <= probe) current = index;
  });
  return current;
}

// A section taller than the screen scrolls normally until its edge is reached.
function tallScrollable(section: HTMLElement, dir: Dir): boolean {
  const rect = section.getBoundingClientRect();
  return dir > 0 ? rect.bottom > window.innerHeight + 8 : rect.top < -8;
}

function nativeScroll(dir: Dir): boolean {
  const sections = getSections();
  const current = sections[currentIndex(sections)];
  return Boolean(current) && tallScrollable(current, dir);
}

function ignoreTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest("input, textarea, select, [data-no-pager]"));
}

export default function SectionPager() {
  useEffect(() => {
    let lockUntil = 0;
    let lastTrigger = 0;
    let lastWheel = 0;
    let lastNative = 0;

    // Moves exactly one step. Returns true if the gesture was handled.
    function step(dir: Dir): boolean {
      const sections = getSections();
      if (sections.length === 0) return false;
      const index = currentIndex(sections);
      const current = sections[index];

      // Sections like the polaroid stack can use the step first.
      const consumed = !current.dispatchEvent(
        new CustomEvent("pager-step", { detail: { dir }, cancelable: true }),
      );
      if (consumed) return true;

      const target = sections[index + dir];
      if (!target) return true;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const intoTallFromBelow = dir < 0 && target.offsetHeight > window.innerHeight + 8;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: intoTallFromBelow ? "end" : "start",
      });
      target.dispatchEvent(new CustomEvent("pager-enter", { detail: { dir } }));
      return true;
    }

    function trigger(dir: Dir) {
      const now = performance.now();
      if (now < lockUntil) return;
      if (step(dir)) {
        lockUntil = now + LOCK_MS;
        lastTrigger = now;
      }
    }

    /* ---------- Mouse wheel / trackpad ---------- */
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || ignoreTarget(event.target)) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(event.deltaY) < 4) return;
      const dir: Dir = event.deltaY > 0 ? 1 : -1;
      const now = performance.now();

      if (nativeScroll(dir)) {
        lastNative = now;
        return;
      }
      event.preventDefault();

      const streaming = now - lastWheel < 120;
      lastWheel = now;
      if (now < lockUntil) return;
      if (streaming && now - lastTrigger < 2000) return; // trackpad inertia tail
      if (streaming && now - lastNative < 400) return; // just reached the edge of a tall section
      trigger(dir);
    };

    /* ---------- Touch swipes ---------- */
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let axis: "v" | "h" | null = null;
    let usedNative = false;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || ignoreTarget(event.target)) {
        tracking = false;
        return;
      }
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
      axis = null;
      usedNative = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!tracking) return;
      const dx = startX - event.touches[0].clientX;
      const dy = startY - event.touches[0].clientY;
      if (!axis) {
        if (Math.hypot(dx, dy) < 8) return;
        axis = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      }
      if (axis !== "v") return;
      const dir: Dir = dy > 0 ? 1 : -1;
      if (nativeScroll(dir)) {
        usedNative = true;
        return;
      }
      if (event.cancelable) event.preventDefault(); // stop the page flying past the next section
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (axis !== "v" || usedNative) return;
      const dy = startY - event.changedTouches[0].clientY;
      if (Math.abs(dy) < SWIPE_PX) return;
      trigger(dy > 0 ? 1 : -1);
    };

    /* ---------- Keyboard ---------- */
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "SUMMARY"].includes(target.tagName))
      ) {
        return;
      }
      let dir: Dir | 0 = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") dir = 1;
      if (event.key === "ArrowUp" || event.key === "PageUp") dir = -1;
      if (!dir || nativeScroll(dir)) return;
      event.preventDefault();
      trigger(dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}