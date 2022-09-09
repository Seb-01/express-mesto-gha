// Чтобы отправить клиенту ошибку, в celebrate есть специальный мидлвэр — errors
const { /* errors, */ celebrate, Joi } = require('celebrate');
const imgUrlRegx = require('../utils/regexpression');

// проверка роутера при запросе сервера на создание пользователя
const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(imgUrlRegx),
    about: Joi.string().min(2).max(30),
  }),
});

// логин
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// Создание карточки
const validateCardCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(imgUrlRegx),
  }),
});

// отправка на экспорт
module.exports = {
  validateUserCreate,
  validateUserLogin,
  validateCardCreate,
};
