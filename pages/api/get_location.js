

export default async function handler(req, res) {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    res.status(200).json({
      city: data.city,
      region: data.region,
      country: data.country_name
    });
  } catch (error) {
    console.error('Failed to fetch location:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
}