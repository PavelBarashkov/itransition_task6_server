  const {Message} = require('../models/models');
  const {User} = require('../models/models');
  const ApiError = require('../error/ApiError');
  
  class messageController{
      // получить отправителя
      async getSender(req, res, next) {
          try {
              const message = await Message.findOne({
                  where: {id: req.body.messageId},
                  include: [{model: User, as: 'sender'}]
              });

              return res.json({sender: message.senderid});
          } catch(e) {
              console.log(e);
              return next(ApiError.badRequest('Сообщение с таким ID не найдено'));
          }
      }

      // получатель
      async getRecipient(req, res, next) {
          try {
              const message = await Message.findOne({
                  where: {id: req.body.messageId},
                  include: [{model: User, as: 'recipient'}]
              });
              return res.json({recipient: message.recipientid});

          } catch(e) {
              console.log(e);
              return next(ApiError.badRequest('пользователь с таким id не найден'));
          }
      }
      async getMessage(req, res, next) {
          try {
              const date = new Date();
              const message = await Message.create({
                  senderid: req.body.senderid,
                  recipientid: req.body.recipientid,
                  theme: req.body.theme,
                  body: req.body.body,
                  createMessage: date.toLocaleString(),
              })
              res.json({message});
          } catch(e) {
              console.log(e);
          }
          
      }


      // Получить все сообщения для пользователя где он получатель
      async getMessagesRecipient(req, res) {
          try {
              const messages = await Message.findAll({
                where: { recipientid: req.query.recipientId },
                include: [
                  { model: User, as: 'sender', attributes: ['name'] },
                  { model: User, as: 'recipient', attributes: ['name'] },
                ],
              });
        
              res.json({ messages });
            } catch (e) {
              console.log(e);
            }
          }

          // Получить все сообщения для пользователя где он отправитель 
          async getMessagesSender(req, res) {
              try {
                  const messages = await Message.findAll({
                    where: { senderid: req.query.senderId },
                    include: [
                      { model: User, as: 'sender', attributes: ['name'] },
                      { model: User, as: 'recipient', attributes: ['name'] },
                    ],
                  });
            
                  res.json({ messages });
                } catch (e) {
                  console.log(e);
                }
              }

          
  }




  module.exports = new messageController();