const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controllers');
const userRouter = require('./routes/user.routes');
const chatRouter = require('./routes/chat.routes');
const messageRouter = require('./routes/message.routes');

const app = express();

const { NODE_ENV = 'production' } = process.env;
const corsOptions = {
  origin: true,
  credentials: true,
};
const limiter = rateLimit({
  max: 1000,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again later',
});

app.disable('x-powered-by');

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}
app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
