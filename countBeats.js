// Start server with: node server

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var myo = require('myo');
var app = express();
var gyroItems = {};
var fourFourArray = ["down", "left", "right", "up"];
gyroItems.prevState;
gyroItems.receivedBeat;
gyroItems.beatNumber = 0;
gyroItems.selectedArray = fourFourArray;
gyroItems.state = gyroItems.selectedArray[0];
//make this bigger if too much jitter
gyroItems.threshold = 30;

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//repeats every 10 ms to compare against prevState
function gyroRepeat(data) {
    gyroItems.prevState = gyroItems.state;
    if ((Math.abs(data.z) > Math.abs(data.y)) && (data.z > gyroItems.threshold)) {
        gyroItems.state = "left";
    } else if ((Math.abs(data.y) > Math.abs(data.z)) && (data.y > gyroItems.threshold)) {
        gyroItems.state = "up";
    } else if ((Math.abs(data.z) > Math.abs(data.y)) && (data.z < -gyroItems.threshold)) {
        gyroItems.state = "right";
    } else if ((Math.abs(data.y) > Math.abs(data.z)) && (data.y < -gyroItems.threshold)) {
        gyroItems.state = "down";
    }
    if (gyroItems.prevState != gyroItems.state) {
        if (!gyroItems.receivedBeat && 
            (gyroItems.prevState == 
            gyroItems.selectedArray[gyroItems.beatNumber %
            gyroItems.selectedArray.length])) {
            gyroItems.receivedBeat = true;
            //send BEAT
            console.log("beat " + gyroItems.beatNumber +
                gyroItems.selectedArray[gyroItems.beatNumber %
                gyroItems.selectedArray.length], gyroItems.state);
        }
        if (gyroItems.state == gyroItems.selectedArray[
            (gyroItems.beatNumber + 1) % gyroItems.selectedArray.length]) {
            gyroItems.beatNumber++;
            gyroItems.receivedBeat = false;
        }
    }
}

myo.on('gyroscope',function(data) {
    setTimeout(gyroRepeat(data),10);
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});


myo.connect();