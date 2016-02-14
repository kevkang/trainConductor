var Myo;
var gyroItems = {};
var fourFourArray = ["down", "left", "right", "up"];
gyroItems.prevState;
gyroItems.receivedBeat;
gyroItems.beatNumber = 0;
gyroItems.selectedArray = fourFourArray;
gyroItems.state = gyroItems.selectedArray[0];
//make this bigger if too much jitter
gyroItems.threshold = 30;

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
Myo.on('connected', function(){  
    var myMyo = this;
    addEvents(myMyo);
});
function addEvents(myo) {
    myo.on('gyroscope',function(data) {
        setTimeout(gyroRepeat(data),10);
    });
}
Myo.connect();