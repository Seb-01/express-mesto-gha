// метод Router создаёт объект, на который повесим обработчики запросов к серверу
const router = require('express').Router();
const { validateCardCreate } = require('../middlewares/celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
