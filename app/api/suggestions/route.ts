// app/api/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/app/_data/mockProducts'; // cập nhật đường dẫn đúng
import { fetchAISuggestions } from '@/app/_utils/util';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'user-123';

  // Giả lập localStorage trên FE: bạn có thể hardcode dữ liệu
  const cart = mockProducts.slice(0, 1);
  const favorites = [mockProducts[1].id];
  const recentlyViewed = [mockProducts[2].id];

  const suggestions = await fetchAISuggestions(userId, mockProducts, cart, favorites, recentlyViewed);

  return NextResponse.json({ suggestions });
}
