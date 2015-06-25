define([
    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    'app/config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/_base/declare',
    'dojo/text!app/templates/App.html',

    'esri/layers/ArcGISDynamicMapServiceLayer',

    'ijit/modules/Identify'
], function (
    BaseMap,
    BaseMapSelector,

    config,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    declare,
    template,

    ArcGISDynamicMapServiceLayer,

    Identify
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // childWidgets: Object[]
        //      container for holding custom child widgets
        childWidgets: null,

        // map: agrc.widgets.map.Basemap
        map: null,

        constructor: function () {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            config.app = this;
            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function () {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            this.identify = new Identify({
                url: config.urls.mapService,
                errorLogger: {
                    log: function () {
                        console.log(arguments);
                    }
                }
            });

            // set version number
            this.version.innerHTML = config.version;

            this.initMap();

            this.identify.setMap(this.map);

            this.inherited(arguments);
        },
        startup: function () {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            this.childWidgets.forEach(function (widget) {
                that.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        },
        initMap: function () {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false,
                showAttribution: false,
                router: true,
                infoWindow: this.identify.popup
            });

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    id: 'claro',
                    position: 'TR'
                })
            );

            this.lyr = new ArcGISDynamicMapServiceLayer(config.urls.mapService);
            this.map.addLayer(this.lyr);
            this.map.addLoaderToLayer(this.lyr);
        },
        onChange: function () {
            // summary:
            //      description
            // param: type or return: type
            console.log('app/App:onChange', arguments);

            var value = this.speedSelect.selectedOptions[0].value;
            var query;

            if (value === '0') {
                this.lyr.setDefaultLayerDefinitions();
                delete this.identify.iParams.layerDefinitions;
            } else {
                if (value === '1-6') {
                    query = "SPEED_TIER IN ('1', '2', '3', '4', '5', '6')";
                } else {
                    query = 'SPEED_TIER = \'' + value + "'";
                }
                var defs = [query, query, query, query];
                this.lyr.setLayerDefinitions(defs);
                this.identify.iParams.layerDefinitions = defs;
            }
        }
    });
});
