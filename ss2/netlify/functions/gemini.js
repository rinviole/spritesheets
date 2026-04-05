exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const appPassword = process.env.APP_PASSWORD;
  const authHeader = event.headers["x-app-password"];
  if (!appPassword || authHeader !== appPassword) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { model, body } = parsed;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
