# Load Script

Load script into client javascript and returns a promise

## Usage

This thin helper can help you load scripts like [Google Map Api](https://developers.google.com/maps/documentation/javascript/tutorial), [Google OAuth Api](https://developers.google.com/api-client-library/javascript/samples/samples#authorizing-and-making-authorized-requests) to your client side javascript. So you don't have to specify a global callback in the script src which will get called after the script is fully loaded. It is inspired by [load-google-maps-api](https://github.com/yuanqing/load-google-maps-api).

### Installation

```bash
npm install --save @zaichaopan/load-script
```

### Import helper

```js
import { load } from '@zaichaopan/load-script'

```

Now use method __load__ to load the script you want. This method takes an object as parameter. This object should contain 3 required properties.

- __src__: a string to specify the script you want to load
- __callbackName__: a string to specify the name that the script will use to look for callback function name when it finished loading
- __resolve__: a string to specify the name of property that the script will assign the resolved value to.

If the script requires more parameters, like google map api requires key and libraries name. You can add assign them to a property called __params__, along with required properties: src, callbackName and resolve.

### Examples

#### Google Map Api

To use google map, you have to do

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

It sucks when you want to use it your individual React or Vue components. With this helper you can

__After:__

```js
import { load } from '@zaichaopan/load-script'

let map;

load({
    src: 'https://maps.googleapis.com/maps/api/js',
    callbackName: 'callback',
    resolve: 'google',
    params: {
     key: your_app_key,
     libraries: 'places'
    }
}).then(google => {
    map = new google.maps.map(//...)
})
```

__Note__:

After a script is loaded and resolve the value, the value will be cached. So it will not load the script twice.

#### Google OAuth Api

```js
import { load } from '@zaichaopan/load-script'

let gapi

load({
    src: 'https://apis.google.com/js/platform.js',
    callbackName: 'onload',
    resolve: 'gapi',
}).then(googleGapi => {
    gapi = googleGapi
    //...
})
```
