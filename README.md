# Load Script

__This project is still under development.__

This small helper can help you load scripts like [Google Map Api](https://developers.google.com/maps/documentation/javascript/tutorial), [Google OAuth Api](https://developers.google.com/api-client-library/javascript/samples/samples#authorizing-and-making-authorized-requests) to your client side javascript. So you don't have to specify a global callback in the script src which will get called after the script is fully loaded. It is inspired by [load-google-maps-api](https://github.com/yuanqing/load-google-maps-api).

## Usage

### Examples

#### Google Map Api

To use google map, you have to do do

__Before:__

```html
<body>
    <div id="map"></div>
    <script>
      var map;
      function initMap() {
        map = new google.maps.Map(//...);
      }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    async defer></script>
  </body>
```

It sucks when you want to use it your individual React or Vue components. With this help you can

__After:__

```js
import {load} from '@zaichaopan/load-script'

let map;

load({
    src: 'https://maps.googleapis.com/maps/api/js',
    callbackName: 'callback',
    resolve: 'google'
    params: {
     key: your_app_key,
     libraries: 'places'
    }
}).then(google => {
    map = new google.maps.map(//...)
})
```

#### Google OAuth Api

```js
import {load} from '@zaichaopan/load-script'

let gapi

load({
    src: 'https://apis.google.com/js/platform.js',
    callbackName: 'onload',
    resolve: 'gapi'
}).then(googleGapi => {
    gapi = googleGapi
    //...
})

```
