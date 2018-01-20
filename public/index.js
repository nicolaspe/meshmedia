var clock, calen;
var month, weekday;
var nextEvent;
var clicked, button, video;

window.addEventListener('load', onLoad);

function onLoad(){
	clock = document.querySelector("#date");
	calen = document.querySelector("#calendar");

	clicked = false;
	button = document.getElementById('join');

	month   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
				"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	$.getJSON("events.json", function(json){
		createCalendar(json);
	});

	document.querySelector("#join").disabled = true;
	updateTime();

	window.setInterval(updateTime, 1000);

	video = document.createElement("video");
	video.id = "videoPlayer";
	video.height = "480";
	video.autoplay = "autoplay";
	video.controls = "controls"

	// events
	button.addEventListener('click', function(evt) {
		if (clicked == false) {
			let cal = document.getElementById('calendar');
			cal.style.visibility = "hidden";

			//create video
			let src = window.location.protocol + "//" + window.location.host + "/video";
			let ss = document.createElement("SOURCE");
			ss.type = "video/mp4";
			ss.src = src;
			video.appendChild(ss);

			//calculate starting point
			let d = new Date();
			let dif_h = d.getHours()   - nextEvent.getHours();
			let dif_m = d.getMinutes() - nextEvent.getMinutes();
			let dif_s = d.getSeconds() - nextEvent.getSeconds();
			let startPoint = dif_s + dif_m*60 + dif_h*60*60;
			video.currentTime = startPoint;
			video.play();

			document.querySelector("#video_div").appendChild(video);
			button.innerText = "Quit Show";

			clicked = true;

		} else if (clicked == true) {
			let video = document.getElementById("videoPlayer");
			document.querySelector("#video_div").removeChild(video);
			button.innerText = "Join Show";
			let cal = document.getElementById('calendar');
			cal.style.visibility = "visible";

			clicked = false;
		}
	});

	// from https://stackoverflow.com/questions/11903545/how-to-disable-seeking-with-html5-video-tag
	video.addEventListener('timeupdate', function() {
  		if (!video.seeking) {
    		supposedCurrentTime = video.currentTime;
  		}
	});
	video.addEventListener('seeking', function() {
  		// guard agains infinite recursion:
  		// user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
  		var delta = video.currentTime - supposedCurrentTime;
  		if (Math.abs(delta) > 0.01) {
    		console.log("Seeking is disabled");
    		video.currentTime = supposedCurrentTime;
  		}
	});
}

function createCalendar(json){
	let d = new Date();
	let future = new Date();

	for (let i = 0; i < 7; i++) {
		let p;
		let text;

		// set target date
		future.setDate(d.getDate()+i);

		// get target column
		let id  = "#t" + i;
		let col = document.querySelector(id);

		// get week day
		let wday = future.getDay();
		if(i == 0){
			text = "Today";
		} else{
			text = weekday[(wday%7)];
		}
		p = document.createElement("P");
		p.classList.add("cal_weekday");
		p.textContent = text;
		col.appendChild(p);

		// get date
		let day = future.getDate();
		let mon = future.getMonth();
		let yea = future.getFullYear();
		let date = month[mon] +" " +day;
		p = document.createElement("P");
		p.classList.add("cal_date");
		p.textContent = date;
		col.appendChild(p);

		// get events
		for (let j = 0; j < json.events.length; j++) {
			if(json.events[j].date == day && json.events[j].month == mon+1 && json.events[j].year == yea){
				// insert separation and create elements
				col.appendChild(document.createElement("BR"));
				p  = document.createElement("P");
				p.classList.add("cal_event");
				p2 = document.createElement("h1");
				p2.classList.add("calName_event");
				// get data
				let evnt = json.events[j].start +" - " +json.events[j].end;
				let evntName = json.events[j].name;
				p2.textContent = evntName;
				p.textContent = evnt;
				// append data
				col.appendChild(p);
				col.appendChild(p2);
				// check if it's the next event
				let evntTime = json.events[j].start.split(":");
				let evntDate = new Date(yea,mon,day,evntTime[0],evntTime[1]);
				if(nextEvent == null){
					nextEvent = evntDate;
				} else if(nextEvent - evntDate > 0){
					nextEvent = evntDate;
				} else {
				}
			}
		}
	}
}

function hideCal() {
	let button = document.getElementById("join");
	let boo = button.getAttribute("boo");

	if (boo == "false") {
		//hide calender
		let cal = document.getElementById('calendar');
		cal.style.visibility = "hidden";
	
		//create video
		let src = window.location.protocol + "//" + window.location.host + "/video";
		let ss = document.createElement("SOURCE");
		ss.type = "video/mp4";
		ss.src = src;

		let video = document.createElement("video");
		video.id = "videoPlayer";
		video.height = "480";
		video.autoplay = "autoplay";
		video.appendChild(ss);

		document.querySelector("#video_div").appendChild(video);
		button.innerText = "Quit Show";
		// button.setAttribute("boo", "true");
		console.log(boo);
	}

	if (boo == "true") {
		let video = document.getElementById("videoPlayer");
		document.querySelector("#video_div").removeChild(video);
		button.innerText = "Join Show";
	}
}

function updateTime(){
	let d = new Date();
	// parse clock time
	let yr  = d.getFullYear();
	let mon = month[d.getMonth()];
	let day = d.getDate();
	if(day<10){ day = "0"+day};

	let hr  = d.getHours();
	if(hr<10){ hr = "0"+hr};
	let min = d.getMinutes();
	if(min<10){ min = "0"+min};
	let sec = d.getSeconds();
	if(sec<10){ sec = "0"+sec};

	clock.textContent = mon +" " +day +", " +yr +" " +hr +":" +min +":" +sec;

	// compare to next event to enable/disable button
	let play_button = document.querySelector("#join");
	if(nextEvent - d <= 0){
		play_button.disabled = false;
	}
}


