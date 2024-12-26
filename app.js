const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page', message: 'Welcome to My Website!' });
});

app.get('/news-detail', (req, res) => {
    res.render('news-detail', { title: 'About Page', message: 'This is the about page.' });
});




// Start the server
const PORT = process.env.PORT || 3001; // Dynamically select an available port
console.log(`Attempting to start server on port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
