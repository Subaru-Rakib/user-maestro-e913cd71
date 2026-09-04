import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pro Inventory & Stock Management" },
      {
        name: "description",
        content:
          "Multi-company inventory control: stock in, dispatch, carton tracking, outlet reports, audit log and backups.",
      },
      { property: "og:title", content: "Pro Inventory & Stock Management" },
      {
        property: "og:description",
        content:
          "Multi-company inventory control: stock in, dispatch, carton tracking, outlet reports, audit log and backups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const frame = useRef<HTMLIFrameElement>(null);

  /* The app runs in an iframe, so a Ctrl+P landing on THIS page prints the
     outer document - one screen tall with overflow hidden, which is why a
     report came out cut in half. Hand the print to the app's own document
     instead: it carries the print stylesheet and can paginate. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key || "").toLowerCase() !== "p" || !(e.ctrlKey || e.metaKey)) return;
      const w = frame.current?.contentWindow;
      if (!w) return;
      e.preventDefault();
      w.focus();
      w.print();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <style>{`@media print{html,body{height:auto!important;overflow:visible!important}
        main{height:auto!important;overflow:visible!important}
        iframe{min-height:100vh}}`}</style>
      <h1 className="sr-only">Pro Inventory &amp; Stock Management</h1>
      <iframe
        ref={frame}
        src="/app/index.html"
        title="Pro Inventory & Stock Management"
        className="h-full w-full border-0"
      />
    </main>
  );
}
