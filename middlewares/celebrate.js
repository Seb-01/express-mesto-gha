// Чтобы отправить клиенту ошибку, в celebrate есть специальный мидлвэр — errors
const {
  celebrate, Joi, Segments, // isCelebrate,
} = require('celebrate');
const imgUrlRegx = require('../utils/regexpression');
// const UnAuthoRizedError = require('../errors/unauthorized');

// проверка роутера при запросе сервера на создание пользователя
const validateUserCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(imgUrlRegx),
    about: Joi.string().min(2).max(30),
  }),
});

// логин
const validateUserLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    // email: Joi.string().required().email().error
    // (new UnAuthoRizedError('Неправильные почта или пароль!')),
    // email: Joi.string().required().email().error((err, req, res, next) => {
    //   if (isCelebrate(err)) {
    //     console.log('from celebrate!');
    //     return res.send({
    //       statusCode: 409,
    //       message: 'Неправильные email или пароль!',
    //     });
    //   }
    //   return next(err);
    // }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// Создание карточки
const validateCardCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
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
