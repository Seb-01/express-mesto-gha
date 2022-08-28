// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();

// импортируем модель
const User = require('../models/user');

const {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
