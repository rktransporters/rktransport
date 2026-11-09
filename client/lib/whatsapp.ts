const WEBSITE_REFERRAL = "I found RK Transport through your website.";

export function createWhatsappUrl(phone: string, message: string): string {
  const number = phone.replace(/\D/g, "");
  const fullMessage = `${message.trim()}\n\n${WEBSITE_REFERRAL}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(fullMessage)}`;
}
