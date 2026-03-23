type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

