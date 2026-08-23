import { createFileRoute } from "@tanstack/react-router";

/* Reads an invoice / challan / return-slip photo and returns structured stock data.
   Supports MULTIPLE products in one carton via the `items` array. */
const SYSTEM = `You read photos of inventory challans, return slips, delivery notes and invoices.
Reply with ONLY raw JSON — no markdown fence, no explanation — in exactly this shape:

{"po":"","cartonNo":"","outlet":"","inDate":"YYYY-MM-DD","expiry":"YYYY-MM-DD",
 "items":[{"product":"","pcs":0}],
 "grade_a":0,"grade_b":0,"grade_b2":0,"grade_c":0,"note":""}

Rules:
- Use "" for unknown text and 0 for unknown numbers. Never invent values.
- "po" = invoice number / PO number / challan number / bill number.
- "cartonNo" = carton, box, bag, bundle or case number/label.
- "outlet" = shop / outlet / vendor / supplier / party / source name.
- "items" = every distinct product line in the photo, with its own piece count.
  One line per product. If a photo shows 5 products, return 5 items.
  Keep product names exactly as written on the paper.
- Grades may be labelled A/B/B2/C, Fresh/Usable/Damage/Good/Bad, or in Bengali
  (ভালো / চলবে / ড্যামেজ). Map: fresh/good -> grade_a, usable/ok -> grade_b,
  damage/bad/broken/expired -> grade_c. Anything labelled B2 -> grade_b2.
- Grade numbers are for the WHOLE carton, not per product.
- If no grade breakdown is written, leave all grades 0 (the app will assume Grade A).
- If grades are written but items are missing, still return the grades.
- Dates: convert any format to YYYY-MM-DD. If only month/year is given, use day 01.`;

const MODELS = ["google/gemini-2.5-flash", "google/gemini-2.0-flash-001", "openai/gpt-4o-mini"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function askModel(key: string, model: string, image: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_tokens: 1400,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the stock data from this photo as JSON." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    }),
  });
  return res;
}

export const Route = createFileRoute("/api/public/scan-invoice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"] || process.env["AI_GATEWAY_KEY"];
        if (!key) {
          return json(
            {
              error:
                "AI is not configured on the server. Set LOVABLE_API_KEY in your environment (.env) and restart, then photo scan will work.",
            },
            503,
          );
        }

        let image = "";
        try {
          const body = (await request.json()) as { image?: string };
          image = String(body?.image || "");
        } catch {
          return json({ error: "Bad request body." }, 400);
        }
        if (!image.startsWith("data:image/")) {
          return json({ error: "No image received. Please pick a photo again." }, 400);
        }
        // ~8 MB of base64 is plenty for a compressed phone photo
        if (image.length > 8_000_000) {
          return json({ error: "Photo is too large. Try a smaller / clearer photo." }, 413);
        }

        let lastError = "AI did not respond.";
        for (const model of MODELS) {
          let res: Response;
          try {
            res = await askModel(key, model, image);
          } catch (e) {
            lastError = `Network error contacting the AI service (${(e as Error).message}).`;
            continue;
          }

          if (!res.ok) {
            const text = (await res.text()).slice(0, 300);
            if (res.status === 401 || res.status === 403) {
              return json({ error: "AI key rejected by the gateway. Check LOVABLE_API_KEY." }, 502);
            }
            if (res.status === 429) {
              return json({ error: "AI rate limit reached. Please wait a moment and try again." }, 429);
            }
            lastError = `Model ${model} failed (${res.status}): ${text}`;
            continue; // try the next model
          }

          const payload = (await res.json().catch(() => null)) as any;
          const raw: string = payload?.choices?.[0]?.message?.content ?? "";
          const match = raw.replace(/```json|```/g, "").match(/\{[\s\S]*\}/);
          if (!match) {
            lastError = "Could not read any data from this photo. Try better lighting or a straighter angle.";
            continue;
          }
          try {
            const data = JSON.parse(match[0]);
            if (Array.isArray(data.items)) {
              data.items = data.items
                .map((it: any) => ({ product: String(it?.product ?? "").trim(), pcs: Number(it?.pcs) || 0 }))
                .filter((it: any) => it.product || it.pcs);
            }
            return json({ data, model });
          } catch {
            lastError = "The AI reply was not valid JSON. Please try again.";
          }
        }

        return json({ error: lastError }, 422);
      },
    },
  },
});