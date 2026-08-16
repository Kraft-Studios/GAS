import { useId, useState } from "react";
import { validateEnquiry, submitEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/api";
import { SERVICES } from "@/data/services";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { GAS } from "@/lib/constants";

const EMPTY: Enquiry = {
  name: "",
  email: "",
  phone: "",
  vehicle: "",
  service: "",
  message: "",
};

/* ==================================================================
   Contact.
   ------------------------------------------------------------------
   Accessible form work that decorative builds usually skip:
     - every input has a real <label>, not a placeholder standing in
     - errors are tied to inputs via aria-describedby + aria-invalid
     - the error summary is a live region, so a screen reader hears it
     - the first invalid field is focused on a failed submit
     - submit state is announced, not just spun
   ================================================================== */

export function ContactForm() {
  const [data, setData] = useState<Enquiry>(EMPTY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const uid = useId();

  const field = (k: keyof Enquiry) => `${uid}-${k}`;
  const errId = (k: keyof Enquiry) => `${uid}-${k}-error`;

  const set = (k: keyof Enquiry, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    /* Clear a field's error as soon as the user edits it — leaving it
       up while they type reads as the form arguing with them. */
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const found = validateEnquiry(data);
    setErrors(found);

    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0] as keyof Enquiry;
      document.getElementById(field(firstKey))?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitEnquiry(data);
      setStatus("sent");
      setData(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="contact-heading"
      className="relative bg-void px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionMark index="11" label="CONTACT" className="mb-10" />
          <SplitText
            as="h2"
            id="contact-heading"
            text="BRING US THE CAR."
            className="display mb-8 max-w-[11ch] text-[12vw] text-bone md:text-[5.4vw]"
          />
          <p className="max-w-sm text-base leading-relaxed text-dim">
            Shoots, features, drives, partnerships. Tell us what you're
            driving and what you want made.
          </p>

          <div className="mt-10 flex flex-col gap-2">
            <a
              href={`mailto:${GAS.email}`}
              data-cursor="open"
              className="text-lg text-bone transition-opacity hover:opacity-60"
            >
              {GAS.email}
            </a>
            <a
              href={GAS.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="font-mono text-[10px] uppercase tracking-label text-dim transition-colors hover:text-bone"
            >
              {GAS.instagramHandle} ↗
            </a>
          </div>
        </div>

        {/* ---------------- form */}
        <form onSubmit={onSubmit} noValidate className="lg:col-span-6 lg:col-start-7">
          {/* Live region for submit outcomes. */}
          <div role="status" aria-live="polite" className="sr-only">
            {status === "sending" && "Sending your enquiry"}
            {status === "sent" && "Enquiry sent. We'll be in touch."}
            {status === "error" && "Something went wrong. Please try again."}
          </div>

          <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
            <Field
              id={field("name")}
              errorId={errId("name")}
              label="Name"
              value={data.name}
              error={errors.name}
              onChange={(v) => set("name", v)}
              autoComplete="name"
              required
            />
            <Field
              id={field("email")}
              errorId={errId("email")}
              label="Email"
              type="email"
              value={data.email}
              error={errors.email}
              onChange={(v) => set("email", v)}
              autoComplete="email"
              required
            />
            <Field
              id={field("phone")}
              errorId={errId("phone")}
              label="Phone"
              type="tel"
              value={data.phone}
              error={errors.phone}
              onChange={(v) => set("phone", v)}
              autoComplete="tel"
              hint="Optional"
            />
            <Field
              id={field("vehicle")}
              errorId={errId("vehicle")}
              label="Vehicle"
              value={data.vehicle}
              error={errors.vehicle}
              onChange={(v) => set("vehicle", v)}
              hint="Make, model, year"
            />

            {/* ---- service select */}
            <div className="sm:col-span-2">
              <label htmlFor={field("service")} className="label mb-2 block">
                What do you need? <span aria-hidden>*</span>
              </label>
              <select
                id={field("service")}
                value={data.service}
                onChange={(e) => set("service", e.target.value)}
                required
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? errId("service") : undefined}
                className={`w-full appearance-none border-b bg-transparent py-3 text-base text-bone outline-none transition-colors focus:border-bone ${
                  errors.service ? "border-red-400" : "border-line"
                }`}
              >
                <option value="" className="bg-void">
                  Select…
                </option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.title} className="bg-void">
                    {s.title} — {s.accent}
                  </option>
                ))}
                <option value="Other" className="bg-void">
                  Something else
                </option>
              </select>
              {errors.service && (
                <p id={errId("service")} className="mt-2 text-xs text-red-400">
                  {errors.service}
                </p>
              )}
            </div>

            {/* ---- message */}
            <div className="sm:col-span-2">
              <label htmlFor={field("message")} className="label mb-2 block">
                Message <span aria-hidden>*</span>
              </label>
              <textarea
                id={field("message")}
                value={data.message}
                onChange={(e) => set("message", e.target.value)}
                rows={5}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? errId("message") : undefined}
                className={`w-full resize-none border-b bg-transparent py-3 text-base text-bone outline-none transition-colors focus:border-bone ${
                  errors.message ? "border-red-400" : "border-line"
                }`}
              />
              {errors.message && (
                <p id={errId("message")} className="mt-2 text-xs text-red-400">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === "sending"}
              data-cursor="open"
              className="group relative overflow-hidden border border-bone px-10 py-4 font-mono text-[10px] uppercase tracking-label text-bone transition-colors duration-500 hover:text-black disabled:opacity-50"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-expo group-hover:scale-y-100"
              />
              <span className="relative">
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </span>
            </button>

            {status === "sent" && (
              <p className="font-mono text-[10px] uppercase tracking-label text-bone">
                Received. We'll come back to you.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-[10px] uppercase tracking-label text-red-400">
                Didn't send — try again or email us directly.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  errorId,
  label,
  value,
  onChange,
  error,
  type = "text",
  hint,
  required,
  autoComplete,
}: {
  id: string;
  errorId: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const hintId = `${id}-hint`;
  const described = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={described || undefined}
        className={`w-full border-b bg-transparent py-3 text-base text-bone outline-none transition-colors focus:border-bone ${
          error ? "border-red-400" : "border-line"
        }`}
      />
      {hint && !error && (
        <p id={hintId} className="mt-2 text-[11px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
