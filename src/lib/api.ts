/* Contact submission. Point VITE_API_URL at a backend to deliver for
   real; without one the form still validates and resolves locally so the
   full UX — loading, success, error — can be exercised. */

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(data: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!data.name.trim()) errors.name = "We need a name to call you back.";

  if (!data.email.trim()) errors.email = "Add an email so we can reply.";
  else if (!EMAIL_RE.test(data.email))
    errors.email = "That address doesn't look right.";

  /* Phone is optional, but if given it should be plausible. */
  if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 9)
    errors.phone = "That number looks too short.";

  if (!data.service) errors.service = "Pick what you're after.";

  if (data.message.trim().length < 10)
    errors.message = "Give us a bit more: ten characters minimum.";

  return errors;
}

export async function submitEnquiry(data: Enquiry): Promise<{ ok: boolean }> {
  const base = import.meta.env.VITE_API_URL as string | undefined;

  if (base) {
    const res = await fetch(`${base.replace(/\/$/, "")}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Enquiry failed with status ${res.status}`);
    return { ok: true };
  }

  /* Simulated latency so loading states are actually visible in dev. */
  await new Promise((r) => setTimeout(r, 900));
  console.info("[GAS] enquiry captured locally (no VITE_API_URL set):", data);
  return { ok: true };
}
