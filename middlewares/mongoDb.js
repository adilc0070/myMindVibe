const mongoose = require('mongoose');

const connectToDatabase = async (dbName) => {
    try {
        const uri = `mongodb+srv://adilc0070:Habeeba123@cluster0.iitpy22.mongodb.net/${dbName}?retryWrites=true&w=majority`;    
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;