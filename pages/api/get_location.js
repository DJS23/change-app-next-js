export const config = { runtime: 'edge' }

export default async function handler(request) {
  // Derive location solely from Vercel geolocation headers
  const rawCity = request.headers.get('x-vercel-ip-city') || '';
  const city = decodeURIComponent(rawCity);
  const region      = request.headers.get('x-vercel-ip-country-region') || '';
  const countryCode = request.headers.get('x-vercel-ip-country')        || '';
  const country     = countryCode; // fallback to country code as country name
  const location    = [city, region, country].filter(Boolean).join(', ');

  return new Response(
    JSON.stringify({ city, region, country, countryCode, location }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}


/* export default async function handler(req, res) {
  try {
    // Disable caching
    // res.setHeader('Cache-Control', 'no-store');
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error('Geo API HTTP error:', response.status, await response.text());
      return res.status(200).json({});
    }
    const data = await response.json();
    const { city, region, country_name: country, error, reason } = data;
    
    // if ipapi returns an error or no useful fields, fallback
    if (error || (!city && !region && !country)) {
      console.warn('Geo lookup failed or empty for IP:', ip, data);
      return res.status(200).json({});
    }
    return res.status(200).json({ city, region, country });
  } catch (error) {
    console.error('Failed to fetch location:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
} */