// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();

// импортируем модель
const Card = require('../models/card');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
