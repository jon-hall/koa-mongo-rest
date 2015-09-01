var generateRoutes,
    pluralize = require('pluralize'),
    bodyParser = require('koa-body-parser');

module.exports = generateRoutes = function(app, modelName, actions, prefix, router) {
  if(router == null) {
    router = app;
  }
  if (prefix == null) {
    prefix = '';
  }
  modelName = pluralize(modelName);

  app.use(bodyParser());

  router.get(prefix + ("/" + modelName), actions.findAll);
  router.get(prefix + ("/" + modelName + "/:id"), actions.findById);
  router.post(prefix + ("/" + modelName), actions.create);
  router.post(prefix + ("/" + modelName + "/:id"), actions.updateById);
  router.del(prefix + ("/" + modelName + "/:id"), actions.deleteById);
  router.put(prefix + ("/" + modelName), actions.create);
  router.put(prefix + ("/" + modelName + "/:id"), actions.replaceById);
  router.patch(prefix + ("/" + modelName + "/:id"), actions.updateById);
};
