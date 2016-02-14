$(document).ready(function(){
	$(".dial").knob({
		width: 200,
		height: 200
	});

	var conduct = false, countdown = false, feedback = false;
	var beats;
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

			var tempo = $(".dial").val();

			// Start metronome and start analyzing
			countDown(60000 / tempo);
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

		$(".reset-btn").fadeOut();
		$(".feed-btn").fadeOut();
		$(".conduct-page").fadeOut("slow", function() {
			$(".settings-page").fadeIn();
			$(".conduct-btn").fadeIn();
		});
	});

	$(".feed-btn").click(function() {
		$(".output").fadeOut("fast");

		// Do stuff
	});

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