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

  const behaviorText = promptLines.join('\n') || "Không có hành vi nào đáng chú ý.";

  const productDescriptions = allProducts.map(p => 
    `- ID: ${p.id}\n  Tên: ${p.name}\n  Danh mục: ${p.category}\n  Mô tả: ${p.description}`
  ).join('\n\n');

  const prompt = `
Người dùng có các hành vi như sau:
${behaviorText}

Dưới đây là danh sách khóa học có sẵn:
${productDescriptions}

👉 Dựa vào hành vi trên, chọn ra tối đa 3 khóa học phù hợp nhất từ danh sách trên. Chỉ trả về **ID khóa học**, phân cách bằng dấu phẩy. Không thêm bất kỳ giải thích nào.
`;

  try {
    const model = genAI.getGenerativeModel({ model: aiModel });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log("🧠 Gemini gợi ý ID:", text);

    const matchedIds = (text.match(/\d+/g) || []).map(id => parseInt(id));
    const excludeIds = new Set([...cart.map(p => p.id), ...favorites, ...recentlyViewed]);

    const finalSuggestions = allProducts
      .filter(p => matchedIds.includes(p.id) && !excludeIds.has(p.id))
      .slice(0, 3);

    if (finalSuggestions.length) return finalSuggestions;
    throw new Error("Không tìm được khóa học phù hợp từ Gemini.");
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