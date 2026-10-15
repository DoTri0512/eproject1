const express = require("express");
const router = express.Router();

const authRoute = require("../modules/auth/auth.route");
const customerRoute = require("../modules/customer/customer.route");
const destinationRoute = require("../modules/destination/destination.route");
const tourRoute = require("../modules/tour/tour.route");
const bookingRoute = require("../modules/booking/booking.route");
const bookingPlanRoute = require("../modules/bookingPlan/bookingPlan.route");
const guideRoute = require("../modules/guide/guide.route");
const favouriteRoute = require("../modules/favourite/favourite.route");
const collectionRoute = require("../modules/collection/collection.route");
const contactRoute = require("../modules/contact/contact.route");
const adminRoute = require("../modules/admin/admin.route");
const uploadRoute = require("../modules/upload/upload.route");

// API Health Check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Modular Routes
router.use("/auth", authRoute);
router.use("/customers", customerRoute);
router.use("/destinations", destinationRoute);
router.use("/tours", tourRoute);
router.use("/bookings", bookingRoute);
router.use("/booking-plans", bookingPlanRoute);
router.use("/guides", guideRoute);
router.use("/favourites", favouriteRoute);
router.use("/collections", collectionRoute);
router.use("/contacts", contactRoute);
router.use("/admin", adminRoute);
router.use("/upload", uploadRoute);

module.exports = router;
