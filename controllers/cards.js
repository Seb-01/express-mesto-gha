const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const InternalServerError = require('../errors/internal-server');
const NotFoundError = require('../errors/not-found');
const PermissionError = require('../errors/permission');

// создает карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: {
        name: card.owner.name,
        about: card.owner.about,
        avatar: card.owner.avatar,
        _id: card.owner._id,
      },
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(() => next(new InternalServerError('Произошла внутрення ошибка сервера!')));
};

// удалить карточку
module.exports.deleteCard = (req, res, next) => {
  // найдем карточку для начала
  console.log(req.params.cardId);
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(card);
      if (card) {
        console.log(card.owner._id);
        console.log(req.user._id);
        console.log(card.owner._id.valueOf() === req.user._id);
        // если это карточка принадлежит пользователю
        // valueOf() потому что card.owner._id = new ObjectId("631efb509e70fef49edc57aa")
        if (card.owner._id.valueOf() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((delCard) => {
              if (delCard) {
                res.send({
                  likes: delCard.likes,
                  _id: delCard._id,
                  name: delCard.name,
                  link: delCard.link,
                  owner: {
                    name: delCard.owner.name,
                    about: delCard.owner.about,
                    avatar: delCard.owner.avatar,
                    _id: delCard.owner._id,
                  },
                  createdAt: delCard.createdAt,
                });
              }
              next(new NotFoundError('Произошла ошибка: карточка с таким id не найдена!'));
            })
            .catch((err) => {
              if (err.name === 'CastError') {
                next(new BadRequestError('Произошла ошибка: некорректные данные!'));
              }
              next(new InternalServerError('Произошла внутрення ошибка сервера!'));
            });
        } else {
          next(new PermissionError('Удалять можно только свои карточки!'));
        }
      } else {
        next(new NotFoundError('Произошла ошибка: карточка с таким id не найдена!'));
      }
    });
};

// лайкаем карточку
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({
          likes: card.likes,
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: {
            name: card.owner.name,
            about: card.owner.about,
            avatar: card.owner.avatar,
            _id: card.owner._id,
          },
          createdAt: card.createdAt,
        });
      }
      next(new NotFoundError('Произошла ошибка: карточка с таким id не найдена!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// дислайкаем карточку
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({
          likes: card.likes,
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: {
            name: card.owner.name,
            about: card.owner.about,
            avatar: card.owner.avatar,
            _id: card.owner._id,
          },
          createdAt: card.createdAt,
        });
      }
      next(new NotFoundError('Произошла ошибка: карточка с таким id не найдена!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};
