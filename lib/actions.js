module.exports = function(model, options) {
  if(!(options instanceof Object)) {
    options = {};
  }

  if(typeof options.projection !== 'string') {
      options.projection = '';
  }

  return {
    findAll: function*(next) {
      yield next;
      var error, result;
      try {
        var conditions = {};
        var query = this.request.query;
        if (query.conditions) {
          conditions = JSON.parse(query.conditions);
        }
        var builder = model.find(conditions, options.projection);
        ['limit', 'skip', 'sort'].forEach(function(key){
          if (query[key]) {
            builder[key](query[key]);
          }
        })
        result = yield builder.exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    findById: function*(next) {
      yield next;
      var error, result;
      try {
        result = yield model.findById(this.params.id, options.projection).exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    deleteById: function*(next) {
      yield next;
      var error, result;
      try {
        result = yield model.findByIdAndRemove(this.params.id, { select: options.projection }).exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    replaceById: function*(next) {
      yield next;
      var error, newDocument, result;
      try {
        yield model.findByIdAndRemove(this.params.id).exec();
        newDocument = this.request.body;
        newDocument._id = this.params.id;
        result = yield model.create(newDocument);
        return this.body = applyProjection(result, options.projection);
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    updateById: function*(next) {
      yield next;
      var error, result;
      try {
        if(options.processUpdates) {
          result = yield model.findById(this.params.id).exec();
          Object.keys(this.request.body).forEach(key => result.set(key, this.request.body[key]), this);
          yield result.save();
          result = applyProjection(result, options.projection);
        } else {
          result = yield model.findByIdAndUpdate(this.params.id, this.request.body, {
              new: true,
              select: options.projection
          }).exec();
        }

        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    create: function*(next) {
      yield next;
      var error, result;
      try {
        result = yield model.create(this.request.body);
        this.status = 201;
        return this.body = applyProjection(result, options.projection);
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    }
  };
};

function applyProjection(object, projection) {
    return projection.split(' ').reduce((o, p) => { return o[p] = object[p], o; }, {});
}
