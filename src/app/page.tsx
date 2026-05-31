import { AppHeader } from "@/components/truedeal/app-header";
import { SearchPanel } from "@/components/truedeal/search-panel";

function HowStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-5">
      <div className="font-display text-xs tracking-tightest text-muted-foreground">
        {n}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{title}</div>
      <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-page">
        <AppHeader />

        <section className="mt-20 sm:mt-28 text-center animate-fade-up">
          <span className="small-caps text-xs text-muted-foreground">
            shopping agent · India
          </span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl tracking-tightest text-balance">
            What are you about to buy?
          </h1>
        </section>

        <section
          className="mt-12 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <SearchPanel />
        </section>

        <section
          className="mt-24 animate-fade-up"
          style={{ animationDelay: "260ms" }}
        >
          <div className="small-caps text-center text-[11px] text-muted-foreground">
            How it works
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <HowStep
              n="01"
              title="Paste or describe"
              body="Drop an Amazon URL, or just type what you're about to buy."
            />
            <HowStep
              n="02"
              title="Agent fans out"
              body="We check the right marketplaces, the brand's own site, current deals, demand signals, and review sentiment."
            />
            <HowStep
              n="03"
              title="Verdict + savings"
              body="A single paragraph telling you exactly where to buy, why, and what every leak across the rest of your year compounds to."
            />
          </div>
        </section>

        <footer className="mt-24 mb-8 text-center text-[11px] text-muted-foreground">
          TrueDeal cross-checks Amazon, Flipkart, eBay, Croma, Reliance Digital,
          Vijay Sales, Blinkit, BigBasket, JioMart and the brand&apos;s own
          storefront. Live data via Wire by Anakin.
        </footer>
      </div>
    </div>
  );
}
