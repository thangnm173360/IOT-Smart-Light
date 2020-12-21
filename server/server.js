require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//Connect to mongodb database
mongoose.connect(process.env.DATABASE_URL || 'localhost:27017/iot', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//Use middleware to parse body req to json
app.use(express.json());

//Use middleware to enable cors
app.use(cors());

const subscriberRouter = require('./routes/subscribers');
const authRouter = require('./routes/auth');
const sensorRouter = require('./routes/sensor');
const deviceRouter = require('./routes/device');
const roomRouter = require('./routes/room');
//Route middleware
app.use('/subscribers', subscriberRouter);
app.use('/api/auth', authRouter);
app.use('/api/sensor', sensorRouter);
app.use('/devices', deviceRouter);
app.use('/rooms', roomRouter);


//Start an express server
app.listen(process.env.PORT || 4000, () => console.log(`Server Started http://localhost:${process.env.PORT}`));
