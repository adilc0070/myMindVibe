const express = require('express');
const bookingRoute = express();
const Booking = require('../models/Booking');
// 1. Create a new booking
bookingRoute.post('/create', async (req, res) => {
    try {
        const { userName, email, phone, date } = req.body;

        const newBooking = new Booking({
            userName,
            email,
            phone,
            date,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// 2. List all bookings (admin side, with filters and search)
bookingRoute.get('/admin/list', async (req, res) => {
    try {
        const { search, status, startDate, endDate } = req.query;

        // Build query object
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

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// 3. List bookings for a specific user (user side)
bookingRoute.get('/user/list/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { search, status, startDate, endDate } = req.query;

        // Build query object
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

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
});

// 4. Get a single booking by ID
bookingRoute.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// 5. Update booking details (admin)
bookingRoute.put('/update/:id', async (req, res) => {
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

// 6. Delete a booking (admin)
bookingRoute.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// 7. Update booking status (admin)
bookingRoute.patch('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking status updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});



module.exports = bookingRoute