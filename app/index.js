// importing libraries
import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib";
import userActivity from "user-activity";

const metric = "steps";

let settings;

try {
  settings  = fs.readFileSync("settings.json", "json");
} catch (e) {
    settings = {
      showSeconds: false,
      showTime: false,
      showDate: false,
      showDOW: false,
      showSteps: false
    }
}



// reading time format preferemces
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;


// Get a handle on textboxes
let lbltime = document.getElementById("lbltime");
let lbldate = document.getElementById("lbldate");
let lbldow = document.getElementById("lbldow");
let lblsteps = document.getElementById("lblsteps");

function showHideTime(showTime) {
    lbltime.style.display = showTime? "inline": "none";
}

function showHideDate(showDate) {
    lbldate.style.display = showDate? "inline": "none";
}

function showHideDOW(showDOW) {
    lbldow.style.display = showDOW? "inline": "none";
}

function showHideSteps(showSteps) {
    lblsteps.style.display = showSteps? "inline": "none";
}

function showHideSeconds(showSeconds) {
    //switching digital clock frequency between seconds and minutes
    clock.granularity = showSeconds? "seconds": "minutes";
  
    //showing/hiding analog second hand
    document.getElementById("s1").style.display = showSeconds? "inline": "none";
    document.getElementById("s2").style.display = showSeconds? "inline": "none";
    document.getElementById("s3").style.display = showSeconds? "inline": "none";
    document.getElementById("s4").style.display = showSeconds? "inline": "none";
    document.getElementById("s5").style.display = showSeconds? "inline": "none";
    document.getElementById("s6").style.display = showSeconds? "inline": "none";
    document.getElementById("s7").style.display = showSeconds? "inline": "none";
    document.getElementById("s8").style.display = showSeconds? "inline": "none";
}

// Clock tick
function updateClock() {
  // getting current date time
  let today = new Date();
  
  // formatting hours based on user preferences
  let hours = dtlib.format1224hour(today.getHours());

  // if this is 24H format - prepending 1-digit hours with 0
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
      hours = dtlib.zeroPad(hours);
  }

  // getting 0-preprended minutes
  let mins = dtlib.zeroPad(today.getMinutes());

  // setting basic display time
  let displaytime = `${hours}:${mins}`

  // if seconds enabled - adding seconds
  if (settings.showSeconds) {
    let seconds = dtlib.zeroPad(today.getSeconds())
    displaytime = `${displaytime}:${seconds}`
  }

  // if we're in 12H format - add AM/PM
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_12H) {
      displaytime = `${displaytime} ${dtlib.getAmApm(today.getHours())}`
  }

  // displaying time
  lbltime.text = displaytime;
  
  
   // getting short month name in English
   let month = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());

   // getting 0-prepended day of the month
   let day = dtlib.zeroPad(today.getDate());

   lbldate.text = `${month} ${day}`
   lbldow.text = dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, today.getDay());
   lblsteps.text = userActivity.today.local[metric];
  
}

// Update the clock every tick event
clock.ontick = () => updateClock();

// kickstart
showHideSeconds(settings.showSeconds);
showHideTime(settings.showTime);
showHideDate(settings.showDate);
showHideDOW(settings.showDOW);
showHideSteps(settings.showSteps);
updateClock();


// Message is received
messaging.peerSocket.onmessage = evt => {
  
  // set settings
  settings[evt.data.key] = evt.data.newValue == 'true';
  
  // changing visuals
  switch (evt.data.key) {
    case "showSeconds": showHideSeconds(settings.showSeconds); break;
    case "showTime": showHideTime(settings.showTime); break;
    case "showDate": showHideDate(settings.showDate); break;
    case "showDOW": showHideDOW(settings.showDOW); break;
    case "showSteps": showHideSteps(settings.showSteps); break;
  }
  
  // updating clock
  updateClock();
      
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};


// on app exit collect settings 
me.onunload = () => {
  fs.writeFileSync("settings.json", settings, "json");
}

