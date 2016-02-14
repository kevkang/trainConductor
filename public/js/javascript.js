$(document).ready(function(){
	$(".dial").knob();

	var conduct = false, countdown = false;
	var beats;
	$(".conduct-btn").click(function() {

		if (!conduct) {
			$(this).text("RESET"); 
			conduct = true;

			$(".settings-page").fadeOut("slow", function() {
				$(".conduct-page").fadeIn();
			});

			var tempo = $(".dial").val();

			// Start metronome and start analyzing
			countDown(60000 / tempo);
		} else if (conduct && !countdown) {
			$(this).text("START");
			conduct = false;

			// End metronome and give analysis 
			stopBeat();
			$(".output").fadeOut("fast");

			$(".conduct-page").fadeOut("slow", function() {
				$(".settings-page").fadeIn();
			});
		}
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
						$("#blip")[0].play();

						$("#circle").show();
						$("#circle").fadeOut(100);
			        	startBeat(delay);
			        });	
				}
			}, delay);
		});	
	}

	function startBeat(delay) {
		beats = setInterval(function() {
			$("#blip")[0].play();

			$("#circle").show();
			$("#circle").fadeOut(100);
		}, delay/* incorporate blip duration */);
	}

	function stopBeat() {
		clearInterval(beats);
		$("#blip")[0].pause();
	}

});