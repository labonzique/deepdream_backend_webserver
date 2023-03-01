const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const user = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    email:{type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'user'},
    ip: {type: DataTypes.STRING},
    cookie: {type: DataTypes.STRING},
    username: {type: DataTypes.STRING, allowNull: false}
}, {tableName:"user", updatedAt: 'updated', createdAt: 'created'})

module.exports = {
    user
}

