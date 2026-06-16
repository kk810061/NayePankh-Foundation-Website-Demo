require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const authRoute = require('./routes/auth');
const volunteerRoute = require('./routes/volunteer');
const programsRoute = require('./routes/program');
const applicationRoute = require('./routes/application');
const adminRoute = require('./routes/admin');
const errorHandler = require('./middleware/error-handler');

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/volunteer', volunteerRoute);
app.use('/api/programs', programsRoute);
app.use('/api/application', applicationRoute);
app.use('/api/admin', adminRoute);

app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
    try{
        await connectDB(process.env.URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        });
    }
    catch (err) {
        console.log(err)
    }
};

start();