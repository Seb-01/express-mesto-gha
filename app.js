const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// обработчик ошибок celebrate
const { errors } = require('celebrate');

const { NotFoundError } = require('./errors/not-found');
const { login, createUser } = require('./controllers/users');
const { validateUserCreate } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// Подключаем БД:
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роут для логина и регистрации
// console.log(validateUserCreate);
app.post('/signin', login);
app.post('/signup', validateUserCreate, createUser);

// обеспечиваем авторизацию при запросах ниже
app.use(auth);

// роутинг организуем
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// здесь централизовано обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
