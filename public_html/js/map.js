/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function init(){
    //TESTE COMMINT 

    var LayerOSM = new ol.layer.Tile({

            source: new ol.source.OSM()
        });  
    
    var params = {
        LAYERS: 'PTASIG:pgrouting',
        FORMAT: 'image/png'
    };
    
   /* var wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'PTASIG:TI', 'TILED': true, 'SRC': 'EPSG:3763'}
        })
    });*/

    var map = new ol.Map({
                   target: 'map', 
                   renderer: 'canvas',
                   layers: [
                       LayerOSM  
                   ],
                   view: new ol.View({
                       center: ol.proj.transform([-8.444195, 40.574292], 'EPSG:4326', 'EPSG:3857'),
                       zoom: 14,
                       minZoom:13,
                       maxZoom:22
                   })

    });


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
    
    var botaoLimpar = document.getElementById('limpar');
    botaoLimpar.addEventListener('click', function(event) {
        // Fazer reset ás entidades "ponto inicial" e "ponto destino".
        pontoInicial.setGeometry(null);
        pontoDestino.setGeometry(null);
        // Remover layer "resultado".
        map.removeLayer(resultado);
    });

}