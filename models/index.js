const Sequelize = require('sequelize');
const GuessWhoData = require('./guessWhoData');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.GuessWhoData = GuessWhoData;

GuessWhoData.init(sequelize);
GuessWhoData.associate(db);

module.exports = db;