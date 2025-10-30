export async function POST(req) {
  const expectedKeys = [
    "temp",
    "RH",
    "wind",
    "rain",
    "FFMC",
    "DMC",
    "DC",
    "ISI",
    "month",
    "day",
    "area",
    "region"
  ];

  let data;
  try {
    data = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  for (const k of expectedKeys) {
    if (!(k in data)) {
      return new Response(JSON.stringify({ error: `Missing feature: ${k}` }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const v = Number(data[k]);
    if (Number.isNaN(v)) {
      return new Response(JSON.stringify({ error: `Feature ${k} must be numeric.` }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    data[k] = v;
  }

  try {
    const backendRes = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await backendRes.json().catch(() => ({}));
    return new Response(JSON.stringify(payload), {
      status: backendRes.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unable to reach prediction backend at http://127.0.0.1:5000" }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
