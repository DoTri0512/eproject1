const express = require('express');
const router = express.Router();
const bookingPlanController = require('./bookingPlan.controller');
const {
  validateBookingPlan,
  validateAssignGuide,
} = require('./bookingPlan.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// All booking plan management requires admin role
router.use(authenticate, authorize('admin'));

router.get('/', bookingPlanController.getAllPlans);
router.post('/', validateBookingPlan, bookingPlanController.createPlan);
router.get('/:id', bookingPlanController.getPlanById);
router.put('/:id/assign-guide', validateAssignGuide, bookingPlanController.assignGuide);
router.put('/:id/status', bookingPlanController.updateStatus);
router.post('/:id/passengers', bookingPlanController.addPassenger);
router.delete('/:id', bookingPlanController.deletePlan);

module.exports = router;
