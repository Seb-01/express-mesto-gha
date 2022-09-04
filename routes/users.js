// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
// для подключения валидации как мидлвэр к роуту
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().unique().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
