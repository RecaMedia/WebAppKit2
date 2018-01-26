const Sequelize = require('sequelize');
const env = (process.argv[2]?process.argv[2]:process.env.name);
var connection;

// Set database connection based on environment
if (env == 'production') {
  connection = new Sequelize('DBname','user','pass',{
    dialect: 'mysql'
  });
} else {
  connection = new Sequelize('devDBname','user','pass',{
    dialect: 'mysql'
  });
}

module.exports = {
  Sequelize: Sequelize,
  instance: connection
};