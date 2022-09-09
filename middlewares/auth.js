const jwt = require('jsonwebtoken');
const ERRORS = require('../utils/utils');

// Авторзационный миддлевеар
// верифицируем токен из заголовков. Если с токеном всё в порядке, мидлвэр должен
// добавлять пейлоуд токена в объект запроса и вызывать next:
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(ERRORS.UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация!' });
  }

  // извлечём токен, есди он на месте
  const token = authorization.replace('Bearer ', '');

  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен - payload содержит id пользователя
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    res.status(ERRORS.UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация!' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
