
//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init () {
    const myMap = new ymaps.Map("map-yandex", {
        center: [44.828077, 34.915897], // координаты центра на карте
        zoom: 17, // коэффициент приближения карты
        controls: ['zoomControl', 'fullscreenControl', 'routeButtonControl', 'trafficControl']

        // выбираем только те функции, которые необходимы при использовании
    });
    myMap.behaviors.disable('scrollZoom');
    //Массив опций карты
    const control = {
        endPoint: myMap.controls.get('routeButtonControl'),
        traficControl: myMap.controls.get('trafficControl')
    };
    control.traficControl.showTraffic();
    // Программно установим конечную точку маршрута.
    var endPoint = 'Крым, п.г.т. Новый Свет, Набережная улица, 13';
    control.endPoint.routePanel.state.set('to', endPoint);
    // Создадим объекты из их JSON-описания и добавим их на карту.
    window.myObjects = ymaps.geoQuery({
        type: "FeatureCollection",
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [44.828077, 34.915897]
                },
                options: {
                    preset: 'islands#redIcon',
                    name: '1',
                    address: 'Набережная, 13',
                    balloonContent: 'Rest & Bar "Eщё"',
                }
            },
        ]
    }).addToMap(myMap)//;
}
// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback){
    var script = document.createElement("script");

    if (script.readyState){  // IE
        script.onreadystatechange = function(){
            if (script.readyState === "loaded" ||
                script.readyState === "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  // Другие браузеры
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
var ymap = function() {
    $('.ymap-container').ready(function(){
        // Загружаем API Яндекс.Карт
        loadScript("https://api-maps.yandex.ru/2.1/?&api=50ad4cec-134b-4bc9-8071-4ab62520d40c&lang=ru_RU&amp;loadByRequire=1", function(){
        // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
                ymaps.load(init);
            });
        }
    );
};

$(function() {
    //Запускаем основную функцию
    ymap();
});