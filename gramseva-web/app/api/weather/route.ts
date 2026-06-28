import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');
  const type = searchParams.get('type') || 'current'; // 'current' or 'forecast'

  try {
    let url: string;

    if (type === 'forecast') {
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`;
      } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`;
      } else {
        return NextResponse.json({ error: 'Provide lat/lon or city' }, { status: 400 });
      }
    } else {
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`;
      } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
      } else {
        return NextResponse.json({ error: 'Provide lat/lon or city' }, { status: 400 });
      }
    }

    const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Weather service error' }, { status: 500 });
  }
}
