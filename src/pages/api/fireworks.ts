import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { model, messages } = req.body;

    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FIREWORKS_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from Fireworks API:", data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error calling Fireworks API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
