import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const RAILWAY_BASE = 'https://gramseva-production-25b6.up.railway.app';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');

  // Handle special endpoints
  if (endpoint === 'states') {
    const states = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
      'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal',
    ];
    return NextResponse.json(states);
  }

  if (endpoint === 'commodities') {
    const commodities = [
      'Apple', 'Banana', 'Barley', 'Bengalgram (Chana)', 'Blackgram (Urad)',
      'Cardamom', 'Cashewnut', 'Castor', 'Coconut', 'Coffee', 'Cotton',
      'Cowpea (Lobia)', 'Ginger', 'Groundnut', 'Greengram (Moong)',
      'Jowar (Sorghum)', 'Maize', 'Mango', 'Masoor (Lentil)', 'Mustard',
      'Onion', 'Paddy (Dhan)', 'Potato', 'Ragi (Finger Millet)',
      'Rapeseed', 'Rice', 'Soyabean', 'Sugarcane', 'Sunflower',
      'Tur (Arhar)', 'Turmeric', 'Urad', 'Wheat',
    ];
    return NextResponse.json(commodities);
  }

  // Proxy market prices to Railway backend
  const state = searchParams.get('state') || '';
  const commodity = searchParams.get('commodity') || '';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  const params = new URLSearchParams();
  if (state) params.set('state', state);
  if (commodity) params.set('commodity', commodity);
  params.set('limit', limit);
  params.set('offset', offset);

  try {
    const res = await fetch(
      `${RAILWAY_BASE}/api/market-prices?${params.toString()}`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Railway API error: ${text}`, success: false, records: [], total: 0, count: 0 },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Mandi API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market prices', success: false, records: [], total: 0, count: 0 },
      { status: 500 },
    );
  }
}
