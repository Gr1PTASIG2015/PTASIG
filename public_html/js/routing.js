/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var params = {
    LAYERS: 'PTASIG:pgrouting',
    FORMAT: 'image/png'
};

// As features "ponto de partida" e "ponto de destino".
var pontoInicial = new ol.Feature();
var pontoDestino = new ol.Feature();
// O layer vetorial utilizado para apresentar
//as entidades ponto de partida e ponto de chegada .
var layerVetorial = new ol.layer.Vector({
    source: new ol.source.Vector({
    features: [pontoInicial, pontoDestino]
    })
});
map.addLayer(layerVetorial);


// Função de transformação para converter coordenadas de
// EPSG:3857 para EPSG:4326.
var transform = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
// Registar um listener "click" no mapa.
map.on('click', function(event) {
    if (pontoInicial.getGeometry() == null) {
    // Primeiro click.
        pontoInicial.setGeometry(new ol.geom.Point(event.coordinate));
    } else if (pontoDestino.getGeometry() == null) {
        //Segundo click.
        pontoDestino.setGeometry(new ol.geom.Point(event.coordinate));
        // Transformar as coordenadas da projeção do mapa (EPSG:3857)
        // para a projeção dos dados na base de dados (EPSG:4326).
        var coordInicial = transform(pontoInicial.getGeometry().getCoordinates());
        var coordDestino = transform(pontoDestino.getGeometry().getCoordinates());
        var viewparams = [
        'x1:' + coordInicial[0], 'y1:' + coordInicial[1],
        'x2:' + coordDestino[0], 'y2:' + coordDestino[1]
        ];
        params.viewparams = viewparams.join(
        ';');
        resultado = new ol.layer.Image({
            source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: params
        })
        });
        map.addLayer(resultado);
    }
});
