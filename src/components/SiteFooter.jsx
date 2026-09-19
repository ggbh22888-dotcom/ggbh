import { social, studio } from "../content/site.js";
import "./SiteFooter.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <p className="footer__han">{studio.hanName}</p>
          <p className="footer__latin">
            {studio.latinName} {studio.descriptor}
          </p>
          <p className="footer__place">{studio.location}</p>
        </div>

        <nav className="footer__links" aria-label="Elsewhere">
          <p className="footer__label">Elsewhere</p>
          <ul>
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="link-line"
                  rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="footer__hint">Channel links are placeholders until the studio accounts go live.</p>
        </nav>

        <div className="footer__statement">
          <p className="footer__manifesto">
            {studio.manifestoHan.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="footer__manifesto footer__manifesto--en">
            {studio.manifestoEn.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </div>

      <div className="shell footer__base">
        <p>© {year} {studio.hanName} {studio.latinName}. All rights reserved.</p>
        <p>Site V01 · Imagery shown are placeholders for studio-owned masters.</p>
      </div>
    </footer>
  );
}
