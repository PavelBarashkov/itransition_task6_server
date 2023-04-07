const {User} = require('../models/models');
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');

const generateJwt = function(id, name) {
    return jwt.sign(
        {id, name},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userController {
    //авторизация и создание токена
    async login(req, res, next) {
        const { name } = req.body;
        if (!name) {
          return next(ApiError.badRequest('Некорректное имя'));
        }
        const existingUser = await User.findOne({ where: { name } });
        if (existingUser) {
          const token = generateJwt(existingUser.id, existingUser.name);
          return res.json({ token });
        }
        const user = await User.create({ name });
        const token = generateJwt(user.id, user.name);
        user.save();
        return res.json({ token });
      }

    // проверка токена
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.name)
        return res.json({token})
    }

    // получние всех пользователей
    async getListUsers(req, res, next) {
        const users = await User.findAll();
        if(!users){
            return next(ApiError.badRequest('Список пользователей пуст'));
        }
        res.json(users);
    }

    // получения пользователя по id
    async getUserId(req, res, next) {
        const user = await User.findByPk(req.params.id);
        if(!user) {
            return next(ApiError.badRequest('пользователь не найден'));
        }
        res.json(user)
    }

}

module.exports = new userController();