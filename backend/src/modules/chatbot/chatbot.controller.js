const chatbotService = require('./chatbot.service');
const { successResponse, errorResponse } = require('../../utils/response');

class ChatbotController {
  /**
   * Handle incoming message from user
   */
  async sendMessage(req, res, next) {
    try {
      const { message, sessionId } = req.body;
      const userId = req.user ? req.user.id || req.user._id : null;

      if (!message || !message.trim()) {
        return errorResponse(res, 'Vui lòng nhập nội dung tin nhắn.', 400);
      }
      if (!sessionId) {
        return errorResponse(res, 'Session ID là bắt buộc.', 400);
      }

      const result = await chatbotService.sendMessage({
        userId,
        sessionId,
        message,
      });

      return successResponse(res, result, 'AI đã phản hồi thành công.', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get history of a specific session
   */
  async getSessionHistory(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user ? req.user.id || req.user._id : null;

      const session = await chatbotService.getSessionHistory(sessionId, userId);
      return successResponse(res, session, 'Lấy lịch sử cuộc trò chuyện thành công.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all past sessions for logged-in user
   */
  async getUserSessions(req, res, next) {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) {
        return errorResponse(res, 'Yêu cầu đăng nhập để xem danh sách phiên.', 401);
      }

      const sessions = await chatbotService.getUserSessions(userId);
      return successResponse(res, sessions, 'Lấy danh sách phiên trò chuyện thành công.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear session
   */
  async clearSession(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user ? req.user.id || req.user._id : null;

      const result = await chatbotService.clearSession(sessionId, userId);
      return successResponse(res, result, 'Đã làm mới cuộc trò chuyện.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get suggested quick prompt chips
   */
  async getQuickSuggestions(req, res, next) {
    try {
      const suggestions = chatbotService.getQuickSuggestions();
      return successResponse(res, suggestions, 'Lấy danh sách gợi ý thành công.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatbotController();
