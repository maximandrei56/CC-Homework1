const http = require("http"),
    request = require("request-promise-native"),
    weather = require("./controllers/weather/index.js"),
    country = require("./controllers/country/index.js"),
    population = require("./controllers/population/index.js"),
    fs = require("fs");

const htmlContent = fs.readFileSync("./html/index.html", {encoding: "utf8"});
const jsContent = fs.readFileSync("./html/engine.js", {encoding: "utf8"});

http.createServer((Router)).listen(80, () => console.log("Server started!"));

async function Router(req, res) {
    switch (req.url) {
        case "/":
            res.writeHead(200, {"Content-Type": "text/html"});
            return res.end(htmlContent);
        case "/engine.js":
            res.writeHead(200, {"Content-Type": "text/javascript"});
            return res.end(jsContent);
        case "/metrics":
            res.writeHead(200, {"Content-Type": "text/html"});
            return res.end(printLogs());
        default:
            if (req.url.indexOf("=") === -1) {
                res.writeHead(200, {"Content-Type": "text/html"});
                return res.end(htmlContent);
            }
            const city = req.url.split("=")[1];
            res.writeHead(200, {"Content-Type": "application/json"});

            let result,
                resp = {
                    "Currency": "Unknown",
                    "Country": "Unknown",
                    "Weather": "Unknown",
                    "CountryName": "Unknown",
                    "CountryPopulation": "Unknown",
                    "Capital": "Unknown"
                };
            const start = Date.now();

            while (1) {
                try {
                    let countryCode;
                    // ------------------------------------------ CALLING WEATHER WEB SERVICE
                    result = await request.get(`http://localhost:8080/location=${city}`);
                    result = JSON.parse(result);
                    if (!result.hasOwnProperty("weather")) {
                        break;
                    }
                    resp.Weather = result.weather;
                    countryCode = result.country;
                    // ------------------------------------------

                    // ------------------------------------------ CALLING COUNTRY WEB SERVICE
                    result = await request.get(`http://localhost:8081/location=${countryCode}`);
                    result = JSON.parse(result);
                    if (!result.hasOwnProperty("capital")) {
                        break;
                    }
                    resp.Capital = result.capital;
                    resp.Country = result.countryName;
                    resp.Currency = result.currency;
                    // ------------------------------------------

                    //------------------------------------------ CALLING POPULATION WEB SERVICE
                    result = await request.get(`http://localhost:8082/location=${resp.Country}`);
                    result = JSON.parse(result);

                    if (!result.hasOwnProperty("population")) {
                        break;
                    }
                    resp.CountryPopulation = result.population;
                    // ------------------------------------------
                    console.log(result);
                }
                catch (err) {
                    break;
                }

                break;
            }
            resp = JSON.stringify(resp);
            res.end(resp);
    }
}

function printLogs() {
    const logsC = fs.readFileSync("D:\\facultate\\CC\\Homework1\\controllers\\country\\logs.txt").toString();
    const logsP = fs.readFileSync("D:\\facultate\\CC\\Homework1\\controllers\\population\\logs.txt").toString();
    const logsW = fs.readFileSync("D:\\facultate\\CC\\Homework1\\controllers\\weather\\logs.txt").toString();

    return `<p>${logsC}${logsP}${logsW}<p></p>`;
}