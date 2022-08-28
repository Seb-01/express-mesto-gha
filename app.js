const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ERRORS = require('./utils/utils');

// const router = require('./routes/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// добавляем в каждый запрос объект user, из него берем id user в контроллере создания карточки:
// Добавляем ДО роутеров!
app.use((req, res, next) => {
  req.user = {
    _id: '6303ec82273ee89bb360edf4',
  };

  next();
});

// роутинг организуем
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(ERRORS.NOT_FOUND).send({ message: 'Страница не найдена' });
});

// Подключаем БД:
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');
