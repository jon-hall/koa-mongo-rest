var generateRoutes,
    pluralize = require('pluralize'),
    bodyParser = require('koa-body-parser');

module.exports = generateRoutes = function(app, modelName, actions, options, router) {
  if(router == null) {
    router = app;
  }
  if (options.prefix == null) {
    options.prefix = '';
  }
  modelName = pluralize(modelName);

  app.use(bodyParser());

  router.get(options.prefix + ("/" + modelName), actions.findAll);
  router.get(options.prefix + ("/" + modelName + "/:id"), actions.findById);
  router.post(options.prefix + ("/" + modelName), actions.create);
  router.post(options.prefix + ("/" + modelName + "/:id"), actions.updateById);
  router.del(options.prefix + ("/" + modelName + "/:id"), actions.deleteById);
  router.put(options.prefix + ("/" + modelName), actions.create);
  router.put(options.prefix + ("/" + modelName + "/:id"), actions.replaceById);
  router.patch(options.prefix + ("/" + modelName + "/:id"), actions.updateById);
};
