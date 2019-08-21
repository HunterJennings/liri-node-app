require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var fs = require("fs");
var weather = require("weather-js");
var request = require("request");

var nodeArgs = process.argv;
var action = process.argv[2];
var userInput = "";


for (var i = 3; i < nodeArgs.length; i++) {
    userInput = userInput + " " + nodeArgs[i];
}

switch(action){
    case "spotify-this-song":
    if(!userInput) {
        userInput = "The Sign";
    }
    song();
    break;

    case "movie-this":
    if(!userInput) {
        userInput = "Mr.Nobody";
    }
    movie();
    break;

    case "weather":
    if(!userInput) {
        userInput = "Dallas tx";
    }
    rain();
    break;

    case "do-what-it-says":
    read();
    break;
}


function song() {
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: "track", query: userInput}, function(err, data) {
        if (err) {
            return console.log("Error: " + err);
        }
        
        var songData = data.tracks.items[0];
       
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song Title: " + songData.name);
        console.log("Preview Link: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        
    })

    
}

function rain() {
    weather.find({search: userInput, degreeType: "F"}, function(err, data){
        if(err){
            console.log("Error: " + err);
        }  
       var newData = data[0];
       console.log("City: " + newData.location.name);
       console.log("Temperature: " + newData.current.temperature + " *F (Feels like " + newData.current.feelslike + ")");
       console.log("Weather: " + newData.current.skytext);
       console.log("Humidity: " + newData.current.humidity);
       console.log("Wind: " + newData.current.winddisplay);
    })

}

function movie() {
    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=96f8b80b", function(err, response, body) {
        if (!err && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Rotten_Tomatoes);
            console.log("Country of Origin: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    })
}

function read() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
    
        console.log(data);
    
        var thatWay = data.split(",");
    
        if(thatWay){
            action = thatWay[0];
            userInput = thatWay[1];
        }
    })
}