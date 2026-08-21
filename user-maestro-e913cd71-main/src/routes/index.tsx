import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <main className="h-screen w-screen overflow-hidden">
      <h1 className="sr-only">Pro Inventory &amp; Stock Management</h1>
      <iframe
        src="/app/index.html"
        title="Pro Inventory & Stock Management"
        className="h-full w-full border-0"
      />
    </main>
  );
}
