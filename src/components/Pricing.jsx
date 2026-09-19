import Reveal from "./Reveal.jsx";
import { pricing, pricingDisclaimer } from "../content/site.js";
import "./Pricing.css";

export default function Pricing() {
  return (
    <section
      className="pricing section section--ivory section--edge"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="shell">
        <header className="pricing__head">
          <Reveal as="p" className="eyebrow eyebrow--index" data-index="06">
            Pricing Preview
          </Reveal>
          <Reveal as="h2" className="pricing__title display" id="pricing-title" delay={70}>
            Starting points, not packages.
          </Reveal>
          <Reveal as="p" className="pricing__intro" delay={110}>
            每一个项目的规模都不一样。以下是我们的起始价格与制作范围。
          </Reveal>
        </header>

        <div className="sheet">
          {pricing.map((tier, index) => (
            <Reveal
              as="article"
              className={`tier${tier.accent ? " tier--accent" : ""}`}
              key={tier.tier}
              delay={index * 70}
            >
              <div className="tier__identity">
                <p className="tier__no">{tier.no}</p>
                <h3 className="tier__name">{tier.tier}</h3>
                <p className="tier__han">{tier.han}</p>
                <p className="tier__from">{tier.from}</p>
                <p className="tier__scope">{tier.scope}</p>
                <a className="btn btn--ink tier__cta" href="#contact">
                  <span>{tier.tier === "Bespoke" ? "Request a Quote" : "Enquire"}</span>
                </a>
              </div>

              <div className="tier__panel">
                <p className="tier__label">Best For</p>
                <ul className="tier__best">
                  {tier.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="tier__panel">
                <p className="tier__label">What&rsquo;s Included</p>
                <ul className={`tier__includes${tier.includes.length > 6 ? " tier__includes--two" : ""}`}>
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="pricing__disclaimer">
          {pricingDisclaimer}
        </Reveal>
      </div>
    </section>
  );
}
