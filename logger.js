//ublock lock host json.geoip'+'lookup.io
var userData = {
    "IP": [],
    "fingerprintHash": '',
    "userAgent": navigator.userAgent,
    "currentPath": window.location.pathname,  // Текущий путь страницы
    "currentUrl": window.location.href,        // Полный URL страницы

    "screenWidth": window.screen.width,
    "screenHeight": window.screen.height,
    "colorDepth": window.screen.colorDepth,
    "language": navigator.language,
    "timezoneOffset": new Date().getTimezoneOffset(),
    "referrer": document.referrer,
    "cookieEnabled": navigator.cookieEnabled,
    //"platform": navigator.platform
}


try {
    new Fingerprint2().get(function (fingerprint, components) {
        console.log(fingerprint); //a hash, representing your device fingerprint
        console.log(components); // an array of FP components

        userData.fingerprintHash = fingerprint; // Assign the fingerprint hash to userData

        // Additional processing or sending data can go here
    });
} catch (error) {
    console.error('Ошибка получения отпечатка устройства:', error);

    // You can also store the error in userData or perform other error handling actions
    userData.fingerprintHash = 'Ошибка получения отпечатка устройства';
}


const headers = {
    "IP": "📍 IP Address",
    "ip": "🖥️ IP Address",
    "isp": "🌐 ISP",
    "org": "🏢 Organization",
    "hostname": "🏠 Hostname",
    "latitude": "📍 Latitude",
    "longitude": "📍 Longitude",
    "postal_code": "📮 Postal Code",
    "city": "🏙️ City",
    "country_code": "## COUNTRY CODE ##",
    "country_name": "🌎 Country",
    "continent_code": "🌍 Continent Code",
    "continent_name": "🌍 Continent",
    "region": "🗺️ Region",
    "district": "📍 District",
    "timezone_name": "🕰️ Timezone",
    "connection_type": "🔗 Connection Type",
    "asn_number": "🔢 ASN Number",
    "asn_org": "🏢 ASN Organization",
    "asn": "🔢 ASN",
    "currency_code": "💵 Currency Code",
    "currency_name": "💵 Currency",
    "success": "✅ Success",
    "premium": "⭐ Premium",
    "userAgent": "🖥️ User Agent"
};

var sendIpsTelegram = function (token, chatID) {
    endpoint = 'https://api.telegram.org/' + token + '/sendMessage';
    $.getJSON('https://json.geoiplookup.io/?callback=?')
        .done(function (dataIP) { // Успешный запрос
            userData.IP = dataIP;
        })
        .fail(function (jqXHR, textStatus, errorThrown) { // Неудачный запрос
            console.error('Ошибка запроса к geoiplookup.io: ' + textStatus, errorThrown);
            userData.IP = {error: 'Ошибка запроса к geoiplookup.io: [' + textStatus + ' ' + errorThrown + ']'};

            //try @@ https://get.geojs.io/v1/ip/country.json @@
        })
        .always(function () {
            // Этот код выполнится в любом случае, независимо от успеха или неудачи запроса
            setTimeout(function () {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", endpoint, true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                var data = {
                    'chat_id': chatID, 'text': '<pre>' + JSON.stringify(userData, function replacer(key, value) {
// Возвращаем новый объект с замененными ключами
                        if (typeof value === 'object' && value !== null) {
                            const newObj = {};
                            for (const prop in value) {
                                if (value.hasOwnProperty(prop)) {
                                    const newKey = headers[prop] || prop; // Используем заголовок, если он есть, иначе оставляем ключ без изменений
                                    newObj[newKey] = value[prop];
                                }
                            }
                            return newObj;
                        }

                        return value;
                    }, 2) + '</pre>', 'parse_mode': 'html'
                }; // Данные для отправки
                xhr.send(JSON.stringify(data));
                xhr.onloadend = function () {
                    // Действия по завершению отправки данных
                };
            }, 100);
        });
}
