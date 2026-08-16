import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Masked line/word reveal.
   ------------------------------------------------------------------
   Each word sits in an overflow-hidden box and slides up from below —
   so it is revealed by a mask edge rather than just faded in.

   The whole string stays in the accessibility tree as one label; the
   per-word spans are hidden from screen readers so the text isn't
   announced as disconnected fragments.
   ================================================================== */

type Props = {
  text: string;
  className?: string;
  /* Needed so headings can be targeted by aria-labelledby. */
  id?: string;
  /* Stagger between words, seconds. */
  stagger?: number;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /* Split into characters instead of words — for short display strings. */
  by?: "word" | "char";
  once?: boolean;
};

export function SplitText({
  text,
  className = "",
  id,
  stagger = 0.07,
  delay = 0,
  as: Tag = "span",
  by = "word",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-12%" });
  const reduced = useReducedMotion();

  const pieces = by === "char" ? Array.from(text) : text.split(" ");

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      className={`inline-flex flex-wrap ${className}`}
      aria-label={text}
    >
      {pieces.map((piece, i) => (
        <span
          key={`${piece}-${i}`}
          aria-hidden
          /* pb leaves room for descenders, which a tight mask clips. */
          className="inline-block overflow-hidden pb-[0.12em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.9,
              ease: EASE,
            }}
          >
            {piece}
            {by === "word" && i < pieces.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
