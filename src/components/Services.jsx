import Reveal from "./Reveal.jsx";
import { services } from "../content/site.js";
import "./Services.css";

export default function Services() {
  return (
    <section
      className="services section section--ivory section--edge"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="shell">
        <header className="services__head">
          <Reveal as="p" className="eyebrow eyebrow--index" data-index="04">
            Services
          </Reveal>
          <Reveal as="h2" className="services__title display" id="services-title" delay={70}>
            <span>We create stories.</span>
            <span className="services__title-alt">Not templates.</span>
          </Reveal>
        </header>

        <ul className="services__list">
          {services.map((service, index) => (
            <Reveal as="li" className="svc" key={service.no} delay={index * 60}>
              <span className="svc__no">{service.no}</span>
              <span className="svc__names">
                <span className="svc__title">{service.title}</span>
                <span className="svc__han">{service.han}</span>
              </span>
              <span className="svc__detail">{service.detail}</span>
              <span className="svc__arrow" aria-hidden="true">
                →
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
