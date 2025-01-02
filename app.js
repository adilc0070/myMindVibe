const express = require('express');
const path = require('path');
const app = express();
const clientRoute = require('./routes/client');
const adminRoute = require('./routes/admin');

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.set('views','./views')

app.use('/',clientRoute)
app.use('/admin',adminRoute)



// Start the server
const PORT = process.env.PORT || 3001; // Dynamically select an available port
console.log(`Attempting to start server on port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
