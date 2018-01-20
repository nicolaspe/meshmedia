var clock, calen;
var month, weekday;
var jj;

window.addEventListener('load', onLoad);

function onLoad(){
	clock = document.querySelector("#date");
	calen = document.querySelector("#calendar");

	month   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
							 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	$.getJSON("events.json", function(json){
		createCalendar(json);
	})

	window.setInterval(updateTime, 1000);
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
				col.appendChild(document.createElement("BR"));
				p = document.createElement("P");
				p2 = document.createElement("h1");
				let evnt = json.events[j].start +" - " +json.events[j].end;
				let evntName = json.events[j].name;
				p2.textContent = evntName;
				p.textContent = evnt;
				p.classList.add("cal_event");
				p2.classList.add("calName_event");
				col.appendChild(p);
				col.appendChild(p2);
			}
		}
	}
}

function updateTime(){
	let d = new Date();
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

	clock.textContent = mon +" " +day +", " +yr +" " +hr +":" +min +":" +sec;;
}
