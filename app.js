//jshint esversion:6


//requiring the packages
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require('ejs');

//creating object for using express
const app = express();

//uisng other dependencies using express
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//getting a get request for our homepage
app.get("/", function(req, res) {

  const today = new Date();
  options = {
    day: "numeric",
    month: "short"
  };
  const day = today.toLocaleDateString("en-US", options);
  res.render("index", {
    day: day
  });
});


//handling post request to our webpage
app.post("/", function(req, res) {

  let query = req.body.cityName;

  const apikey = "84f839124e0e569b658eef1d91bf0f35";

  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;

  https.get(url, function(response) {

    response.on("data", function(data) {

      const weatherData = JSON.parse(data);

      if (weatherData.cod === 200) {


        const temp = weatherData.main.temp;

        const weatherDiscription = weatherData.weather[0].description;

        const icon = weatherData.weather[0].icon;

        const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";


        res.render("temp", {
          query: query,
          temp: temp,
          weatherDiscription: weatherDiscription,
          iconURL: iconURL
        });

      } else {
        res.render("error");
      }

    });

  });

});


//calling our local server and making sure everything is running good
app.listen(3000, function() {
  console.log("Our server is running");
});
