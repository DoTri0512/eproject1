import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';

export const chatbotApi = {
  sendMessage: (data) => axiosClient.post(ENDPOINTS.CHATBOT.MESSAGE, data),
  getSuggestions: () => axiosClient.get(ENDPOINTS.CHATBOT.SUGGESTIONS),
  getSession: (sessionId) => axiosClient.get(ENDPOINTS.CHATBOT.SESSION(sessionId)),
  clearSession: (sessionId) => axiosClient.delete(ENDPOINTS.CHATBOT.CLEAR_SESSION(sessionId)),
  getUserSessions: () => axiosClient.get(ENDPOINTS.CHATBOT.USER_SESSIONS),
};

export default chatbotApi;
