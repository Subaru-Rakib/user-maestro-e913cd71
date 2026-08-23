import { createFileRoute } from "@tanstack/react-router";

/* Exposes the public (browser-safe) Supabase config to the app.
   The anon / publishable key is designed to be used from a browser, but keep
   your project URL private and keep Row Level Security enabled.
   Set these in .env (or your hosting provider's env settings):

     SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
     SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx

   If they are missing the app silently keeps using local browser storage. */
export const Route = createFileRoute("/api/public/config")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || "";
        const anon =
          process.env["SUPABASE_ANON_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["VITE_SUPABASE_ANON_KEY"] ||
          "";
        const docId = process.env["SUPABASE_DOC_ID"] || "main";

        return new Response(
          JSON.stringify({
            supabaseUrl: url,
            supabaseAnonKey: anon,
            docId,
            configured: Boolean(url && anon),
          }),
          { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
        );
      },
    },
  },
});