const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const lessonRoutes = require('./lessonRoutes');
// const notificationRoutes = require('./notificationRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');

router.use('/', authRoutes);
router.use('/', courseRoutes);
router.use('/', enrollmentRoutes);
router.use('/', lessonRoutes);
// router.use('/notifications', notificationRoutes);
router.use('/', reviewRoutes);
router.use('/', userRoutes);

module.exports = router;
