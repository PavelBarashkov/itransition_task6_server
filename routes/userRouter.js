const userController = require('../controllers/userController');
const authMiddleware = require('../milddleware/authMiddleware');
const Router = require('express');
const router = new Router;


// Аутентификация пользователя
router.post('/login', userController.login);

// Проверка авторизации пользователя
router.get('/auth', authMiddleware, userController.check);

// Получение списка всех пользователей
router.get('/users', userController.getListUsers); 

// Получение данных пользователя по id
router.get('/user/:id', userController.getUserId);

module.exports = router;