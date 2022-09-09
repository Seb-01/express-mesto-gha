// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();

const {
  getUsers, getCurrentUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser); // получение информации о текущем пользователе
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
