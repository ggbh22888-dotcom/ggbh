import SiteHeader from "./components/SiteHeader.jsx";
import Hero from "./components/Hero.jsx";
import Introduction from "./components/Introduction.jsx";
import SelectedWork from "./components/SelectedWork.jsx";
import Services from "./components/Services.jsx";
import Process from "./components/Process.jsx";
import Pricing from "./components/Pricing.jsx";
import CaseStudy from "./components/CaseStudy.jsx";
import FinalCta from "./components/FinalCta.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import Concierge from "./components/Concierge.jsx";
import DearGoodbye from "./pages/DearGoodbye.jsx";
import { paths, useRoute } from "./lib/router.js";

export default function App() {
  const route = useRoute();
  const isCaseStudy = route === paths.dearGoodbye;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <span className="atmosphere" aria-hidden="true" />

      <SiteHeader />

      {/* Case-study sections are rendered straight into <main> so the
          shared `main > section[id]` scroll-margin keeps anchors clear
          of the fixed masthead. */}
      <main id="main">
        {isCaseStudy ? (
          <DearGoodbye />
        ) : (
          <>
            <Hero />
            <Introduction />
            <SelectedWork />
            <Services />
            <Process />
            <Pricing />
            <CaseStudy />
            <FinalCta />
          </>
        )}
      </main>

      <SiteFooter />
      <Concierge />
    </>
  );
}
