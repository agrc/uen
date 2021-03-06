/* jshint maxlen:false */
define(['dojo/has', 'esri/config'], function (has, esriConfig) {
    // force api to use CORS on mapserv thus removing the test request on app load
    // e.g. http://mapserv.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('basemaps.utah.gov');

    var apiKey;
    if (has('agrc-build') === 'prod') {
        // mapserv.utah.gov
        apiKey = 'AGRC-A94B063C533889';
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        apiKey = 'AGRC-AC122FA9671436';
    } else {
        // localhost
        apiKey = 'AGRC-E5B94F99865799';
    }

    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '0.0.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: apiKey,

        urls: {
            mapService: '/arcgis/rest/services/UEN/MapServer'
        }
    };

    return window.AGRC;
});
