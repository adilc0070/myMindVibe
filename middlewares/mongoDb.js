const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        const uri = process.env.DB_HOST;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;