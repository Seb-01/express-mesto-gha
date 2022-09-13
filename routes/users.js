// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const { validateGetUserById, validateUserUpdate } = require('../middlewares/celebrate');

const {
  getUsers, getCurrentUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser); // получение информации о текущем пользователе
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateUserUpdate, updateAvatar);

module.exports = router;
