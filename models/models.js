const sequelize = require('../bd');
const { DataTypes } = require('sequelize'); // для описания типа поля (string, INTEGER, и т.д) 

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false  
    }
})
const Message = sequelize.define('message', {
    id: { // Id самого сообщения
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderid: {// Id Отправителя 
        type: DataTypes.INTEGER,
        allowNull: false // Поле должно быть обязательно  заполнено 
    },
    recipientid: { // Id Получателя
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createMessage: {
        type: DataTypes.STRING
    }
})
User.hasMany(Message, { foreignKey: 'recipientid' });
Message.hasOne(User, { foreignKey: 'senderid', as: 'sender' });
Message.hasOne(User, { foreignKey: 'recipientid', as: 'recipient' });

module.exports = {
    User,
    Message
}