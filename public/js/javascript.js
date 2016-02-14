var Myo;
var myMyo;
var gyroItems = {};
var fourFourArray = ["down", "left", "right", "up"];
var conduct = false;
var pushOntoMe = [];
var holder = 0;
var trials = 1;
gyroItems.prevState;
gyroItems.receivedBeat;
gyroItems.beatNumber = 0;
gyroItems.selectedArray = fourFourArray;
gyroItems.state = gyroItems.selectedArray[0];
//make this bigger if too much jitter
gyroItems.threshold = 20;

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
            }
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










$(document).ready(function(){
	$(".dial").knob({
		width: 200,
		height: 200
	});

	var conduct = false, countdown = false, feedback = false;
	var beats;
	var tempo;
  var delta;






  var makeFeedback = function() {
    $(".output").fadeOut("fast");

    var resultsPage = ".results-page";

    console.log(pushOntoMe);
    var timestamps = pushOntoMe;

    //var timestamps = [16,23,36,45,23,64,13,09,88,23,75,82,79,85,78,29,37,48,97,23,98,49,72,73,89,47,28,93,79];
    var userBeat = timestamps.map(function(val,index) {
      return 60000/(-val) < 200 ? {index:index+1, BPM:60000/(-val)} : {index:index, BPM:200};
    }); // variable BPM; val is delta [i]-[i+1]
    var baseBeat = timestamps.map(function(val,index) {return {index:index+1, BPM:tempo};}); // all constant BPM

    var margin = {top: 40, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([1, timestamps.length])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([200, 0])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(timestamps.length < 30 ? timestamps.length-1 : 30)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.index); })
        .y(function(d) { return y(d.BPM); });

    var svg = d3.select(resultsPage).insert("svg", ":first-child")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    x.domain(d3.extent(userBeat, function(d) { return d.index; }));
    y.domain(d3.extent(userBeat, function(d) { return d.BPM; }));

    // X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 6)
        .attr("y", "-.71em")
        .attr("dx", width)
        .style("text-anchor", "end")
        .text("Beat number");

    // Y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("BPM");

    // Baseline
    svg.append("path")
        .datum(baseBeat)
        .attr("class", "line")
        .attr("fill-opacity", 0)
        .attr("stroke-width", 2)
        .attr("d", line);

    // User line
    svg.append("path")
        .datum(userBeat)
        .attr("class", "highlight line")
        .attr("fill-opacity", 0)
        .attr("stroke-width", 2)
        .attr("d", line);

    // Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px") 
        .text("Trial #" + trials + ": " + timestamps.length + " beats at " + tempo + " beats per minute");

    trials++;

    $(resultsPage).fadeIn("fast");
  };







	$(".conduct-btn").click(function() {

		if (!conduct) {
			$(this).text("FINISH"); 
			conduct = true;

			if ($("#box1").is(":checked")) {
			  feedback = true;
			}

			$(".settings-page").fadeOut("slow", function() {
				$(".conduct-page").fadeIn();
			});

			tempo = $(".dial").val();
      delta = 60000/tempo;

			// Start metronome and start analyzing
			countDown(delta);
		} else if (conduct && !countdown) {
			$(this).fadeOut("medium", function() {
				$(".reset-btn").fadeIn();
				$(".feed-btn").fadeIn();
				$(this).text("START");
			});

			conduct = false;

			// End metronome and give analysis 
			stopBeat();
		}
	});




	$(".reset-btn").click(function() {
		$(".output").fadeOut("fast");
    $(".results-page").fadeOut("fast");
    pushOntoMe = [];

		$(".reset-btn").fadeOut();
		$(".feed-btn").fadeOut();
		$(".conduct-page").fadeOut("slow", function() {
			$(".settings-page").fadeIn();
			$(".conduct-btn").fadeIn();
		});
	});




	$(".feed-btn").click(makeFeedback);




	function countDown(delay) {
		countdown = true;
		$(".countdown").fadeIn();

		var counter = 4;
		$(".countdown-text").delay(2000).fadeOut('slow', function() {
			$(".countdown-text").text(counter);
			$(".countdown-text").fadeIn();
			
			var interval = setInterval(function() {
				counter--;
				if (counter != 0) {
					$(".countdown-text").text(counter);
				} else {
					clearInterval(interval);
			        $(".countdown").hide();
			        $(".countdown").promise().done(function() {
			        	$(".countdown-text").text("Ready?");
						$(".output").fadeIn();
						countdown = false;

			        	startBeat(delay);
			        });	
				}
			}, delay);
		});	
	}

	var count = 0;
	function startBeat(delay) {
		beats = setInterval(function() {
			$("#blip")[0].play();

			$("#circle").show();
			$("#circle").fadeOut(delay / 2);

			var nextArrow = ".arrow" + (count % 4 + 1).toString();
			var prevArrow = ".arrow" + (count % 4).toString();

			$(nextArrow).css("color", "#29b6f6");
			$(prevArrow).css("color", "");

			if (feedback) {
				// Temporary
				if (count % 2 == 0) {
					$(".correct").css("color", "#66bb6a");
					$(".incorrect").css("color", "");
				} else {
					//$(".correct").css("color", "");
					$(".incorrect").css("color", "#ef5350");
				}
			}

			count++;
		}, delay /* incorporate blip duration */);
	}

	function stopBeat() {
		count = 0;
		clearInterval(beats);
		$("#blip")[0].pause();
		feedback = false;

		$(".arrow1").css("color", "");
		$(".arrow2").css("color", "");
		$(".arrow3").css("color", "");
		$(".arrow4").css("color", "");
	}
});