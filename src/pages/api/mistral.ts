import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { model, messages } = req.body;

    // Replace with the actual endpoint for Mistral API
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`, // Use Mistral's API key
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from Mistral API:", data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
