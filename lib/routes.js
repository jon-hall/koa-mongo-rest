var generateRoutes,
    pluralize = require('pluralize'),
    bodyParser = require('koa-body-parser'),
    minimatch = require('minimatch');

module.exports = generateRoutes = function(app, modelName, actions, options, router) {
  if(router == null) {
    router = app;
  }
  if (options.prefix == null) {
    options.prefix = '';
  }
  modelName = pluralize(modelName);

  app.use(bodyParser());

  [ {method: 'get', path: options.prefix + ("/" + modelName), handler: actions.findAll},
    {method: 'get', path: options.prefix + ("/" + modelName + "/:id"), byId: true, handler: actions.findById},
    {method: 'post', path: options.prefix + ("/" + modelName), handler: actions.create},
    {method: 'post', path: options.prefix + ("/" + modelName + "/:id"), byId: true, handler: actions.updateById},
    {method: 'del', path: options.prefix + ("/" + modelName + "/:id"), byId: true, handler: actions.deleteById},
    {method: 'put', path: options.prefix + ("/" + modelName), handler: actions.create},
    {method: 'put', path: options.prefix + ("/" + modelName + "/:id"), byId: true, handler: actions.replaceById},
    {method: 'patch', path: options.prefix + ("/" + modelName + "/:id"), byId: true, handler: actions.updateById}].forEach(function(r) {
        var args = getHandlers(options, r);
        args.unshift(r.path);
        router[r.method].apply(router, args);
    });
};

function getHandlers(options, route) {
    var pre = options.transforms ? (options.transforms.pre || options.transforms) : {},
        post = options.transforms ? (options.transforms.post || {}) : {},
        handlers = [];

    Object.keys(pre).forEach(function(key) {
        if(minimatch(route.method, key)) {
            if(Array.isArray(pre[key])) {
                handlers = handler.concat(pre[key]);
            } else {
                handlers.push(pre[key]);
            }
        }
    });

    handlers.push(route.handler);

    Object.keys(post).forEach(function(key) {
        if(minimatch(route, key)) {
            if(Array.isArray(post[key])) {
                handlers = handler.concat(post[key]);
            } else {
                handlers.push(post[key]);
            }
        }
    });

    return handlers;
}
