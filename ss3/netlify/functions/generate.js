exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const appPassword = process.env.APP_PASSWORD;
  const authHeader = event.headers["x-app-password"];
  if (!appPassword || authHeader !== appPassword) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "HF_API_KEY not configured" }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { prompt, negative_prompt } = parsed;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negative_prompt || "",
            num_inference_steps: 4,
            guidance_scale: 0,
            width: 512,
            height: 512,
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errText })
      };
    }

    // HF returns binary image
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64, mimeType: "image/jpeg" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
