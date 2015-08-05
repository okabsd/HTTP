// Colin 'Oka' Hall-Coates <yo@oka.io>
// MIT 2015

window.HTTP = !window.hasOwnProperty('HTTP') && (function() {
	var internal = {
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
		delay: 50
	};

	function action(e, fn) {
		if (e.delay) window.clearTimeout(e.delay);
		if (fn) fn.call();
		if (e.request.readyState < 2) {
			e.delay = window.setTimeout(function() {
				e.request.send(e.data);
			}, internal.delay);
		}
	}

	function HTTP(method, url) {
		var env = {
			callbacks: [],
			data: null,
			delay: null,
			request: new XMLHttpRequest()
		};
		var io = {
			cred: function() {
				return action(env, function() {
					env.request.withCredentials = true;
				}), this;
			},
			do: function(fn) {
				return action(env, function() {
					fn.call(env.request, env.request.response,
						env.request.status, env.request);
				}), this;
			},
			data: function(d) {
				return action(env, function() {
					env.data = d;
				}), this;
			},
			mime: function(m) {
				return action(env, function() {
					env.request.overrideMimeType(m);
				}), this;
			},
			set: function(h, v) {
				return action(env, function() {
					env.request.setRequestHeader(h, v);
				}), this;
			},
			then: function(fn) {
				return action(env, function() {
					env.callbacks.push(fn);
				}), this;
			}
		};

		if (internal.methods.indexOf(method.toUpperCase()) < 0) {
			url = method;
			method = 'GET';
		}

		env.request.addEventListener('load', function() {
			env.callbacks.forEach(function(fn) {
				io.do(fn);
			});
		});

		return env.request.open(method, url, true), action(env), io;
	}

	HTTP.delay = function(delay) {
		return internal.delay = delay || internal.delay, internal.delay;
	};

	function assign(method) {
		HTTP[method] = function(url) {
			return HTTP(method, url);
		};
	}

	internal.methods.forEach(assign);

	return HTTP;
}());
