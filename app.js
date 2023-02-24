const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');

app.use(express.json());
app.use(cors())

const userRoute = require('./Routes/users');
const moviesRoute = require('./Routes/movies')

app.use('/user', userRoute);
app.use('/', moviesRoute);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, options);
        console.log('Connected to Database')
    } catch (error) {
        console.log(error)
    }
}
connectToDb()

app.listen(1337, () => {
    console.log('Server running')
})