import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const reference = String(req.query.reference ?? "").trim();
  if (!reference) return res.status(400).json( { error: "reference is required" });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json( { error: "PAYSTACK_SECRET_KEY not set" });

  try {
    const psRes = await fetch(
      "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
      {
        headers: {
          Authorization: "Bearer " + secret,
        },
      }
    );

    const data = await psRes.json().catch(() => ({}));

    if (!psRes.ok) {
      return res.status(psRes.status).json(data);
    }

    const status = (data as any)?.data?.status ?? "pending";

    if (status === "success") {
      const inviteUrl =
        process.env.DISCORD_INVITE_URL,
        process.env.DISCORD_INVITE_LINK,
        process.env.DISCORD_INVITE,,
        """;
      return res.status(200).json({
        status: "success",
        inviteUrl,
        raw: data,
      });
    }

    return res.status(200).json( {
      status,
      raw: data,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Paystack verification error" });
  }
}
