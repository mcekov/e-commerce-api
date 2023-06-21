require('dotenv').config();
require('express-async-errors');

/* EXPRESS */
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

/* CONNECT TO DB */
const connectDB = require('./db/connect');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

/* ROUTES */
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

/* MIDDLEWARE */
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('e-commerce');
});

app.get('/api/v1', (req, res) => {
  // console.log(req.signedCookies);
  res.send('e-commerce');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
      console.log('DB Connected...');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
