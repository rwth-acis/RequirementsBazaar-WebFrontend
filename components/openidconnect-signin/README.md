openidconnect-signin
================

<openidconnect-signin> is a custom HTML5 element that makes it really easy to login to OpenID Connect servers. It
displays a button that is optimized for single-page applications. It works with a popup instead of redirects, so the
context of your Web application in the user's browser remains the same.

Example:
```
<openidconnect-signin client-id="..." scopes="openid profile"></openidconnect-signin>
```

## Demo

Either [try it out yourself](https://rwth-acis.github.io/openidconnect-signin/) or enjoy this gif that was made with :heart::

![openidconnect-signin in action](https://i.giphy.com/zkFD9Blr2cPxm.gif)

## How to Use

Just put an `<openidconnect-signin>` element to your page. This is how you add an event listener for signin actions:
```
document.querySelector('openidconnect-signin').addEventListener('openidconnect-signin-success', new function(event) {
    // event.detail.access_token contains the access token
    // event.detail.id_token contains the id token_
});
```

If you want to get notified of signin actions within your custom elements, use the `openidconnect-signin-aware` element:
```
<openidconnect-signin-aware on-openidconnect-aware-success="handleSigninSuccess"></openidconnect-signin>
```
Through the event parameter of your `handleSigninSuccess` method you get the access token as described above. 

Further documentation is available on the [component page](https://rwth-acis.github.io/openidconnect-signin/).

## Credits

This component was forked from https://github.com/GoogleWebComponents/google-signin but then detached because of the different internals.

## License
Apache 2.0
