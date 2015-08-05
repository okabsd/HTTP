// Colin 'Oka' Hall-Coates <yo@oka.io>
// MIT 2015

window.HTTP = !window.hasOwnProperty('HTTP') && (function () {
  var internal = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    delay: 50
  };

  function assign (method) {
    HTTP[method] = function (url) {
      return HTTP(method, url);
    };
  }

  function chain (e, fn) {
    if (e.timer) window.clearTimeout(e.timer);

    if (fn) fn.call();

    if (e.request.readyState < 2) {
      e.timer = window.setTimeout(function () {
        e.request.send(e.data);
      }, internal.delay);
    }
  }

  function compress (o) {
    return typeof o === 'string' ? o :
      Object.keys(o).map(function (k) {
        return k + '=' + o[k];
      }).join('&');
  }

  function HTTP (method, url) {
    var env = {
      callbacks: [],
      data: null,
      timer: null,
      request: new XMLHttpRequest()
    };
    var io = {
      cred: function () {
        return chain(env, function () {
          env.request.withCredentials = true;
        }), this;
      },
      do: function (fn) {
        return chain(env, function () {
          fn.call(env.request, env.request.response,
            env.request.status, env.request);
        }), this;
      },
      data: function (d) {
        return chain(env, function () {
          env.data = compress(d);
        }), this;
      },
      mime: function (m) {
        return chain(env, function () {
          env.request.overrideMimeType(m);
        }), this;
      },
      set: function (h, v) {
        return chain(env, function () {
          env.request.setRequestHeader(h, v);
        }), this;
      },
      then: function (fn) {
        return chain(env, function () {
          env.callbacks.push(fn);
        }), this;
      }
    };

    if (internal.methods.indexOf(method.toUpperCase()) < 0) {
      url = method;
      method = 'GET';
    }

    env.request.addEventListener('load', function () {
      env.callbacks.forEach(function (fn) {
        io.do(fn);
      });
    });

    return env.request.open(method, url, true), chain(env), io;
  }

  HTTP.delay = function (delay) {
    return internal.delay = delay || internal.delay, internal.delay;
  };

  return internal.methods.forEach(assign), HTTP;
}());
