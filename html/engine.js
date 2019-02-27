var xhttp = new XMLHttpRequest();
function clickedButton() {
    var city = document.getElementById("cityId").value;
    var url = "http://localhost:80/city=" + city;
    var request = new XMLHttpRequest();
    var saved=false;
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        var resp = JSON.parse(request.responseText);
        console.log(resp);
        document.getElementById("hiddenDiv1").innerHTML = "Country is " + resp.Country;
        document.getElementById("hiddenDiv2").innerHTML = "Capital is " + resp.Capital;
        document.getElementById("hiddenDiv3").innerHTML = "Country population is " + resp.CountryPopulation;
        document.getElementById("hiddenDiv4").innerHTML = "Weather is " + resp.Weather;
        document.getElementById("hiddenDiv5").innerHTML = "Currency is " + resp.Currency;
    }
}
