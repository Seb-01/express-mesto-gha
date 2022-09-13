const jwt = require('jsonwebtoken');
const UnAuthoRizedError = require('../errors/unauthorized');

// Авторзационный миддлевеар
// верифицируем токен из заголовков. Если с токеном всё в порядке, мидлвэр должен
// добавлять пейлоуд токена в объект запроса и вызывать next:
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthoRizedError('Необходима авторизация!'));
  }

  // извлечём токен, если он на месте
  const token = authorization.replace('Bearer ', '');
  console.log(token);

  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен - payload содержит id пользователя
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnAuthoRizedError('Необходима авторизация!'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
