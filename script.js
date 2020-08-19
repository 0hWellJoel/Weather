var date = new Date().toLocaleDateString();

var lastWeather = JSON.parse(localStorage.getItem("weatherResults"));
if (lastWeather){
    getCurrentWeather(lastWeather.name);    
    getForeCast(lastWeather.name);
}
$("#submit").on("click", function(){
    
    var city = $("#search").val();
    if ($.trim(city) == "") {
        return;
    }
    getCurrentWeather(city);
    generateWeatherButton(city);
    getForeCast(city);
});
function getCurrentWeather(cityInput){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=20da204ebb253be898910df1ae2d3dd6";

    $.ajax({   
        url: queryURL,
        method: "GET"
    }).then(function(response){     

        weatherResults = response;
        localStorage.setItem("weatherResults", JSON.stringify(weatherResults));
        console.log(typeof localStorage.getItem("weatherResults"));
        var temp = parseInt((weatherResults.main.temp - 273.15) * 1.80 +32);        
        var date = new Date().toLocaleDateString();
        var icon = weatherResults.weather[0].icon;
        var iconImage = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        var imageIconEl = $("<img>");
        imageIconEl.attr("src", iconImage);
        $("#city").text(weatherResults.name + " (" + date + ")");        
        $("#temp").text(temp + "° F ");
        $("#city").append(imageIconEl);
        $("#humidity").text(weatherResults.main.humidity + "%");
        $("#wind-speed").text(weatherResults.wind.speed + " MPH");
        var latitude = weatherResults.coord.lat;
        var longitude = weatherResults.coord.lon;

        getUVIndex(latitude, longitude);

    });
}
function getUVIndex(lat, lon) {
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=20da204ebb253be898910df1ae2d3dd6&lat=" + lat + "&lon=" + lon;
            
    $.ajax({   
        url: uvURL,
        method: "GET"
    }).then(function(response){
        //console.log(response);
        var uvValue = response.value;        
        localStorage.setItem("uvValue", uvValue);
    
        $("#uv-index").text(uvValue);  

        if (uvValue <= 2) {
            $("#uv-index").css({"background-color": "green"});
        } else if (uvValue <= 5) {
            $("#uv-index").css("background-color", "yellow");
        } else if (uvValue <= 7) {
            $("#uv-index").css("background-color", "orange");
        } else if (uvValue <= 10) {
            $("#uv-index").css("background-color", "red"); 
        } else {
            $("#uv-index").css("background-color", "violet");
        }                     
    });
};
function getForeCast(cityStr) {        
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityStr + "&appid=20da204ebb253be898910df1ae2d3dd6";    
    $.ajax({   
        url: forecastURL,
        method: "GET"
    }).then(function(response){
        var forecastList = response.list;
        localStorage.setItem("forecastList", JSON.stringify(forecastList));
        console.log(typeof localStorage.getItem("forecastList"));
        var j = 0;
        for (var i = 7; i < forecastList.length; i+=8) {
            var fIcon = forecastList[i].weather[0].icon;
            var forecastImage = "https://openweathermap.org/img/wn/" + fIcon + "@2x.png";
            var tempF = parseInt((forecastList[i].main.temp - 273.15) * 1.80 +32);
            var date = new Date(forecastList[i].dt_txt);
            var humidity = forecastList[i].main.humidity;
            var forecastDate = $(".forecast-date");
            var forecastIcon = $(".forecast-icon");
            var forecastTemp = $(".forecast-temp");
            var forecastHumidity = $(".forecast-humidity");            
            
            if (j < forecastDate.length) {

                forecastDate[j].textContent = (date.getMonth() + 1) + "/" + date.getDate() + "/" + (date.getFullYear());                                                                                 
                forecastIcon[j].src = forecastImage;
                forecastTemp[j].textContent = tempF + "° F ";
                forecastHumidity[j].textContent = humidity + " MPH";
                j++;      
            
            }
        }
    });
}
function generateWeatherButton(cityStr) {
    btnDiv = $("<div>");
    inputBtn = $("<input>");
    inputBtn.attr("type", "submit");
    inputBtn.addClass("weather text-left");
    inputBtn.attr("data-name", cityStr);     
    inputBtn.css("width", "130px");
    inputBtn.val(cityStr);
    btnDiv.append(inputBtn);
    $("#buttons-view").append(btnDiv);
}
function displayWeatherButtonInfo(){
    var cityName = $(this).attr("data-name");
    console.log(cityName);
    getCurrentWeather(cityName);
    getForeCast(cityName);
}
$(document).on("click", ".weather", displayWeatherButtonInfo);