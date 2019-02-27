const http = require("http"),
    config = require("./config"),
    fs = require("fs"),
    request = require("request-promise-native");

http.createServer((handler)).listen(8080, () => console.log("Weather web service has started!"));

async function handler(req, res) {
    const start = Date.now();

    res.writeHead(200, {'Content-Type': 'application/json'});

    let result;
    const location = extractLatLong(req.url),
        apiUrl = `http://${config.api_url}${location}&APPID=${config.api_key}`;
    try {
        result = await request.get(apiUrl);
        result = JSON.parse(result);
    }
    catch (err) {
        console.error(err);
        const error = JSON.stringify({
            "code": 550,
            "message": err
        });
        log(req, error, Date.now() - start);
        return res.end(error);
    }
    if (result.cod !== 200) {
        const error = JSON.stringify({
            "code": 551,
            "message": "Invalid code"
        });
        log(req, error, Date.now() - start);
        return res.end(error);
    }
    result = JSON.stringify({
        "weather": result.weather[0].main,
        "country": result.sys.country
    });
    log(req, result, Date.now() - start);
    res.end(result);
}

function extractLatLong(text) {
    return text.split("location=")[1];
}

function log(request, response, latency) {
    fs.appendFile('D:\\facultate\\CC\\Homework1\\controllers\\weather\\logs.txt', `<p>${new Date(Date.now())} Request url: http://localhost:8080${request.url} Response: ${response}\nLatency: ${latency} ms\n\n</p>`, function (err) {
        if (err) throw err;
        console.log('Saved weather log!!');
    });
}
