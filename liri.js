require("dotenv").config();
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const keys = require('./keys.js');

const spotify = new Spotify(keys.spotify);


const argsArray = process.argv.slice(2);

var run = (arg, arg2) => {
    switch (arg) {
        case 'spotify-this-song':
            spotifySong(arg2);
            break;
        case 'do-what-it-says':
            readRandomTxt();
            break;
        default:
            console.log("Unrecognized command");
    }
};
if (argsArray[0])
    run(argsArray[0], argsArray[1]);

// prompt for user interaction when no args are provided
if (!argsArray[0]) {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Pick an action you would like to perform:",
        choices: ['spotify-this-song', 'do-what-it-says']
    }]).then(function (user) {
        if (user.action === 'my-tweets' || user.action === 'do-what-it-says') {
            run(user.action);
        } else {
            inquirer.prompt([{
                type: "input",
                name: "textArg",
                message: "Anything in particular? (press Enter\\Return to skip)"
            }]).then(function (user2) {
                run(user.action, user2.textArg);
            });
        }
    });
}


function spotifySong(song) {
    if (!song) {
        song = 'ace of base the sign'; // default song
    }
    spotify.search({
        type: 'track',
        query: song,
        limit: 2
    }, function (error, data) {
        if (error) throw error;
        let result = data.tracks.items;
        print('* *');
        print('Artist(s):', result[0].artists[0].name);
        print('Song\'s Name:', result[0].name);
        print('Preview link:', result[0].preview_url);
        print('Album:', result[0].album.name);
    });
}

function readRandomTxt() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) throw error;
        if (data) run(...data.split(','));
    });
}

function print(title, ...item) { // we use the rest operator to make the second arg "optional" in the context of this function
    console.log("* " + title + " " + item);
    log(title + " " + item);
}

// logs the entry to the log.txt file
function log(entry) {
    fs.appendFile("./log.txt", entry + '\r\n', (error) => {
        if (error) throw error;
    });
}

// checks if the string holds more than one entry (separated by comma)
function moreThanOne(str) {
    return ((str.indexOf(',') === -1) ? false : true);
}
