(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("/pages/hub/section2Page.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            options = options || {};
        },
    });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("HubApps_SectionControls", {
        Section2Control: ControlConstructor
    });

})();

/////////////////////////////////////////////////////////////////////////////////////////

var running = false;
var runDist = 0;
var h, m, s;
var runningTick, geo, geoWatch, lat, long, accelerometer;
var lats, longs, times, speeds, acX, acY, acZ;

function checkTime(i) {
    if (i < 10)
        return "0" + i;
    else
        return i;
}

function showMessage(msg) {
    var messageDialog = new Windows.UI.Popups.MessageDialog(msg);
    messageDialog.showAsync();
}

function initGeo() {
    geo = new Windows.Devices.Geolocation.Geolocator();
    geo.movementThreshold = 2;
    geo.desiredAccuracy = Windows.Devices.Geolocation.PositionAccuracy.high;
    if (!geo)
        showMessage("Access to your location is turned off. Change your settings to turn it back on.");
}

function startTimer() {
    var timer = document.getElementById("timer");
    h = 0, m = 0, s = 0;
    var updateTime = function () {
        s++;
        if (s > 59) {
            m++;
            s = 0;
        }
        if (m > 59) {
            h++;
            m = 0;
        }
        var s_h = checkTime(h),
            s_m = checkTime(m),
            s_s = checkTime(s);
        timer.innerHTML = s_h + ":" + s_m + ":" + s_s;
    };
    runningTick = setInterval(updateTime, 1000);
}

Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
}

function distance(latitude1, longitude1, latitude2, longitude2) {
    // R is the radius of the earth in kilometers
    var R = 6371;

    var deltaLatitude = (latitude2 - latitude1).toRadians();
    var deltaLongitude = (longitude2 - longitude1).toRadians();
    latitude1 = latitude1.toRadians(), latitude2 = latitude2.toRadians();

    var a = Math.sin(deltaLatitude / 2) *
            Math.sin(deltaLatitude / 2) +
            Math.cos(latitude1) *
            Math.cos(latitude2) *
            Math.sin(deltaLongitude / 2) *
            Math.sin(deltaLongitude / 2);
    var c = 2 * Math.atan2(Math.sqrt(a),
                           Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function posChanged(args) {
    var pos = args.position;
    var distCounter = document.getElementById("distCounter");
    var speedometer = document.getElementById("speedometer")
    if (lat == null) {
        lat = pos.coordinate.point.position.latitude;
        long = pos.coordinate.point.position.longitude;
    } else {
        var lat2 = pos.coordinate.point.position.latitude,
            long2 = pos.coordinate.point.position.longitude,
            speed = pos.coordinate.speed;
        lats.push(lat2);
        longs.push(long2);
        speeds.push(speed);
        times.push(Date.now());
        var dist = Math.abs(distance(lat2, long2, lat, long));
        lat = lat2;
        long = long2;
        runDist += dist;
        var tmp = Math.round(runDist * 100);
        distCounter.innerHTML = (tmp / 100) + " km";
        tmp = Math.round(speed * 100);
        speedometer.innerHTML = (tmp / 100) + " m/s";
    }
}

function startDistanceTick() {
    lat = null, long = null;
    geo.addEventListener("positionchanged", posChanged);
}

function accReadChange(e) {
    if (running) {
        var reading = e.reading;
        var accelX = reading.accelerationX;
        var accelY = reading.accelerationY;
        var accelZ = reading.accelerationZ;
        acX.push(accelX);
        acY.push(accelY);
        acZ.push(accelZ);
    }
}
function initAccelerometer() {
    if (accelerometer == null) {
        accelerometer = Windows.Devices.Sensors.Accelerometer.getDefault();

        // Establish the report interval
        var minimumReportInterval = accelerometer.minimumReportInterval;
        var reportInterval = minimumReportInterval > 16 ? minimumReportInterval : 16;
        accelerometer.reportInterval = reportInterval;

        // Establish the event handler
        accelerometer.addEventListener("readingchanged", accReadChange);
    }
}

function beginRun() {
    lats = [], longs = [], times = [], speeds = [],
    acX = [], acY = [], acZ = [];
    var timer = document.getElementById("timer");
    timer.innerHTML = "00:00:00";
    var distCounter = document.getElementById("distCounter");
    distCounter.innerHTML = "0.0 km";
    var speedometer = document.getElementById("speedometer");
    speedometer.innerHTML = "0.0 m/s";
    var runBtn = document.getElementById("runBtn");
    runBtn.innerHTML = "Stop Running";
    running = true;
    initGeo();
    initAccelerometer();
    startTimer();
    startDistanceTick();
}

function writeData() {
    var storage = window.localStorage;
    var idx = storage.runTimes ? Number(storage.runTimes) : 0;
    var obj = {
        lats: lats,
        longs: longs,
        times: times,
        speeds: speeds,
        acX: acX,
        acY: acY,
        acZ: acZ,
        distance: runDist,
        endTime: Date.now(),
        time: 3600 * h + 60 * m + s
    };
    storage.setItem("run" + idx, JSON.stringify(obj));
    storage.setItem("runTimes", idx + 1);
    return idx;
}

function endRun() {
    var timer = document.getElementById("timer");
    var runBtn = document.getElementById("runBtn");
    runBtn.innerHTML = "Start Running";
    clearInterval(runningTick);
    geo.removeEventListener("positionchanged", posChanged);
    accelerometer = null;
    var idx = writeData();
    lats = [], longs = [], times = [], speeds = [],
    acX = [], acY = [], acZ = [];
    running = false;
    WinJS.Navigation.navigate("/pages/hub/summary.html", { item: idx });
}

function startRunTimer(e) {
    if (!running)
        beginRun();
    else
        endRun();
}

// DO NOT ENABLE THIS
// window.localStorage.clear();
