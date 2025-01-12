const mongoose = require('mongoose');

const connectToDatabase = async (dbName) => {
    try {
        const uri = `mongodb://localhost:27017/${dbName}`;    
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
