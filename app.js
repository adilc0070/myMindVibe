const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

dotenv.config();


const clientRoute = require('./routes/client');
const adminRoute = require('./routes/admin');
const connectDB = require('./middlewares/mongoDb');
connectDB();



app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.set('views','./views')

app.use('/',clientRoute)
app.use('/admin',adminRoute)



// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
