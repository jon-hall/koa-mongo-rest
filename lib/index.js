var generateActions, generateApi, generateRoutes;

generateRoutes = require('./routes');

generateActions = require('./actions');

module.exports = generateApi = function(app, router, model, options) {
  var actions;
  if(!(options instanceof Object)) {
      options = {};
  }
  actions = generateActions(model, options);
  generateRoutes(app, model.modelName, actions, options, router);
};
