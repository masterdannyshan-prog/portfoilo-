import site from "@/content/site.json";

export function Hero({ content = site }: { content?: typeof site }) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          {content.hero.headline}
        </h1>
      </div>
    </section>
  );
}
