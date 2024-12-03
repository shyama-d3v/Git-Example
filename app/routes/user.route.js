const routeBaseUrl = '/api/user';
const userController = require('../controllers/user.controller');

module.exports = (app) => {
  app.post(routeBaseUrl + '/signup', userController.registerUser);
};
