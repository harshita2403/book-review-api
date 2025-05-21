const { Sequelize } = require('sequelize');
const path = require('path');

// Create a connection to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data.sqlite'),
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected successfully');
    // Sync all models
    await sequelize.sync();
    console.log('All models were synchronized successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };