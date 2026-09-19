import { isModifiedClick, navigate } from "../lib/router.js";

/**
 * An ordinary link that navigates without a reload. `to` is a path,
 * `hash` an optional anchor inside it — so the header can point at
 * "/" + "#work" from anywhere in the site. Middle-clicks, modifier
 * clicks and right-clicks are left to the browser.
 */
export default function RouteLink({ to, hash = "", onNavigate, children, ...rest }) {
  return (
    <a
      href={`${to}${hash}`}
      onClick={(event) => {
        if (isModifiedClick(event)) return;
        event.preventDefault();
        onNavigate?.();
        navigate(to, hash);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
