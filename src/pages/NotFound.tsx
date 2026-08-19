import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-void px-6 text-center">
      <p className="label">ERROR 404</p>
      <h1 className="display text-[22vw] leading-none text-bone md:text-[12vw]">
        WRONG
        <br />
        TURN
      </h1>
      <p className="max-w-sm text-sm text-dim">
        This page doesn't exist. Nothing here but tarmac.
      </p>
      <Link
        to="/"
        data-cursor="open"
        className="group relative overflow-hidden border border-bone px-10 py-4 font-mono text-[10px] uppercase tracking-label text-bone transition-colors duration-500 hover:text-void"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-expo group-hover:scale-y-100"
        />
        <span className="relative">Back to home</span>
      </Link>
    </main>
  );
}
