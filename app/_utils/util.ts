import { Product } from "../_interface/interface";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const aiModel = process.env.NEXT_PUBLIC_GEMINI_API_MODEL!;
const genAI = new GoogleGenerativeAI(apiKey);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const fetchAISuggestions = async (
  userId: string,
  allProducts: Product[],
  cart: Product[],
  favorites: number[],
  recentlyViewed: number[]
): Promise<Product[]> => {
  console.log(`🔍 Đang phân tích hành vi người dùng: ${userId}`);

  const getNames = (ids: number[]) =>
    ids.map(id => allProducts.find(p => p.id === id)?.name).filter(Boolean) as string[];

  const cartNames = cart.map(p => p.name);
  const favoriteNames = getNames(favorites);
  const viewedNames = getNames(recentlyViewed);

  const promptLines = [];

  if (cartNames.length) promptLines.push(`- Giỏ hàng: ${cartNames.join(', ')}`);
  if (favoriteNames.length) promptLines.push(`- Đã thích: ${favoriteNames.join(', ')}`);
  if (viewedNames.length) promptLines.push(`- Đã xem: ${viewedNames.join(', ')}`);
  console.log("📝 Hành vi người dùng:", promptLines);

  const prompt = promptLines.length
    ? `Một người dùng có hành vi sau:\n${promptLines.join('\n')}\n👉 Dựa trên đó, gợi ý tối đa 3 chủ đề khóa học phù hợp nhất. Trả về tên chủ đề, cách nhau bởi dấu phẩy.`
    : `Gợi ý 3 chủ đề khóa học phổ biến cho người mới bắt đầu trong các lĩnh vực như Lập trình, Kinh doanh, Thiết kế.`

  try {
    const model = genAI.getGenerativeModel({ model: aiModel });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log("🧠 Gemini gợi ý chủ đề:", text);

    const topics = text.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const excludeIds = new Set([...cart.map(p => p.id), ...favorites, ...recentlyViewed]);

    const matched = allProducts.filter(p =>
      !excludeIds.has(p.id) &&
      topics.some(topic =>
        p.name.toLowerCase().includes(topic) ||
        p.category.toLowerCase().includes(topic) ||
        p.description.toLowerCase().includes(topic)
      )
    );

    const unique = Array.from(new Map(matched.map(p => [p.id, p])).values());

    if (unique.length) return unique.slice(0, 3);
    throw new Error("Không tìm được khóa học phù hợp từ chủ đề Gemini.");
  } catch (err) {
    console.warn("⚠️ Lỗi khi gọi Gemini, fallback logic đang chạy:", err);

    return new Promise(resolve => {
      setTimeout(() => {
        const excludeIds = new Set([...cart.map(p => p.id), ...favorites, ...recentlyViewed]);

        let pool: Product[] = [];
        const relatedCategories = new Set([
          ...cart.map(p => p.category),
          ...allProducts.filter(p => favorites.includes(p.id) || recentlyViewed.includes(p.id)).map(p => p.category),
        ]);

        pool.push(...allProducts.filter(p => relatedCategories.has(p.category) && !excludeIds.has(p.id)));

        if (pool.length < 3) {
          pool.push(...allProducts.filter(p => !excludeIds.has(p.id)));
        }

        const shuffled = pool.sort(() => 0.5 - Math.random());
        const result = Array.from(new Map(shuffled.map(p => [p.id, p])).values()).slice(0, 3);

        resolve(result);
      }, 400);
    });
  }
};

export const getGeminiSuggestedProducts = async (userInput: string, allProducts: Product[]): Promise<Product[]> => {
  const model = genAI.getGenerativeModel({ model: aiModel });

  const prompt = `
Bạn là trợ lý AI chuyên tư vấn khóa học. Dưới đây là danh sách các khóa học đang có:

${allProducts.map((p, i) => `Khóa ${i + 1}:
- ID: ${p.id}
- Tên: ${p.name}
- Danh mục: ${p.category}
- Mô tả: ${p.description}
`).join("\n")}

Câu hỏi từ người dùng: "${userInput}"

👉 Dựa trên nội dung câu hỏi, hãy chọn ra tối đa 3 khóa học phù hợp nhất (ưu tiên liên quan nội dung, tránh suy diễn sai). Chỉ trả về danh sách ID khóa học phù hợp, phân cách bằng dấu phẩy. Không thêm giải thích.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const ids = (response.text().match(/\d+/g) ?? []) as string[];

  return allProducts.filter(p => ids.includes(p.id.toString())).slice(0, 3);
};