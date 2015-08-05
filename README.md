# HTTP

A super lightweight interface for making basic asynchronous requests, with chained methods.

Intended for use in modern browsers.

## Example

```JavaScript
HTTP.POST('/some/endpoint/somewhere')
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .mime('text/plain')
  .cred()
  .data({one: 1})
  .then(function (response, status, request) {
    console.log(response, status, request);
  });
```

## Usage

The chain begins with the `HTTP` function, or one of its methods. Each of these return an `io` object with all the chainable methods.

- `HTTP(method, url)`
- `HTTP.DELETE(url)`
- `HTTP.GET(url)`
- `HTTP.HEAD(url)`
- `HTTP.OPTIONS(url)`
- `HTTP.POST(url)`
- `HTTP.PUT(url)`

The specific methods are equivalent to passing the method string to `HTTP`.

Passing only a single parameter  to `HTTP`, that isn't a method string, will result in a default `GET` request, and the first parameter used as the `url` instead.

The following are all equivalent.

```JavaScript
HTTP('/my/endpoint.json')
HTTP('GET', '/my/endpoint.json')
HTTP.GET('/my/endpoint.json')
```

You get the idea.

Passing the wrong method string will result in total chaos. Try to avoid that.

The methods provided on the `io` object are as follows. Each one returns the `io` object for chaining.

`.cred()`

- Sets the `withCredentials` property on the `XMLHttpRequest` object to `true`.

`.do(fn([response[, status[, request]]))`

- Acts immediately upon the `XMLHttpRequest` object.
- Can be used to further customize the request.
- Can be used after the fact if a reference to the `io` object is kept.
- `this` context in `fn` set to the `XMLHttpRequest` object.

`.set(header, value)`

-  Sets or combines a header.

`.data(data)`

- Provides `data` to be sent (`POST`).
- Overrides `data` provided by previous calls in the chain.
- Will encode non-strings with their key-value pairings:
```
{one: 0, two: 1, three: 2} => 'one=0&two=1&three=2'
['one', 'two', 'three'] => '0=one&1=two&2=three'
```

`.mime(type)`

- Overrides response `mimeType`.

`.then(fn([response[, status[, request]]))`
- Adds a callback function to the list of callbacks to be invoked when the response loads.
- Callbacks are invoked in the order they are added.
- `this` context in `fn` set to the `XMLHttpRequest` object.


The request is sent when the chain ends.

Additionally, `HTTP.delay([time])` returns the internal chain delay. Can be passed a `time` (ms) parameter to change the timing.

## Support

Requires

- `XMLHttpRequest`
- `EventTarget.addEventListener`

and other ES5 standards.

Look elsewhere for `ActiveXObject` legacy support.

---

Have fun.

Colin Hall-Coates < [yo@oka.io](mailto:yo@oka.io) >

[@Okahyphen](https://twitter.com/Okahyphen)
