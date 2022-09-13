// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const { validateCardCreate, validateCardLikeById } = require('../middlewares/celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:cardId', validateCardLikeById, deleteCard);
router.put('/:cardId/likes', validateCardLikeById, likeCard);
router.delete('/:cardId/likes', validateCardLikeById, dislikeCard);

module.exports = router;
