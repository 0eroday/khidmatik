const helmet = require('helmet');
const morgan = require('morgan');

module.exports = function(app, express) {
  app.use(helmet());
  app.use(morgan('dev')); 
  app.use(express.json({ extended: false }));
};

