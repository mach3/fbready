
# FBReady

Prepare all stuffs for using Facebook JavaScript SDK

## Features

- Append "fb-root" element (if not exists)
- Append Facebook JavaScript SDK resource (if not exists)
- `on()` let you attach callback for "ready", "login" event
- `render()` will parse XFBML (ex: Like Button) without asynchronous context

## Usage

Firstly, get your application id on [https://developers.facebook.com/](https://developers.facebook.com/), 
then initialize FBReady with the appId.

```javascript
var fbready = new FBReady( your_application_id );
```

You don't need to install "fb-root" or script code to import SDK.

### "ready" Event

Attach callback for "ready" event. 
This will be called when anything about connection is done.

```javascript
fbready.on("ready", function(){
	console.log("Connected to Facebook !");
});
```

### "login" Event

To do something with authenticated context, "login" event is usable.

```javascript
fbready.on("login", function(){
	console.log("Logged in !");
	FB.api(...);
});
```

FBReady doesn't have any interface to login. 
Call `FB.login()` on your own context.

### Show Facebook Widget

Use `render` to show XFBML widget such as "Like Button".

```javascript
fbready.render();
```

No need to call it in callback.
`render()` just registers callback and waits for preparing application.


## Confliction

- If `FB` object exists, FBReady try to use the `FB` and doesn't install new "all.js".

- If `FB.init()` has been already called, that looks like working but not good.   
  You will see a message like "FB.init has already been called".  
  It may be caused by installing code for widgets such as "Like Button"  
  because they call automatically `FB.init`.

- In context of callback for `FB.getLoginStatus()`, FBReady does not work.

## API

### Events

- ready : Connection process is done
- login : Logged in

### Methods

#### on(name:String, callback:Function)

Register callback for the named event.

#### fire(name:String)

Fire the named event.

#### render()

Render facebook widgets on the page.  
This call `FB.XFBML.parse()`


## Author

mach3

- [Website](http://www.mach3.jp)
- [Blog](http://blog.mach3.jp)
- [Twitter](http://twitter.com/mach3ss)
