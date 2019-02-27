const http = require("http"),
    config = require("./config"),
    fs = require("fs"),
    request = require("request-promise-native");

http.createServer((handler)).listen(8081, () => console.log("Country web service has started!"));

async function handler(req, res) {
    const start = Date.now();

    res.writeHead(200, {'Content-Type': 'application/json'});

    let result;
    const countryName = req.url.split("=")[1],
        apiUrl = `${config.api_url}${countryName}`;
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
        "capital": result.capital,
        "currency": result.currencies[0].name,
        "countryName": result.name
    });
    log(req, output, Date.now() - start);
    res.end(output);
}

function log(request, response, latency) {
    fs.appendFile('D:\\facultate\\CC\\Homework1\\controllers\\country\\logs.txt', `<p>${new Date(Date.now())} Request url: http://localhost:8081${request.url} Response: ${response}\nLatency: ${latency} ms\n\n</p>`, function (err) {
        if (err) throw err;
        console.log('Saved country log!!');
    });
}
