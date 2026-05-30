import { AppHeader } from "@/components/truedeal/app-header";
import { SearchPanel } from "@/components/truedeal/search-panel";

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

        <footer className="mt-24 mb-8 text-center text-[11px] text-muted-foreground">
          TrueDeal compares Amazon, Flipkart, eBay, plus the brand&apos;s direct
          store when applicable. Data powered by Wire by Anakin.
        </footer>
      </div>
    </div>
  );
}
