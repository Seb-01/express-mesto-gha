// A library of string validators and sanitizers.
const validator = require('validator');

// Чтобы отправить клиенту ошибку, в celebrate есть специальный мидлвэр — errors
const {
  celebrate, Joi, Segments, // isCelebrate,
} = require('celebrate');

// const imgUrlRegx = require('../utils/regexpression');

const urlValidator = (value) => {
  const result = validator.isURL(value);
  if (result) return value;
  throw new Error('URL validation err');
};

// проверка роутера при запросе сервера на создание пользователя
const validateUserCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    // avatar: Joi.string().pattern(imgUrlRegx),
    avatar: Joi.string().custom(urlValidator),
    about: Joi.string().min(2).max(30),
  }),
});

// проверка роутера обновлении данных пользователя
const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    // avatar: Joi.string().pattern(imgUrlRegx),
    avatar: Joi.string().custom(urlValidator),
    about: Joi.string().min(2).max(30),
  }),
});

// логин
const validateUserLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// Создание карточки
const validateCardCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // link: Joi.string().required().pattern(imgUrlRegx),
    link: Joi.string().required().custom(urlValidator),
  }),
});

// получение пользователя по id
const validateGetUserById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

// Добавление лайка (валидация id карточки)
const validateCardLikeById = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

// отправка на экспорт
module.exports = {
  validateUserCreate,
  validateUserLogin,
  validateCardCreate,
  validateGetUserById,
  validateUserUpdate,
  validateCardLikeById,
};
