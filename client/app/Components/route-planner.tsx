"use client";

import { ArrowRight, ArrowUpRight, Check, MapPin, MessageCircle, Phone, Repeat } from "lucide-react";
import { useMemo, useState } from "react";

type Direction = "d2a" | "a2d";

export default function RoutePlanner({
  dubai,
  abuDhabi,
  whatsappDigits,
  phone,
}: {
  dubai: string[];
  abuDhabi: string[];
  whatsappDigits: string;
  phone: string;
}) {
  const [direction, setDirection] = useState<Direction>("d2a");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const fromCity = direction === "d2a" ? "Dubai" : "Abu Dhabi";
  const toCity = direction === "d2a" ? "Abu Dhabi" : "Dubai";
  const fromList = direction === "d2a" ? dubai : abuDhabi;
  const toList = direction === "d2a" ? abuDhabi : dubai;

  const pickup = (customFrom.trim() || from).trim();
  const drop = (customTo.trim() || to).trim();
  const ready = Boolean(pickup && drop);

  function swap() {
    setDirection((current) => (current === "d2a" ? "a2d" : "d2a"));
    setFrom("");
    setTo("");
    setCustomFrom("");
    setCustomTo("");
  }

  const href = useMemo(() => {
    const message = ready
      ? `Hello RK Transport, I need car transport from ${pickup} (${fromCity}) to ${drop} (${toCity}). Please confirm availability and price.`
      : "Hello RK Transport, I would like to ask about your routes.";
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
  }, [ready, pickup, drop, fromCity, toCity, whatsappDigits]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
      {/* Direction */}
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 bg-stone-50 px-5 py-6 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
          <span>{fromCity}</span>
          <ArrowRight aria-hidden="true" className="size-6 text-amber-500" />
          <span>{toCity}</span>
        </div>
        <button
          type="button"
          onClick={swap}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Repeat aria-hidden="true" className="size-4" />
          Switch direction
        </button>
      </div>

      {/* Pickers */}
      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <Picker
          step="1"
          title={`Pickup in ${fromCity}`}
          list={fromList}
          value={from}
          custom={customFrom}
          onPick={(value) => { setFrom(value); setCustomFrom(""); }}
          onCustom={(value) => { setCustomFrom(value); setFrom(""); }}
        />
        <Picker
          step="2"
          title={`Drop-off in ${toCity}`}
          list={toList}
          value={to}
          custom={customTo}
          onPick={(value) => { setTo(value); setCustomTo(""); }}
          onCustom={(value) => { setCustomTo(value); setTo(""); }}
        />
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div aria-live="polite" className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Your trip</p>
          {ready ? (
            <p className="mt-1 text-lg font-bold sm:text-xl">
              {pickup} <span className="text-amber-400">→</span> {drop}
            </p>
          ) : (
            <p className="mt-1 text-white/70">Choose a pickup and a drop-off area to continue.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            onClick={(event) => { if (!ready) event.preventDefault(); }}
            className={`group inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold transition ${
              ready ? "bg-amber-400 text-slate-950 hover:bg-amber-300" : "cursor-not-allowed bg-white/10 text-white/40"
            }`}
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Request this route
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={`tel:${phone}`}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-semibold transition hover:bg-white/10"
          >
            <Phone aria-hidden="true" className="size-5" />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

function Picker({
  step,
  title,
  list,
  value,
  custom,
  onPick,
  onCustom,
}: {
  step: string;
  title: string;
  list: string[];
  value: string;
  custom: string;
  onPick: (value: string) => void;
  onCustom: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{step}</span>
        <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
      </div>

      <div role="group" aria-label={title} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((area) => {
          const on = value === area;
          return (
            <button
              key={area}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(area)}
              className={`group relative flex min-h-14 items-center gap-2 rounded-2xl border px-4 text-left text-base font-semibold transition duration-200 ${
                on
                  ? "border-slate-950 bg-slate-950 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-amber-400"
              }`}
            >
              {on ? (
                <Check aria-hidden="true" className="size-4 shrink-0 text-amber-400 dark:text-amber-600" />
              ) : (
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-slate-400 transition group-hover:text-amber-500" />
              )}
              <span className="leading-tight">{area}</span>
            </button>
          );
        })}
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
        Not listed? Type your area
        <input
          type="text"
          value={custom}
          onChange={(event) => onCustom(event.target.value)}
          placeholder="e.g. Motor City"
          maxLength={60}
          className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
        />
      </label>
    </div>
  );
}