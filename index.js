var builder = require("botbuilder");
var apiairecognizer = require("api-ai-recognizer");
var request = require("request");

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer("105018f8224a4567be38137c0a5f19ee");
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog("/", intents);
//detect intent "whatIsWeather"
intents.matches("whatIsWeather", [
  function(session, args) {
    var city = builder.EntityRecognizer.findEntity(args.entities, "cities");
    if (city) {
      var city_name = city.entity;
      var url =
        "http://api.weatherstack.com/current?access_key=eb6546fa99d3625a240b4f31887fc755&query=" +
        city_name;
      request(url, function(error, response, body) {
        body = JSON.parse(body);
        
        temp = body.current.temperature;
        session.send("It's " + temp + " degrees celsius in " + city_name);
      });
    } else {
      builder.Prompts.text(session, "Which city do you want the weather for?");
    }
  },
  function(session, results) {
    var city_name = results.response;
    var url =
      "http://api.weatherstack.com/current?access_key=eb6546fa99d3625a240b4f31887fc755&query=" +
      city_name;
    request(url, function(error, response, body) {
      body = JSON.parse(body);
      temp = body.current.temperature;
      session.send("It's " + temp + " degrees celsius in " + city_name);
    });
  }
]);
// dialog flows small talk
intents.matches("smalltalk.greetings", function(session, args) {
  var fulfillment = builder.EntityRecognizer.findEntity(
    args.entities,
    "fulfillment"
  );
  if (fulfillment) {
    var speech = fulfillment.entity;
    session.send(speech);
  } else {
    session.send("Sorry...not sure how to respond to that");
  }
});

intents.onDefault(function(session) {
  session.send("Sorry...can you please rephrase?");
});
