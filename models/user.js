const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      default: 'Жак-Ив Кусто',
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неправильный формат email!',
      },
    },
    password: {
      type: String,
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      minlength: 8,
      select: false, // необходимо добавить поле select чтобы API не возвращал хеш пароля
    },

  },
  { versionKey: false }, // You should be aware of the outcome after set to false
);

module.exports = mongoose.model('user', userSchema);
