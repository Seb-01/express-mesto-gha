const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// обработчик ошибок celebrate
const { errors } = require('celebrate');

const ERRORS = require('./utils/utils');
const { login, createUser } = require('./controllers/users');
const { validateUserCreate } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');

// const router = require('./routes/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роут для логина и регистрации
app.post('/signin', login);
app.post('/signup', validateUserCreate, createUser);

// обеспечиваем авторизацию при запросах ниже
app.use(auth);

// роутинг организуем
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(ERRORS.NOT_FOUND).send({ message: 'Страница не найдена' });
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// здесь централизовано обрабатываем все ошибки
app.use((err, req, res) => {
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
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// Подключаем БД:
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');
