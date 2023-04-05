const Router = require('express');
const router = new Router;
const messageController = require('../controllers/messageController')

// отправить сообщение
router.post('/getmessage', messageController.getMessage); 

// получить отправителя
router.get('/sender', messageController.getSender);

// получатель
router.get('/recipient', messageController.getRecipient);

// получbnm все сообщения где он получатель
router.get('/recipientmessages', messageController.getMessagesRecipient);

router.get('/sendermessages', messageController.getMessagesSender);


module.exports = router;