const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: { // имя карточки
      type: String, // имя — это строка
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String, // ссылка на картинку, строка, обязательно поле
      required: true,
    },
    owner: { // ссылка на модель автора карточки, тип ObjectId, обязательное поле;
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    },

    likes: { // список лайкнувших пост пользов, массив ObjectId, по умолчанию — пустой массив;
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },

    createdAt: { // дата создания, тип Date, значение по умолчанию Date.now.
      type: Date,
      default: Date.now,
    },
  },

  { versionKey: false }, // You should be aware of the outcome after set to false
);

module.exports = mongoose.model('card', cardSchema);
