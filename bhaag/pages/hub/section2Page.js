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

function checkTime(i) {
    if (i < 10)
        return "0" + i;
    else
        return i;
}

var running = false;
var runningTick;

function beginRun() {
    var timer = document.getElementById("timer");
    var runBtn = document.getElementById("runBtn");
    runBtn.innerHTML = "Stop Running";
    var h = 0, m = 0, s = 0;
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
    running = true;
    runningTick = setInterval(updateTime, 1000);
}

function endRun() {
    var timer = document.getElementById("timer");
    var runBtn = document.getElementById("runBtn");
    runBtn.innerHTML = "Start Running";
    clearInterval(runningTick);
    running = false;
}

function startRunTimer(e) {
    if (!running)
        beginRun();
    else
        endRun();
}
