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
    
        // Проверяем, существует ли пользователь с таким именем в базе данных
        const existingUser = await User.findOne({ where: { name } });
    
        if (existingUser) {
          // Если пользователь существует, то создаем токен для него и возвращаем его в ответе
          const token = generateJwt(existingUser.id, existingUser.name);
          return res.json({ token });
        }
    
        // Если пользователь не существует, то создаем нового пользователя
        const user = await User.create({ name });
        const token = generateJwt(user.id, user.name);
        user.save();
        return res.json({ token });
      }


    // проверка токена
    async check(req, res, next) {
        const {name} = req.query
        if(!name) {
           return next(ApiError.badRequest('Не авторизованы'));
        }
        res.json(name)
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