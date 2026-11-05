const Destination = require('../destination/destination.model');
const Tour = require('../tour/tour.model');
const env = require('../../config/env');

/**
 * Helper to remove Vietnamese diacritics for flexible fuzzy matching
 */
const removeAccents = (str) => {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Intelligent AI Travel Consultant Engine
 * Combines RAG (Retrieval-Augmented Generation) with MongoDB knowledge base & Gemini LLM
 */
class ChatbotEngine {
  /**
   * Helper parse string to monetary VND number
   */
  parseMoney(numStr, unitStr) {
    if (!numStr) return null;
    let cleanStr = numStr.toString().trim();
    // Remove thousand separators: 10.000.000 or 10,000,000
    if (/\d+\.\d{3}/.test(cleanStr)) {
      cleanStr = cleanStr.replace(/\./g, '');
    } else if (/\d+,\d{3}/.test(cleanStr)) {
      cleanStr = cleanStr.replace(/,/g, '');
    } else {
      cleanStr = cleanStr.replace(',', '.');
    }
    let num = parseFloat(cleanStr);
    if (isNaN(num)) return null;

    const unit = (unitStr || '').toLowerCase().trim();
    if (unit === 'trieu' || unit === 'triệu' || unit === 'tr') {
      return num * 1000000;
    }
    if (unit === 'k') {
      return num * 1000;
    }
    if (unit === 'vnd' || unit === 'vnđ' || unit === 'đ' || unit === 'd') {
      return num >= 10000 ? num : num * 1000000;
    }
    if (!unit && num < 100) {
      return num * 1000000;
    }
    return num;
  }

  /**
   * Extract keywords, budget, duration and preferences from user query
   * Supports both accented and unaccented Vietnamese
   */
  extractUserIntent(text) {
    const lower = text.toLowerCase();
    const rawNoAccent = removeAccents(lower);

    const intent = {
      keywords: [],
      budgetMin: null,
      budgetMax: null,
      durationDays: null,
      durationNights: null,
      region: null,
      theme: null,
      isItineraryRequest: false,
      isPriceRequest: false,
      isSeasonRequest: false,
      isGreeting: false,
    };

    // Greetings
    if (/^(xin chao|chao ban|chao|hello|hi|alo|hey|bot oi|ad oi|tu van giup|xin chào|chào bạn|chào|tư vấn giúp)/i.test(rawNoAccent.trim())) {
      intent.isGreeting = true;
    }

    // Itinerary & Plan
    if (/lich trinh|ke hoach|goi y di|choi gi|an gi|tham quan|hanh trinh|lịch trình|kế hoạch|gợi ý đi|chơi gì|ăn gì|tham quan|hành trình/i.test(rawNoAccent)) {
      intent.isItineraryRequest = true;
    }

    // Season & Weather
    if (/mua nay|mua he|mua thu|mua dong|mua xuan|thoi tiet|thoi diem|o dau dep|di dau dep|thang \d+|mùa này|mùa hè|mùa thu|mùa đông|mùa xuân|thời tiết|thời điểm|ở đâu đẹp|đi đâu đẹp|tháng \d+/i.test(rawNoAccent)) {
      intent.isSeasonRequest = true;
    }

    // Duration extraction: e.g. "3 ngay 2 dem", "3n2d", "3 ngày 2 đêm", "3n2đ", "3 ngày", "2n1d", "cuoi tuan"
    const durationMatch = rawNoAccent.match(/(\d+)\s*(?:ngay|n)(?:\s*(\d+)\s*(?:dem|d))?/i);
    if (durationMatch) {
      intent.durationDays = parseInt(durationMatch[1], 10);
      if (durationMatch[2]) {
        intent.durationNights = parseInt(durationMatch[2], 10);
      }
    } else if (/cuoi tuan|cuối tuần/i.test(rawNoAccent)) {
      intent.durationDays = 2;
      intent.durationNights = 1;
    }

    // Price & Budget detection
    if (/gia|chi phi|ngan sach|bao nhieu tien|re|tiet kiem|duoi|tren|hon|tu|trieu|tr|vnd|đ|d|giá|chi phí|ngân sách|bao nhiêu tiền|rẻ|tiết kiệm|dưới|trên|hơn|từ|triệu/i.test(rawNoAccent)) {
      intent.isPriceRequest = true;
    }

    // 1. Budget Range: e.g. "tu 3 den 5 trieu", "từ 3 đến 5tr", "3 - 5 trieu", "3 đến 5 triệu"
    const rangeMatch = rawNoAccent.match(/(?:tu|từ|tam|tầm|khoang|khoảng)?\s*(\d+(?:[.,]\d+)*)\s*(?:den|đến|-)\s*(\d+(?:[.,]\d+)*)\s*(trieu|triệu|tr|k|vnd|vnđ|d|đ)?/i);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      const unit = rangeMatch[3] || 'trieu';
      intent.budgetMin = this.parseMoney(rangeMatch[1], unit);
      intent.budgetMax = this.parseMoney(rangeMatch[2], unit);
    } else {
      // 2. Budget Min (>=): e.g. "tren 5 trieu", "hơn 5tr", "từ 5 triệu", "tối thiểu 5tr", "lon hon 5tr", ">= 10tr", "> 10 triệu"
      const minMatch = rawNoAccent.match(/(?:tren|trên|hon|hơn|tu|từ|toi thieu|tối thiểu|lon hon|lớn hơn|cao hon|cao hơn|>=|>)\s*(\d+(?:[.,]\d+)*)\s*(trieu|triệu|tr|k|vnd|vnđ|d|đ)?/i);
      if (minMatch) {
        const unit = minMatch[2] || 'trieu';
        intent.budgetMin = this.parseMoney(minMatch[1], unit);
      }

      // 3. Budget Max (<=): e.g. "duoi 5 trieu", "tối đa 5 triệu", "tam 5tr", "khoang 5 trieu", "<= 5tr", "< 5 triệu"
      const maxMatch = rawNoAccent.match(/(?:duoi|dưới|toi da|tối đa|tam|tầm|khoang|khoảng|<=|<)\s*(\d+(?:[.,]\d+)*)\s*(trieu|triệu|tr|k|vnd|vnđ|d|đ)?/i);
      if (maxMatch) {
        const unit = maxMatch[2] || 'trieu';
        intent.budgetMax = this.parseMoney(maxMatch[1], unit);
      }

      // 4. Exact / Standalone Budget: e.g. "10 trieu", "gia 10 trieu", "5tr"
      if (!intent.budgetMin && !intent.budgetMax) {
        const exactMatch = rawNoAccent.match(/(?:gia|giá|tam|tầm|khoang|khoảng|muc|mức)?\s*(\d+(?:[.,]\d+)*)\s*(trieu|triệu|tr|vnd|vnđ|d|đ)\b/i);
        if (exactMatch) {
          const unit = exactMatch[2];
          const amount = this.parseMoney(exactMatch[1], unit);
          if (/(?:duoi|dưới|toi da|tối đa|<=|<)/i.test(rawNoAccent)) {
            intent.budgetMax = amount;
          } else if (/(?:tren|trên|hon|hơn|tu|từ|toi thieu|tối thiểu|>=|>)/i.test(rawNoAccent)) {
            intent.budgetMin = amount;
          } else {
            intent.budgetTarget = amount;
            intent.budgetMin = amount * 0.8;
            intent.budgetMax = amount * 1.2;
          }
        }
      }
    }

    // Regions
    if (/mien bac|bac bo|ha noi|ha long|sa pa|sapa|ha giang|ninh binh|miền bắc|bắc bộ|hà nội|hạ long|hà giang|ninh bình/i.test(rawNoAccent)) {
      intent.region = 'Miền Bắc';
    } else if (/mien trung|da nang|hoi an|hue|nha trang|quy nhon|miền trung|đà nẵng|hội an|huế|quy nhơn/i.test(rawNoAccent)) {
      intent.region = 'Miền Trung';
    } else if (/tay nguyen|da lat|tây nguyên|đà lạt/i.test(rawNoAccent)) {
      intent.region = 'Tây Nguyên';
    } else if (/mien nam|nam bo|phu quoc|sai gon|can tho|mien tay|mui ne|phan thiet|miền nam|nam bộ|phú quốc|sài gòn|cần thơ|miền tây|mũi né|phan thiết/i.test(rawNoAccent)) {
      intent.region = 'Miền Nam';
    }

    // Themes
    if (/bien|dao|bai tam|du thuyen|lan san ho|biển|đảo|bãi tắm|du thuyền|lặn san hô/i.test(rawNoAccent)) {
      intent.theme = 'biển';
    } else if (/nui|rung|trekking|leo nui|san may|phuot|núi|rừng|leo núi|săn mây|phượt/i.test(rawNoAccent)) {
      intent.theme = 'núi';
    } else if (/di san|van hoa|lich su|pho co|co do|di sản|văn hóa|lịch sử|phố cổ|cố đô/i.test(rawNoAccent)) {
      intent.theme = 'di sản';
    } else if (/nghi duong|resort|spa|thu gian|nghỉ dưỡng|thư giãn/i.test(rawNoAccent)) {
      intent.theme = 'nghỉ dưỡng';
    }

    return intent;
  }

  /**
   * Search matching destinations and tours from MongoDB database
   */
  async retrieveContext(text, intent) {
    const lower = text.toLowerCase();
    const rawNoAccent = removeAccents(lower);

    // 1. Fetch all active destinations
    const allDestinations = await Destination.find({}).lean();

    const normalizeDestName = (str) =>
      removeAccents(str || '')
        .toLowerCase()
        .replace(/^(thanh pho|tinh|dao ngoc|vinh|co do|thi xa|pho co)\s+/i, '')
        .replace(/\s*-\s*.*$/, '')
        .trim();

    // Check if user explicitly asked for a specific destination by name or slug
    const explicitlyMentionedDests = allDestinations.filter((d) => {
      const rawName = (d.name || '').toLowerCase();
      const rawNameNoAccent = removeAccents(rawName);
      const cleanName = normalizeDestName(d.name);
      const slugClean = removeAccents((d.slug || '').replace(/-/g, ' ').toLowerCase());
      const locMatch = d.location && rawNoAccent.includes(removeAccents(d.location.toLowerCase()));

      const nameMatch = rawName && lower.includes(rawName);
      const nameNoAccentMatch = rawNameNoAccent && rawNoAccent.includes(rawNameNoAccent);
      const cleanNameMatch = cleanName && cleanName.length > 2 && rawNoAccent.includes(cleanName);
      const slugMatch = slugClean && rawNoAccent.includes(slugClean);

      return nameMatch || nameNoAccentMatch || cleanNameMatch || slugMatch || locMatch;
    });

    let matchedDestinations = [...explicitlyMentionedDests];

    // If no specific destination mentioned, match by theme or region
    if (matchedDestinations.length === 0 && intent.theme) {
      matchedDestinations = allDestinations.filter((d) => {
        const dTheme = removeAccents((d.theme || '').toLowerCase());
        const dName = removeAccents((d.name || '').toLowerCase());
        if (intent.theme === 'biển') {
          return dTheme.includes('bien') || dTheme.includes('dao') || dName.includes('ha long') || dName.includes('phu quoc') || dName.includes('mui ne') || dName.includes('da nang');
        }
        if (intent.theme === 'núi') {
          return dTheme.includes('nui') || dTheme.includes('may') || dTheme.includes('phuot') || dName.includes('sa pa') || dName.includes('ha giang');
        }
        if (intent.theme === 'di sản') {
          return dTheme.includes('di san') || dTheme.includes('van hoa') || dTheme.includes('co') || dTheme.includes('lich su') || dName.includes('hoi an') || dName.includes('ninh binh') || dName.includes('hue');
        }
        if (intent.theme === 'nghỉ dưỡng') {
          return dTheme.includes('nghi duong') || dTheme.includes('lang man');
        }
        return false;
      });
    }

    if (matchedDestinations.length === 0 && intent.region) {
      matchedDestinations = allDestinations.filter(
        (d) => d.region && d.region.toLowerCase() === intent.region.toLowerCase()
      );
    }

    // Default to diverse destinations if still empty
    if (matchedDestinations.length === 0) {
      matchedDestinations = allDestinations;
    }

    const matchedDestIds = matchedDestinations.map((d) => d._id);

    // 2. Query tours corresponding to matched destinations or filters
    let tourQuery = { status: 'active' };
    if (explicitlyMentionedDests.length > 0) {
      tourQuery.destinationId = { $in: matchedDestIds };
    } else if (intent.theme || intent.region) {
      tourQuery.destinationId = { $in: matchedDestIds };
    }

    let tours = await Tour.find(tourQuery)
      .populate('destinationId', 'name slug region image location theme bestSeason')
      .lean();

    if (tours.length === 0) {
      tours = await Tour.find({ status: 'active' })
        .populate('destinationId', 'name slug region image location theme bestSeason')
        .lean();
    }

    // Calculate global price range across all available tours
    const allPrices = [];
    tours.forEach((t) => {
      (t.durationOptions || []).forEach((opt) => {
        if (opt.price) allPrices.push(opt.price);
      });
    });
    const minAvailablePrice = allPrices.length > 0 ? Math.min(...allPrices) : 950000;
    const maxAvailablePrice = allPrices.length > 0 ? Math.max(...allPrices) : 8600000;

    let isBudgetMatched = true;

    // Filter tours by durationDays if requested
    if (intent.durationDays) {
      const filtered = tours.filter((t) =>
        t.durationOptions && t.durationOptions.some((opt) => opt.days === intent.durationDays)
      );
      if (filtered.length > 0) {
        tours = filtered;
      }
    }

    // Filter tours by budget (Min and/or Max)
    if (intent.budgetMin || intent.budgetMax) {
      const matched = tours.filter((t) =>
        t.durationOptions && t.durationOptions.some((opt) => {
          let match = true;
          if (intent.durationDays && opt.days !== intent.durationDays) match = false;
          if (intent.budgetMin && opt.price < intent.budgetMin) match = false;
          if (intent.budgetMax && opt.price > intent.budgetMax) match = false;
          return match;
        })
      );

      if (matched.length > 0) {
        tours = matched;
        isBudgetMatched = true;

        if (intent.budgetMin && !intent.budgetMax) {
          // Sort starting from the ones closest above budgetMin
          tours.sort((a, b) => {
            const minA = Math.min(...(a.durationOptions?.filter((o) => o.price >= intent.budgetMin).map((o) => o.price) || [Infinity]));
            const minB = Math.min(...(b.durationOptions?.filter((o) => o.price >= intent.budgetMin).map((o) => o.price) || [Infinity]));
            return minA - minB;
          });
        } else if (intent.budgetMax && !intent.budgetMin) {
          // Sort ascending (cheapest first)
          tours.sort((a, b) => {
            const minA = Math.min(...(a.durationOptions?.map((o) => o.price) || [Infinity]));
            const minB = Math.min(...(b.durationOptions?.map((o) => o.price) || [Infinity]));
            return minA - minB;
          });
        }
      } else {
        // NO tour matched the requested budget!
        isBudgetMatched = false;

        // Provide closest available tours as fallback:
        if (intent.budgetMin && !intent.budgetMax) {
          // User asked for high budget: sort descending so luxury/premium tours show up
          tours.sort((a, b) => {
            const maxA = Math.max(...(a.durationOptions?.map((o) => o.price) || [0]));
            const maxB = Math.max(...(b.durationOptions?.map((o) => o.price) || [0]));
            return maxB - maxA;
          });
        } else {
          // User asked for very low budget: sort ascending so budget tours show up
          tours.sort((a, b) => {
            const minA = Math.min(...(a.durationOptions?.map((o) => o.price) || [Infinity]));
            const minB = Math.min(...(b.durationOptions?.map((o) => o.price) || [Infinity]));
            return minA - minB;
          });
        }
      }
    }

    return {
      destinations: matchedDestinations,
      tours,
      isBudgetMatched,
      minAvailablePrice,
      maxAvailablePrice,
      hasExplicitDest: explicitlyMentionedDests.length > 0,
      explicitDestName: explicitlyMentionedDests[0]?.name || null,
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
   * Smart Local Travel Consultant Generator
   */
  generateLocalConsultation(text, intent, context) {
    const {
      destinations,
      tours,
      hasExplicitDest,
      isBudgetMatched = true,
      minAvailablePrice = 950000,
      maxAvailablePrice = 8600000,
    } = context;

    // Helper format VND
    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

    // SCENARIO 1: Season Request ("Mùa này nên đi du lịch ở đâu đẹp nhất?", "thời tiết mùa hè", etc.)
    if (intent.isSeasonRequest && !hasExplicitDest) {
      let reply = `Dạ, chào bạn! Mỗi mùa trong năm Việt Nam lại sở hữu những cung đường tuyệt đẹp. Dưới đây là những gợi ý điểm đến lý tưởng nhất từ hệ thống TravelTrail:\n\n`;

      const popularDests = destinations.slice(0, 4);
      popularDests.forEach((d) => {
        reply += `✨ **${d.name} (${d.region})**\n`;
        reply += `- 🌤️ **Mùa đẹp nhất**: ${d.bestSeason || 'Quanh năm'}.\n`;
        if (d.overview) {
          reply += `- 📌 **Đặc sắc**: ${d.overview}\n`;
        }
        if (d.attractions?.length > 0) {
          reply += `- 📍 **Điểm nổi bật**: ${d.attractions.slice(0, 3).join(', ')}.\n`;
        }
        reply += `\n`;
      });

      if (tours.length > 0) {
        reply += `🎯 **Các tour du lịch nổi bật phù hợp để khởi hành:**\n`;
        tours.slice(0, 3).forEach((t) => {
          const minPrice = t.durationOptions?.length > 0
            ? Math.min(...t.durationOptions.map((o) => o.price))
            : 0;
          reply += `- **${t.title}**: Giá chỉ từ **${formatMoney(minPrice)}** (${t.availableSeats} chỗ còn nhận).\n`;
        });
        reply += `\n👉 _Bạn có thể bấm vào các thẻ tour bên dưới để xem chi tiết lịch trình và đặt chỗ ngay nhé!_`;
      }

      return {
        reply,
        suggestedTours: tours.slice(0, 4).map((t) => t._id),
        suggestedDestinations: [],
      };
    }

    // SCENARIO 2: Filter by Duration, Budget (Min/Max), Theme, or Price Inquiry
    const isCriteriaSearch = (
      intent.durationDays ||
      intent.budgetMin ||
      intent.budgetMax ||
      intent.theme ||
      (intent.isPriceRequest && !hasExplicitDest)
    );

    if (isCriteriaSearch && !hasExplicitDest) {
      let filterDesc = [];
      if (intent.theme) filterDesc.push(`du lịch **${intent.theme === 'biển' ? 'biển đảo' : intent.theme}**`);
      if (intent.durationDays) filterDesc.push(`thời lượng **${intent.durationDays} Ngày ${intent.durationNights || intent.durationDays - 1} Đêm**`);
      
      let requestedBudgetDesc = '';
      if (intent.budgetMin && intent.budgetMax) {
        requestedBudgetDesc = `từ **${formatMoney(intent.budgetMin)}** đến **${formatMoney(intent.budgetMax)}/khách**`;
        filterDesc.push(`mức giá ${requestedBudgetDesc}`);
      } else if (intent.budgetMin) {
        requestedBudgetDesc = `từ **${formatMoney(intent.budgetMin)} trở lên/khách**`;
        filterDesc.push(`mức giá ${requestedBudgetDesc}`);
      } else if (intent.budgetMax) {
        requestedBudgetDesc = `dưới **${formatMoney(intent.budgetMax)}/khách**`;
        filterDesc.push(`mức giá ${requestedBudgetDesc}`);
      } else if (intent.isPriceRequest) {
        filterDesc.push(`bảng giá và các gói tour đang mở bán`);
      }

      let reply = '';

      if (!isBudgetMatched && (intent.budgetMin || intent.budgetMax || intent.budgetTarget)) {
        let budgetDesc = '';
        if (intent.budgetTarget) {
          budgetDesc = `tầm **${formatMoney(intent.budgetTarget)}/khách**`;
        } else if (intent.budgetMin && intent.budgetMax) {
          budgetDesc = `từ **${formatMoney(intent.budgetMin)}** đến **${formatMoney(intent.budgetMax)}/khách**`;
        } else if (intent.budgetMin) {
          budgetDesc = `từ **${formatMoney(intent.budgetMin)} trở lên/khách**`;
        } else if (intent.budgetMax) {
          budgetDesc = `dưới **${formatMoney(intent.budgetMax)}/khách**`;
        }

        let notFoundReply = `Dạ, rất tiếc hiện tại hệ thống TravelTrail **không có kết quả nào** phù hợp với mức giá ${budgetDesc}.\n\n`;
        notFoundReply += `📊 **Khoảng giá các tour hiện có tại hệ thống:**\n`;
        notFoundReply += `- Gói tour tiết kiệm nhất: từ **${formatMoney(minAvailablePrice)}/khách**\n`;
        notFoundReply += `- Gói tour cao cấp nhất: lên tới **${formatMoney(maxAvailablePrice)}/khách**\n\n`;
        notFoundReply += `💡 Bạn có thể thử tìm kiếm với mức ngân sách khác trong khoảng giá trên hoặc hỏi em về điểm đến cụ thể (như Phú Quốc, Đà Nẵng, Hạ Long, Sa Pa...) nhé!`;

        return {
          reply: notFoundReply,
          suggestedTours: [],
          suggestedDestinations: [],
        };
      }

      reply = `Dạ, chào bạn! Dựa trên yêu cầu ${filterDesc.join(', ')}, TravelTrail đã chọn lọc các tour phù hợp nhất trong hệ thống:\n\n`;

      if (tours.length === 0) {
        reply = `Dạ, rất tiếc hiện tại chưa có tour nào khớp với yêu cầu này. Bạn vui lòng thử tìm kiếm với điểm đến hoặc khoảng thời gian khác nhé!\n`;
        return {
          reply,
          suggestedTours: [],
          suggestedDestinations: [],
        };
      } else {
        tours.slice(0, 4).forEach((t, index) => {
          // Find option matching criteria
          let matchedOpt = t.durationOptions?.find((o) => {
            let ok = true;
            if (intent.durationDays && o.days !== intent.durationDays) ok = false;
            if (intent.budgetMin && o.price < intent.budgetMin) ok = false;
            if (intent.budgetMax && o.price > intent.budgetMax) ok = false;
            return ok;
          });

          if (!matchedOpt) {
            matchedOpt = t.durationOptions?.[0];
          }

          const priceStr = matchedOpt ? formatMoney(matchedOpt.price) : 'Liên hệ';
          const optStr = matchedOpt ? `${matchedOpt.days}N${matchedOpt.nights}Đ` : '';

          reply += `🌟 **${index + 1}. ${t.title}**\n`;
          reply += `- 💰 **Gói đề xuất (${optStr})**: **${priceStr}/khách**\n`;
          reply += `- 📍 **Điểm đến**: ${t.destinationId?.name || 'Việt Nam'} (${t.destinationId?.region || ''})\n`;
          reply += `- 🎟️ **Chỗ trống khả dụng**: ${t.availableSeats} chỗ\n`;
          if (t.overview) {
            reply += `- 📝 _${t.overview}_\n`;
          }
          reply += `\n`;
        });

        reply += `💡 **Gợi ý thêm**: Các gói tour trên đã bao gồm vé tham quan trọn gói, phương tiện đưa đón và dịch vụ hướng dẫn viên theo chương trình.\n`;
        reply += `👉 _Bạn có thể bấm trực tiếp vào thẻ tour bên dưới để xem chi tiết lịch trình và đặt vé!_`;
      }

      return {
        reply,
        suggestedTours: tours.slice(0, 4).map((t) => t._id),
        suggestedDestinations: [],
      };
    }

    // SCENARIO 3: User explicitly asked about a specific destination (e.g. "Hạ Long", "Đà Nẵng", "Sa Pa", "Phú Quốc")
    if (hasExplicitDest) {
      const targetDest = destinations[0] || {};
      const destName = targetDest.name || 'Điểm đến du lịch';
      const regionName = targetDest.region || 'Việt Nam';

      let reply = `Dạ, chào bạn! Dưới đây là thông tin tư vấn chi tiết cho chuyến đi **${destName}** (${regionName}):\n\n`;

      if (targetDest.overview) {
        reply += `🌟 **Điểm nổi bật tại ${destName}**:\n${targetDest.overview}\n\n`;
      }

      if (targetDest.bestSeason) {
        reply += `🌤️ **Thời điểm lý tưởng nhất**: ${targetDest.bestSeason}. Khí hậu ${targetDest.climate || 'rất thuận lợi để tham quan và trải nghiệm'}.\n\n`;
      }

      if (targetDest.attractions?.length > 0) {
        reply += `📍 **Địa điểm không thể bỏ qua**: ${targetDest.attractions.slice(0, 4).join(', ')}.\n`;
      }
      if (targetDest.activities?.length > 0) {
        reply += `🎯 **Trải nghiệm đáng thử**: ${targetDest.activities.slice(0, 4).join(', ')}.\n\n`;
      }

      // Custom Itinerary recommendation
      const recommendedTour = tours[0];
      const durationDays = intent.durationDays || recommendedTour?.durationOptions?.[0]?.days || 3;
      reply += `🗓️ **Gợi ý lịch trình du lịch thông minh (${durationDays} Ngày ${durationDays > 1 ? durationDays - 1 : 1} Đêm)**:\n`;

      if (recommendedTour?.itinerary?.length > 0) {
        recommendedTour.itinerary.slice(0, durationDays).forEach((day) => {
          reply += `- **Ngày ${day.day}: ${day.title}**\n  _${day.description || 'Tham quan danh thắng nổi tiếng và thưởng thức ẩm thực đặc sắc.'}_\n`;
        });
      } else {
        reply += `- **Ngày 1: Khởi hành & Nhận phòng** – Di chuyển đến ${destName}, ăn trưa đặc sản địa phương, nhận phòng và thư giãn.\n`;
        reply += `- **Ngày 2: Khám phá trọn vẹn** – Tham quan các danh thắng tiêu biểu (${targetDest.attractions?.[0] || 'điểm check-in nổi tiếng'}), trải nghiệm ẩm thực và ngắm hoàng hôn.\n`;
        if (durationDays >= 3) {
          reply += `- **Ngày 3: Mua sắm đặc sản & Kết thúc** – Thưởng thức cafe sáng, mua quà lưu niệm, trả phòng và trở về.\n`;
        }
      }
      reply += `\n`;

      if (tours.length > 0) {
        reply += `💡 **Gói tour đề xuất & Chi phí dự kiến:**\n`;
        tours.slice(0, 2).forEach((t) => {
          const minPrice = t.durationOptions?.length > 0
            ? Math.min(...t.durationOptions.map((o) => o.price))
            : 0;
          reply += `- **${t.title}**: Giá chỉ từ **${formatMoney(minPrice)}** (${t.availableSeats} chỗ khả dụng).\n`;
        });
        reply += `\n👉 _Bạn có thể xem chi tiết hoặc bấm **Đặt ngay** ở các thẻ tour bên dưới để giữ chỗ nhé!_`;
      }

      return {
        reply,
        suggestedTours: tours.slice(0, 3).map((t) => t._id),
        suggestedDestinations: [],
      };
    }

    // SCENARIO 4: General Consultation Fallback (No specific filters, general greetings or browse)
    let reply = `Dạ, chào bạn! Em là **Trợ lý du lịch TravelTrail AI**. Hệ thống TravelTrail hiện đang cung cấp rất nhiều tour du lịch trọn gói trải dài khắp ba miền đất nước:\n\n`;

    reply += `🌟 **Các điểm đến nổi bật đang được yêu thích nhất:**\n`;
    destinations.slice(0, 4).forEach((d) => {
      reply += `- **${d.name} (${d.region})**: ${d.theme || 'Điểm đến hấp dẫn'}, mùa đẹp: ${d.bestSeason || 'quanh năm'}.\n`;
    });
    reply += `\n`;

    if (tours.length > 0) {
      reply += `💡 **Các gói tour bán chạy hiện nay:**\n`;
      tours.slice(0, 3).forEach((t) => {
        const minPrice = t.durationOptions?.length > 0
          ? Math.min(...t.durationOptions.map((o) => o.price))
          : 0;
        reply += `- **${t.title}**: Giá chỉ từ **${formatMoney(minPrice)}** (${t.availableSeats} chỗ còn nhận).\n`;
      });
      reply += `\n👉 _Bạn có thể nhắn cho em ngân sách dự kiến, thời gian hoặc điểm đến bạn muốn đi để em tư vấn chi tiết hơn nhé!_`;
    }

    return {
      reply,
      suggestedTours: tours.slice(0, 3).map((t) => t._id),
      suggestedDestinations: [],
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
3. Nếu du khách hỏi mức giá mà không có tour nào trong dữ liệu đáp ứng (ví dụ: đòi hỏi giá cao hơn mức cao nhất hoặc thấp hơn mức thấp nhất trong danh sách), bạn phải giải thích rõ ràng rằng hiện tại hệ thống chưa có tour trong tầm giá đó và nêu rõ khoảng giá hiện có của các tour, sau đó mới gợi ý các tour cao cấp nhất hoặc tiết kiệm nhất gần với ngân sách của họ.
4. Luôn giữ phong thái nồng nhiệt, nhiệt tình hỗ trợ.`;

    // Try Gemini API first
    let llmReply = await this.callGeminiLLM(systemPrompt, message);

    if (llmReply) {
      return {
        reply: llmReply,
        suggestedTours: dbContext.tours.slice(0, 3).map((t) => t._id),
        suggestedDestinations: [],
        context: {
          budgetMin: intent.budgetMin || context.budgetMin,
          budgetMax: intent.budgetMax || context.budgetMax,
          durationDays: intent.durationDays || context.durationDays,
          targetRegion: intent.region || context.targetRegion,
          travelTheme: intent.theme || context.travelTheme,
        },
      };
    }

    // Smart local rule + knowledge generator
    const localResult = this.generateLocalConsultation(message, intent, dbContext);
    return {
      reply: localResult.reply,
      suggestedTours: localResult.suggestedTours,
      suggestedDestinations: localResult.suggestedDestinations,
      context: {
        budgetMin: intent.budgetMin || context.budgetMin,
        budgetMax: intent.budgetMax || context.budgetMax,
        durationDays: intent.durationDays || context.durationDays,
        targetRegion: intent.region || context.targetRegion,
        travelTheme: intent.theme || context.travelTheme,
      },
    };
  }
}

module.exports = new ChatbotEngine();
