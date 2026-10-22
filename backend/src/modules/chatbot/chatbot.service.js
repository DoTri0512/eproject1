const ChatSession = require('./chatSession.model');
const chatbotEngine = require('./chatbot.engine');
const Tour = require('../tour/tour.model');
const Destination = require('../destination/destination.model');

class ChatbotService {
  /**
   * Send message and get AI response
   */
  async sendMessage({ userId = null, sessionId, message }) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    if (!message || !message.trim()) {
      throw new Error('Message content is required');
    }

    // 1. Find or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      // Derive initial title from first message
      const title = message.trim().slice(0, 45) + (message.length > 45 ? '...' : '');
      session = new ChatSession({
        userId,
        sessionId,
        title,
        messages: [],
        context: {},
      });
    } else if (userId && !session.userId) {
      session.userId = userId;
    }

    // 2. Append user message
    session.messages.push({
      sender: 'user',
      content: message.trim(),
      timestamp: new Date(),
    });

    // 3. Process AI response via Engine
    const { reply, suggestedTours, suggestedDestinations, context } = await chatbotEngine.processMessage({
      message,
      history: session.messages,
      context: session.context || {},
    });

    // 4. Append assistant message
    const assistantMessage = {
      sender: 'assistant',
      content: reply,
      suggestedTours: suggestedTours || [],
      suggestedDestinations: suggestedDestinations || [],
      timestamp: new Date(),
    };

    session.messages.push(assistantMessage);

    // Update context
    if (context) {
      session.context = {
        ...session.context,
        ...context,
      };
    }

    await session.save();

    // 5. Populate recommended tours & destinations for immediate frontend consumption
    const populatedTours = await Tour.find({ _id: { $in: suggestedTours || [] } })
      .populate('destinationId', 'name slug region image')
      .lean();

    const populatedDestinations = await Destination.find({ _id: { $in: suggestedDestinations || [] } })
      .select('name slug region image location bestSeason budgetBand')
      .lean();

    return {
      sessionId: session.sessionId,
      sessionTitle: session.title,
      reply,
      suggestedTours: populatedTours,
      suggestedDestinations: populatedDestinations,
      timestamp: assistantMessage.timestamp,
    };
  }

  /**
   * Get messages and session info by sessionId
   */
  async getSessionHistory(sessionId, userId = null) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const session = await ChatSession.findOne({ sessionId })
      .populate({
        path: 'messages.suggestedTours',
        populate: { path: 'destinationId', select: 'name slug region image' },
      })
      .populate('messages.suggestedDestinations', 'name slug region image location bestSeason budgetBand')
      .lean();

    if (!session) {
      return {
        sessionId,
        title: 'Cuộc trò chuyện mới',
        messages: [],
      };
    }

    return session;
  }

  /**
   * Get all sessions for a logged in user
   */
  async getUserSessions(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return await ChatSession.find({ userId })
      .select('sessionId title createdAt updatedAt status')
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();
  }

  /**
   * Clear / reset chat session
   */
  async clearSession(sessionId, userId = null) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    await ChatSession.findOneAndDelete({ sessionId });
    return { message: 'Chat history cleared successfully' };
  }

  /**
   * Default suggested chips
   */
  getQuickSuggestions() {
    return [
      { id: '1', text: '🏖️ Gợi ý tour biển 3N2Đ dưới 5 triệu' },
      { id: '2', text: '⛰️ Mùa này nên đi du lịch ở đâu đẹp nhất?' },
      { id: '3', text: '🗺️ Lên lịch trình khám phá Đà Nẵng cho gia đình' },
      { id: '4', text: '🏕️ Có tour trekking săn mây Sa Pa hay Hà Giang không?' },
      { id: '5', text: '💰 Tư vấn du lịch tiết kiệm cuối tuần' },
    ];
  }
}

module.exports = new ChatbotService();
