const express = require('express');
const router = express.Router();
const chatbotController = require('./chatbot.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { verifyToken } = require('../../utils/token');

// Optional auth middleware: sets req.user if token is present, else continues as guest
const optionalAuth = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (token) {
      req.user = verifyToken(token);
    }
  } catch (err) {
    // Invalid/expired token ignored for optional auth
    req.user = null;
  }
  next();
};

// 1. Send message to AI Chatbot (Guest & Authenticated User)
router.post('/message', optionalAuth, chatbotController.sendMessage);

// 2. Get quick suggestion prompts
router.get('/suggestions', chatbotController.getQuickSuggestions);

// 3. Get session history
router.get('/session/:sessionId', optionalAuth, chatbotController.getSessionHistory);

// 4. Clear/Reset session
router.delete('/session/:sessionId', optionalAuth, chatbotController.clearSession);

// 5. Get user sessions history (requires login)
router.get('/user-sessions', authenticate, chatbotController.getUserSessions);

module.exports = router;
