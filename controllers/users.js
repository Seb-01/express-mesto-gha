const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const InternalServerError = require('../errors/internal-server');
const DuplicateError = require('../errors/duplicate-uniq-dbfield');
const UnAuthoRizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found');

// создает пользователя
module.exports.createUser = (req, res, next) => {
  console.log(req.body);
  // console.log(req);
  // значения по умолчанию используем для необязательных полей
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  console.log(name);
  console.log(about);

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => {
      console.log(hash);
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => {
      console.log(user);
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Произошла ошибка: пользователь с таким email уже существует!'));
      } else {
        // отправляем ошибку в централизованный обработчик
        next(err);
      }
    });
};

// контроллер аутентификации login: получает из запроса почту и пароль
// возвращает токен, если все ОК
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // хеш пароля нужен!
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        next(new UnAuthoRizedError('Неправильные почта или пароль!'));
      }
      // пользователь найден
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            next(new UnAuthoRizedError('Неправильные почта или пароль!'));
          }
          // аутентификация успешна - создаем JWT сроком на неделю
          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' }, // контроллер должен создавать JWT сроком на неделю
          );
          // вернём токен
          return res.send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new InternalServerError('Произошла внутрення ошибка сервера!')));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// возвращает информацию по текущему пользователю
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// обновляем профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};

// обновляем аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    // Передадим объект опций:
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user.id,
        });
      }
      next(new NotFoundError('Произошла ошибка: пользователь не найден!'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: некорректные данные!'));
      }
      next(new InternalServerError('Произошла внутрення ошибка сервера!'));
    });
};
