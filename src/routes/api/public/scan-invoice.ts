import { createFileRoute } from "@tanstack/react-router";

const SYSTEM = `You read photos of inventory challans / return slips / invoices.
Extract the data and reply ONLY with JSON (no markdown fence) in this shape:
{"po":"","cartonNo":"","outlet":"","product":"","inDate":"YYYY-MM-DD","expiry":"YYYY-MM-DD","pcs":0,"grade_a":0,"grade_b":0,"grade_b2":0,"grade_c":0,"note":""}
Rules: use empty string when unknown, numbers as integers (0 if unknown).
"outlet" = shop / outlet / source / party name. Grade columns may be labelled A/B/B2/C,
Fresh/Usable/Damage, or in Bengali. If only a total is written, put it in "pcs" and leave grades 0.
If grades are given but no total, set pcs = sum of grades.`;

export const Route = createFileRoute("/api/public/scan-invoice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });

        const { image } = (await request.json()) as { image?: string };
        if (!image) return new Response(JSON.stringify({ error: "No image" }), { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEM },
              {
                role: "user",
                content: [
                  { type: "text", text: "Extract the stock data from this photo." },
                  { type: "image_url", image_url: { url: image } },
                ],
              },
            ],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          return new Response(JSON.stringify({ error: text.slice(0, 400) }), { status: upstream.status });
        }

        const json = (await upstream.json()) as any;
        const raw: string = json?.choices?.[0]?.message?.content ?? "";
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return new Response(JSON.stringify({ error: "Could not read the photo" }), { status: 422 });

        try {
          return new Response(JSON.stringify({ data: JSON.parse(match[0]) }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Bad AI response" }), { status: 422 });
        }
      },
    },
  },
});
