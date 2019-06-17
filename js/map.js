//Переменная для включения/отключения индикатора загрузки
var spinner = $('.ymap-container').children('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
let coord = {
    bar : {
        coordinates: [44.8272302, 34.9149547],
    },
};
//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init () {
    const myMap = new ymaps.Map("map-yandex", {
        center: [44.8272302, 34.9149547], // координаты центра на карте
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

    // Создадим объекты из их JSON-описания и добавим их на карту.
    window.myObjects = ymaps.geoQuery({
        type: "FeatureCollection",
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [44.8272302, 34.9149547]
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
    // Программно установим конечную точку маршрута.
    let endPoint = 'Крым, п.г.т. Новый Свет, Набережная улица, 13';
    control.endPoint.routePanel.state.set('to', endPoint);
    // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
    let layer = myMap.layers.get(0).get(0);

        // Решение по callback-у для определения полной загрузки карты
        waitForTilesLoad(layer).then(function () {
            // Скрываем индикатор загрузки после полной загрузки карты
            spinner.removeClass('is-active');
        });

        if(check_if_load){
            let jsTrigger = document.querySelectorAll('.js-tab-trigger[data-tab]');
            jsTrigger.forEach(
                function(trigger) {
                    trigger.addEventListener('click' || 'touch', showByTrigger)
                }
            );
        }
}

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
        var tc = getTileContainer(layer), readyAll = true;
        tc.tiles.each(function (tile, number) {
            if (!tile.isReady()) {
                readyAll = false;
            }
        });
        if (readyAll) {
            resolve();
        } else {
            tc.events.once("ready", function() {
                resolve();
            });
        }
    });
}

function getTileContainer(layer) {
    for (var k in layer) {
        if (layer.hasOwnProperty(k)) {
            if (
                layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
            ) {
                return layer[k];
            }
        }
    }
    return null;
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
            if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                check_if_load = true;

                // Показываем индикатор загрузки до тех пор, пока карта не загрузится
                spinner.addClass('is-active');
                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?&api=50ad4cec-134b-4bc9-8071-4ab62520d40c&lang=ru_RU&amp;loadByRequire=1", function(){
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
                    ymaps.load(init);

                });
            }
        }
    );
};

$(function() {
    //Запускаем основную функцию
    ymap();
});