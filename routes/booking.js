const express = require('express');
const bookingRoute = express();
const Booking = require('../models/Booking');
const bookingController = require('../controller/booking');

const paginate = (req, res, next) => {
    req.pagination = {
        limit: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
    };
    req.pagination.skip = (req.pagination.page - 1) * req.pagination.limit;
    next();
};

// 1. Create a new booking
bookingRoute.post('/create', bookingController.createBooking );

// 2. List all bookings (admin side, with filters, search, and pagination)
bookingRoute.get('/admin/list', paginate, async (req, res) => {
    try {
        const { search, status, startDate, endDate } = req.query;
        const { skip, limit } = req.pagination;

        const query = {};
        if (search) {
            query.$or = [
                { userName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
            ];
        }
        if (status) query.status = status;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({ bookings, total, page: req.pagination.page });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// 3. List bookings for a specific user (user side, with filters and pagination)
bookingRoute.get('/user/list/:email', paginate, async (req, res) => {
    try {
        const { email } = req.params;
        const { search, status, startDate, endDate } = req.query;
        const { skip, limit } = req.pagination;

        const query = { email };
        if (search) {
            query.$or = [
                { userName: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
            ];
        }
        if (status) query.status = status;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({ bookings, total, page: req.pagination.page });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
});

// 4. Export bookings (admin)
bookingRoute.get('/admin/export', async (req, res) => {
    try {
        const bookings = await Booking.find();
        const csvData = bookings.map(booking => (
            `${booking.userName},${booking.email},${booking.phone},${booking.date},${booking.department},${booking.status},${booking.message}`
        )).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
        res.send(csvData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to export bookings' });
    }
});

// 5. Cancel booking (user)
bookingRoute.patch('/user/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (new Date() > new Date(booking.date) - 24 * 60 * 60 * 1000) {
            return res.status(400).json({ error: 'Cannot cancel within 24 hours of booking date' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// 6. Update booking details (user)
bookingRoute.put('/user/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, date, time, department, message } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { userName: name, phone, date, time, department, message },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// 7. Update booking details (admin)
bookingRoute.put('/admin/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

module.exports = bookingRoute;