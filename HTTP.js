// Colin 'Oka' Hall-Coates <yo@oka.io> MIT 2015

HTTP = (function () {
  var methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];

  function assign (method) {
    HTTP[method] = function (url) {
      return HTTP(method, url);
    };
  }

  function chain (e, fn) {
    clearTimeout(e.t);

    if (fn) fn.call();

    if (e.r.readyState < 2) {
      e.t = setTimeout(function () {
        e.r.send(e.data);
      }, 50);
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
      c: [],
      r: new XMLHttpRequest()
    };
    var io = {
      cred: function () {
        return chain(env, function () {
          env.r.withCredentials = true;
        }), io;
      },
      do: function (fn) {
        return chain(env, function () {
          fn.call(env.r, env.r.response,
            env.r.status, env.r);
        }), io;
      },
      data: function (d) {
        return chain(env, function () {
          env.d = compress(d);
        }), io;
      },
      mime: function (m) {
        return chain(env, function () {
          env.r.overrideMimeType(m);
        }), io;
      },
      set: function (h, v) {
        return chain(env, function () {
          env.r.setRequestHeader(h, v);
        }), io;
      },
      then: function (fn) {
        return chain(env, function () {
          env.c.push(fn);
        }), io;
      }
    };

    if (!url) {
      url = method;
      method = 'GET';
    }

    env.r.onload =  function () {
      env.c.forEach(function (fn) {
        io.do(fn);
      });
    };

    return env.r.open(method, url, true), chain(env), io;
  }

  return methods.forEach(assign), HTTP;
}());
