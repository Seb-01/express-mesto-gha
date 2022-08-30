const ERRORS = require('../utils/utils');
const User = require('../models/user');

// создает пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user.id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Произошла ошибка: некорректные данные' });
      }
      return res.status(ERRORS.INTERNAL_SERVER).send({ message: err.message });
    });
};

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERRORS.INTERNAL_SERVER).send({ message: err.message }));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      return res.status(ERRORS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Произошла ошибка: некорректные данные!' });
      }
      return res.status(ERRORS.INTERNAL_SERVER).send({ message: err.message });
    });
};

// обновляем профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      return res.status(ERRORS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Произошла ошибка: некорректные данные' });
      }
      return res.status(ERRORS.INTERNAL_SERVER).send({ message: err.message });
    });
};

// обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      return res.status(ERRORS.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Произошла ошибка: некорректные данные' });
      }
      return res.status(ERRORS.INTERNAL_SERVER).send({ message: err.message });
    });
};
