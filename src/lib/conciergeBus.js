/* Tiny window-event bus so any CTA on the page can open the
   concierge without threading state through every section. */
const EVENT = "guogan:open-concierge";

export function openConcierge(topic) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { topic } }));
}

export function onConciergeOpen(handler) {
  const listener = (event) => handler(event.detail?.topic);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
