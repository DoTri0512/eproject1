const Destination = require('../destination/destination.model');
const Tour = require('../tour/tour.model');
const env = require('../../config/env');

/**
 * Intelligent AI Travel Consultant Engine
 * Combines RAG (Retrieval-Augmented Generation) with MongoDB knowledge base & Gemini LLM
 */
class ChatbotEngine {
  /**
   * Extract keywords, budget, duration and preferences from user query
   */
  extractUserIntent(text) {
    const lower = text.toLowerCase();
    const intent = {
      keywords: [],
      budgetMax: null,
      durationDays: null,
      region: null,
      theme: null,
      isItineraryRequest: false,
      isPriceRequest: false,
      isSeasonRequest: false,
      isGreeting: false,
    };

    // Greetings
    if (/^(xin chào|chào bạn|chào|hello|hi|alo|hey|bot ơi|ad ơi|tư vấn giúp)/i.test(lower.trim())) {
      intent.isGreeting = true;
    }

    // Itinerary & Plan
    if (/lịch trình|kế hoạch|gợi ý đi|chơi gì|ăn gì|tham quan|hành trình|lịch trình chi tiết/i.test(lower)) {
      intent.isItineraryRequest = true;
    }

    // Price & Budget
    if (/giá|chi phí|ngân sách|bao nhiêu tiền|rẻ|tiết kiệm|dưới|triệu|tr|vnd|đ/i.test(lower)) {
      intent.isPriceRequest = true;
    }

    // Extract numerical budget
    // e.g. "dưới 5 triệu", "5tr", "5.000.000", "5000000"
    const budgetMatch = lower.match(/(?:dưới|tầm|khoảng|tối đa)?\s*(\d+(?:[.,]\d+)?)\s*(triệu|tr|k|000|000\.000)?/i);
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1].replace(',', '.'));
      const unit = budgetMatch[2]?.toLowerCase();
      if (unit === 'triệu' || unit === 'tr') {
        intent.budgetMax = num * 1000000;
      } else if (unit === 'k') {
        intent.budgetMax = num * 1000;
      } else if (num < 100) {
        // usually people say "dưới 5" or "5tr"
        if (/triệu|tr/i.test(lower)) {
          intent.budgetMax = num * 1000000;
        }
      } else if (num >= 100000) {
        intent.budgetMax = num;
      }
    }

    // Extract duration (days)
    const durationMatch = lower.match(/(\d+)\s*(?:ngày|n|d)/i);
    if (durationMatch) {
      intent.durationDays = parseInt(durationMatch[1], 10);
    } else if (/cuối tuần/i.test(lower)) {
      intent.durationDays = 2;
    }

    // Regions
    if (/miền bắc|bắc bộ|hà nội|hạ long|sa pa|hà giang|ninh bình/i.test(lower)) {
      intent.region = 'Miền Bắc';
    } else if (/miền trung|đà nẵng|hội an|huế|nha trang|quy nhơn|đà lạt/i.test(lower)) {
      intent.region = 'Miền Trung';
    } else if (/miền nam|nam bộ|phú quốc|sài gòn|cần thơ|miền tây/i.test(lower)) {
      intent.region = 'Miền Nam';
    }

    // Themes
    if (/biển|đảo|lặn san hô|bãi tắm|du thuyền/i.test(lower)) {
      intent.theme = 'Biển đảo';
    } else if (/núi|rừng|trekking|leo núi|săn mây/i.test(lower)) {
      intent.theme = 'Núi rừng & Bản sắc';
    } else if (/di sản|văn hóa|lịch sử|phố cổ/i.test(lower)) {
      intent.theme = 'Văn hóa & Di sản';
    } else if (/nghỉ dưỡng|resort|spa|thư giãn/i.test(lower)) {
      intent.theme = 'Nghỉ dưỡng';
    }

    // Best Season
    if (/mùa này|mùa hè|mùa thu|mùa đông|mùa xuân|thời tiết|tháng \d+/i.test(lower)) {
      intent.isSeasonRequest = true;
    }

    return intent;
  }

  /**
   * Search matching destinations and tours from MongoDB database
   */
  async retrieveContext(text, intent) {
    const lower = text.toLowerCase();

    // 1. Fetch all active destinations
    const allDestinations = await Destination.find({}).lean();
    
    // Find destinations mentioned directly in query or matching region/theme
    let matchedDestinations = allDestinations.filter((d) => {
      const nameMatch = lower.includes(d.name.toLowerCase());
      const slugMatch = lower.includes(d.slug.toLowerCase().replace(/-/g, ' '));
      const locMatch = d.location && lower.includes(d.location.toLowerCase());
      return nameMatch || slugMatch || locMatch;
    });

    if (matchedDestinations.length === 0 && intent.region) {
      matchedDestinations = allDestinations.filter(
        (d) => d.region && d.region.toLowerCase() === intent.region.toLowerCase()
      );
    }

    if (matchedDestinations.length === 0 && intent.theme) {
      matchedDestinations = allDestinations.filter(
        (d) => d.theme && d.theme.toLowerCase().includes(intent.theme.toLowerCase())
      );
    }

    // Default to popular ones if still empty
    if (matchedDestinations.length === 0) {
      matchedDestinations = allDestinations.slice(0, 4);
    }

    const matchedDestIds = matchedDestinations.map((d) => d._id);

    // 2. Query tours corresponding to matched destinations or filters
    let tourQuery = { status: 'active' };
    if (matchedDestIds.length > 0) {
      tourQuery.destinationId = { $in: matchedDestIds };
    }

    let tours = await Tour.find(tourQuery)
      .populate('destinationId', 'name slug region image location')
      .lean();

    // If query has budget filter, filter tours having at least one duration option <= budget
    if (intent.budgetMax) {
      const filteredByBudget = tours.filter((t) =>
        t.durationOptions && t.durationOptions.some((opt) => opt.price <= intent.budgetMax)
      );
      if (filteredByBudget.length > 0) {
        tours = filteredByBudget;
      }
    }

    // If query has duration filter, sort/prioritize tours having that day count
    if (intent.durationDays) {
      tours.sort((a, b) => {
        const aHas = a.durationOptions?.some((opt) => opt.days === intent.durationDays) ? 1 : 0;
        const bHas = b.durationOptions?.some((opt) => opt.days === intent.durationDays) ? 1 : 0;
        return bHas - aHas;
      });
    }

    return {
      destinations: matchedDestinations.slice(0, 4),
      tours: tours.slice(0, 4),
    };
  }

  /**
   * Call Google Gemini API if GEMINI_API_KEY is configured
   */
  async callGeminiLLM(systemPrompt, userQuery) {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nCâu hỏi của khách du lịch: "${userQuery}"` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (!response.ok) {
        console.warn(`[ChatbotEngine] Gemini API HTTP error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return content || null;
    } catch (err) {
      console.warn('[ChatbotEngine] Gemini call failed, falling back to local engine:', err.message);
      return null;
    }
  }

  /**
   * Fallback Smart Local Travel Consultant Generator
   */
  generateLocalConsultation(text, intent, context) {
    const { destinations, tours } = context;
    const targetDest = destinations[0];
    const recommendedTour = tours[0];

    // Case 1: Simple Greeting
    if (intent.isGreeting && text.trim().split(/\s+/).length <= 4) {
      return {
        reply: `Xin chào quý khách! 👋 Em là **Trợ lý du lịch TravelTrail AI**.

Rất vui được đồng hành cùng bạn! Bạn có thể hỏi em bất cứ điều gì về du lịch Việt Nam, ví dụ như:
- 🏝️ **Gợi ý điểm đến**: Đi biển mùa hè, săn mây vùng cao, khám phá di sản cổ kính.
- 💰 **Tư vấn theo ngân sách**: Tìm tour dưới 3 triệu, 5 triệu hoặc các gói nghỉ dưỡng cao cấp.
- 📅 **Lên lịch trình**: Lên kế hoạch chi tiết từng ngày (2N1Đ, 3N2Đ, 4N3Đ) cho gia đình, cặp đôi hay nhóm bạn.

Bạn đang dự định đi du lịch ở đâu hoặc có ngân sách khoảng bao nhiêu để em tư vấn chi tiết nhé!`,
        suggestedTours: tours.slice(0, 3).map((t) => t._id),
        suggestedDestinations: destinations.slice(0, 2).map((d) => d._id),
      };
    }

    // Case 2: Specific Destination / Tour / Itinerary consultation
    let reply = '';
    const destName = targetDest ? targetDest.name : 'Việt Nam';
    const regionName = targetDest ? targetDest.region : 'cả nước';
    const season = targetDest?.bestSeason || 'quanh năm';

    reply += `Dạ, chào bạn! Dưới đây là tư vấn chi tiết cho chuyến đi **${destName}** (${regionName}):\n\n`;

    // Destination highlight
    if (targetDest?.overview) {
      reply += `🌟 **Điểm nổi bật tại ${destName}**:\n${targetDest.overview}\n\n`;
    }

    if (targetDest?.bestSeason) {
      reply += `🌤️ **Thời điểm lý tưởng nhất**: ${targetDest.bestSeason}. Khí hậu ${targetDest.climate || 'rất thuận lợi để tham quan và chụp ảnh'}.\n\n`;
    }

    // Highlight Attractions & Activities
    if (targetDest?.attractions?.length > 0) {
      reply += `📍 **Địa điểm không thể bỏ qua**: ${targetDest.attractions.slice(0, 4).join(', ')}.\n`;
    }
    if (targetDest?.activities?.length > 0) {
      reply += `🎯 **Trải nghiệm đáng thử**: ${targetDest.activities.slice(0, 4).join(', ')}.\n\n`;
    }

    // Custom Itinerary recommendation
    const durationDays = intent.durationDays || (recommendedTour?.durationOptions?.[0]?.days) || 3;
    reply += `🗓️ **Gợi ý lịch trình du lịch thông minh (${durationDays} Ngày ${durationDays > 1 ? durationDays - 1 : 1} Đêm)**:\n`;
    
    if (recommendedTour?.itinerary?.length > 0) {
      recommendedTour.itinerary.slice(0, durationDays).forEach((day) => {
        reply += `- **Ngày ${day.day}: ${day.title}**\n  _${day.description || 'Tham quan danh thắng nổi tiếng và thưởng thức ẩm thực địa phương.'}_\n`;
      });
    } else {
      reply += `- **Ngày 1: Khởi hành & Nhận phòng** – Di chuyển đến ${destName}, ăn trưa đặc sản địa phương, check-in và dạo quanh trung tâm.\n`;
      reply += `- **Ngày 2: Trải nghiệm & Khám phá chính** – Tham quan các điểm nổi tiếng (${targetDest?.attractions?.[0] || 'danh lam thắng cảnh'}), tham gia hoạt động trải nghiệm (${targetDest?.activities?.[0] || 'check-in, chụp ảnh'}), ngắm hoàng hôn và thưởng thức tiệc tối.\n`;
      if (durationDays >= 3) {
        reply += `- **Ngày 3: Mua sắm quà lưu niệm & Kết thúc** – Thưởng thức cafe sáng, mua sắm đặc sản làm quà, trả phòng và trở về.\n`;
      }
    }
    reply += `\n`;

    // Pricing & Tours info
    if (tours.length > 0) {
      reply += `💡 **Gói tour đề xuất & Chi phí dự kiến**:\n`;
      tours.slice(0, 2).forEach((t) => {
        const minPrice = t.durationOptions?.length > 0 
          ? Math.min(...t.durationOptions.map((o) => o.price)) 
          : 0;
        const formattedPrice = minPrice > 0 ? `${new Intl.NumberFormat('vi-VN').format(minPrice)}đ/khách` : 'Liên hệ';
        reply += `- **${t.title}**: Giá chỉ từ **${formattedPrice}** (Chỗ trống khả dụng: ${t.availableSeats} chỗ).\n`;
      });
      reply += `\n👉 _Bạn có thể xem chi tiết hoặc bấm **Đặt ngay** ở các thẻ tour bên dưới để giữ chỗ sớm nhé!_`;
    }

    return {
      reply,
      suggestedTours: tours.slice(0, 3).map((t) => t._id),
      suggestedDestinations: destinations.slice(0, 2).map((d) => d._id),
    };
  }

  /**
   * Main entry point to process a message
   */
  async processMessage({ message, history = [], context = {} }) {
    const intent = this.extractUserIntent(message);
    const dbContext = await this.retrieveContext(message, intent);

    // Prepare system prompt for LLM
    const destinationsSummary = dbContext.destinations
      .map(
        (d) =>
          `- Điểm đến: ${d.name} (${d.region}). Đặc điểm: ${d.overview}. Mùa đẹp nhất: ${d.bestSeason}. Điểm tham quan: ${d.attractions?.join(', ')}. Hoạt động: ${d.activities?.join(', ')}.`
      )
      .join('\n');

    const toursSummary = dbContext.tours
      .map((t) => {
        const options = t.durationOptions
          ?.map((opt) => `${opt.days}N${opt.nights}Đ: ${new Intl.NumberFormat('vi-VN').format(opt.price)}đ`)
          .join(', ');
        return `- Tour: ${t.title} (Slug: ${t.slug}). Các gói thời lượng & giá: [${options}]. Chỗ trống: ${t.availableSeats}.`;
      })
      .join('\n');

    const systemPrompt = `Bạn là TravelTrail AI Assistant - chuyên gia tư vấn du lịch hàng đầu tại Việt Nam của nền tảng TravelTrail.
Hãy trả lời du khách một cách thân thiện, chu đáo, tự nhiên và chuyên nghiệp bằng tiếng Việt.
Sử dụng Markdown rõ ràng (tiêu đề, gạch đầu dòng, in đậm từ khóa quan trọng).
Nếu khách hỏi về lịch trình, hãy lên lịch trình chi tiết (Sáng, Trưa, Chiều, Tối) cùng mẹo tiết kiệm chi phí.
Dưới đây là dữ liệu thực tế từ hệ thống TravelTrail để bạn tham khảo chính xác:
[DANH SÁCH ĐIỂM ĐẾN]:
${destinationsSummary || 'Các điểm đến nổi tiếng khắp Việt Nam.'}

[DANH SÁCH TOUR DU LỊCH CÓ SẴN]:
${toursSummary || 'Hệ thống có nhiều tour trọn gói đa dạng ngày khởi hành.'}

LƯU Ý QUAN TRỌNG:
1. Hãy khéo léo giới thiệu các tour có sẵn ở trên nếu phù hợp với nhu cầu của du khách.
2. Không bịa đặt thông tin tour không có trong dữ liệu nếu khách hỏi giá chính xác.
3. Luôn giữ phong thái nồng nhiệt, nhiệt tình hỗ trợ.`;

    // Try Gemini API first
    let llmReply = await this.callGeminiLLM(systemPrompt, message);

    if (llmReply) {
      return {
        reply: llmReply,
        suggestedTours: dbContext.tours.slice(0, 3).map((t) => t._id),
        suggestedDestinations: dbContext.destinations.slice(0, 2).map((d) => d._id),
        context: {
          budget: intent.budgetMax || context.budget,
          durationDays: intent.durationDays || context.durationDays,
          targetRegion: intent.region || context.targetRegion,
          travelTheme: intent.theme || context.travelTheme,
        },
      };
    }

    // Fallback to intelligent local rule + knowledge generator
    const localResult = this.generateLocalConsultation(message, intent, dbContext);
    return {
      reply: localResult.reply,
      suggestedTours: localResult.suggestedTours,
      suggestedDestinations: localResult.suggestedDestinations,
      context: {
        budget: intent.budgetMax || context.budget,
        durationDays: intent.durationDays || context.durationDays,
        targetRegion: intent.region || context.targetRegion,
        travelTheme: intent.theme || context.travelTheme,
      },
    };
  }
}

module.exports = new ChatbotEngine();
