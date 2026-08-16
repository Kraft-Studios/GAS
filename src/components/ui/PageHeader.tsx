import { SplitText } from "./SplitText";
import { SectionMark } from "./TechLabel";

/* Shared masthead for the secondary routes, so they read as part of one
   site rather than six different designs. */
export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative bg-carbon px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-48">
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index={index} label={eyebrow} className="mb-10" />
        <SplitText
          as="h1"
          text={title}
          className="display max-w-[14ch] text-[14vw] text-bone md:text-[8vw]"
        />
        {intro && (
          <p className="mt-8 max-w-lg text-base leading-relaxed text-dim md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
