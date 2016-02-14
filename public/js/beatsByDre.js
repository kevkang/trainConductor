var Myo;
var myMyo
var gyroItems = {};
var fourFourArray = ["down", "left", "right", "up"];
var conduct = false;
var pushOntoMe = [];
var holder = 0;
gyroItems.prevState;
gyroItems.receivedBeat;
gyroItems.beatNumber = 0;
gyroItems.selectedArray = fourFourArray;
gyroItems.state = gyroItems.selectedArray[0];
//make this bigger if too much jitter
gyroItems.threshold = 20;
var killMeOnExit;

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
            beat();
        }
        if (gyroItems.state == gyroItems.selectedArray[
            (gyroItems.beatNumber + 1) % gyroItems.selectedArray.length]) {
            gyroItems.beatNumber++;
            gyroItems.receivedBeat = false;
        }
    }
}

function beat() {
    $("#otherCircle").show();
    setTimeout(function() {
        $("#otherCircle").hide()
    }, 100);
    if (holder != 0) {
        pushOntoMe.push(holder - Date.now())
    }
    holder = Date.now();
}

function addEvents(myo) {
    $(".conduct-btn").click(function() {
        setTimeout(function() {
            if (!conduct) {
                conduct = true;
                myo.on('gyroscope',function(data) {
                    setTimeout(gyroRepeat(data),10);
                });
            } else {
                conduct = false;
                myo.off();
                gyroItems.prevState;
                gyroItems.receivedBeat;
                gyroItems.beatNumber = 0;
                gyroItems.selectedArray = fourFourArray;
                gyroItems.state = gyroItems.selectedArray[0];
                clearInterval(killMeOnExit);
            }
            killMeOnExit = startBeat($(".dial").val(), myo);
        }, 2000);
    });
}
try {
    Myo.on('connected', function(){  
        myMyo = this;
        addEvents(myMyo);
    });

    Myo.connect();
} catch (err) {
    //cannot use Myo.
}