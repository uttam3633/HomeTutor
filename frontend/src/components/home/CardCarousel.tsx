type Card = {
  title: string;
  subtitle: string;
  meta: string;
};

type Props = {
  cards: Card[];
};

export function CardCarousel({ cards }: Props) {
  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-4">
      {cards.map((card) => (
        <article key={card.title} className="glass-panel min-w-[280px] snap-start p-6 sm:min-w-[340px]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">{card.subtitle}</p>
          <h3 className="mt-3 text-xl font-bold">{card.title}</h3>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{card.meta}</p>
        </article>
      ))}
    </div>
  );
}

