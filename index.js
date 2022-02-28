const express = require("express");
const cors = require('cors');
const rateLimit = require('express-rate-limit');


require('dotenv').config();

const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());

const limiter = rateLimit({
    windowMs : 10 * 60 * 1000, // 10 Mins
    max : 10
})

app.use(limiter);
app.set('trust proxy', 1);



app.use('/api', require('./routes/api'));

app.listen(PORT, () => console.log('Listening' + PORT));