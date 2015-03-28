/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var LayerOSM = new ol.layer.Tile({
        
        source: new ol.source.OSM()
    });  
    
var wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {'LAYERS': 'PTASIG:TI', 'TILED': true, 'SRC': 'EPSG:3763'}
    })
});
    
var map = new ol.Map({
               target: 'map', 
               renderer: 'canvas',
               layers: [
                   LayerOSM, wmsLayer  
               ],
               view: new ol.View({
                   center: ol.proj.transform([-8.444195, 40.574292], 'EPSG:4326', 'EPSG:3857'),
                   zoom: 14,
                   minZoom:13,
                   maxZoom:22
               })

});

//Controlos
//Attribution ("referências")
var omeuControloAttribution = new ol.control.Attribution({
    className:'ol-attribution', //parâmetro por defeito
    target:null //parâmetro por defeito. Coloca as referências ("attribution") numa div
});
map.addControl(omeuControloAttribution);
//Full Screen
var omeuControloFullScreen = new ol.control.FullScreen();
map.addControl(omeuControloFullScreen);
//Rodar mapa
var omeuControloRodarMapa = new ol.control.Rotate()
map.addControl(omeuControloRodarMapa);
//Barra de escala
var omeuControloBarraDeEscala = new ol.control.ScaleLine()
map.addControl(omeuControloBarraDeEscala);
//Zoom
var omeuControloZoom = new ol.control.Zoom();
map.addControl(omeuControloZoom);
//Coltrolo por defeito de Zoom, mas tem alguns parâmetros
//que pode modificar se o desejar:
//http://ol3js.org/en/master/apidoc/ol.control.Zoom.html
//Slider de zoom
var omeuControloZoomSlider = new ol.control.ZoomSlider();
map.addControl(omeuControloZoomSlider);
//Este controlo ajuda também a fazer zoom, também
