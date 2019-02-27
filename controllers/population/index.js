const http = require("http"),
    config = require("./config"),
    fs = require("fs"),
    request = require("request-promise-native");

http.createServer((handler)).listen(8082, () => console.log("Population web service has started!"));

async function handler(req, res) {
    const start = Date.now();

    res.writeHead(200, {'Content-Type': 'application/json'});

    let result;
    const location = extractLatLong(req.url),
        apiUrl = `${config.api_url_first}${location}${config.api_url_second}`;
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
    const output = JSON.stringify({
        "population": result.total_population[0].population
    });
    log(req, output, Date.now() - start);
    res.end(output);
}

function extractLatLong(text) {
    return text.split("location=")[1];
}

function log(request, response, latency) {
    fs.appendFile('D:\\facultate\\CC\\Homework1\\controllers\\population\\logs.txt', `<p>${new Date(Date.now())} Request url: http://localhost:8082${request.url} Response: ${response}\nLatency: ${latency} ms\n\n</p>`, function (err) {
        if (err) throw err;
        console.log('Saved population log!');
    });
}
