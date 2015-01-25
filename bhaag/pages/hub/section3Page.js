(function () {
    "use strict";

    function showTime(time) {
        var s = time % 60;
        time = Math.floor(time / 60);
        var m = time % 60;
        time = Math.floor(time / 60);
        var str = (time < 10 ? "0" + time : time) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        return str;
    }

    function getListItem(date, distance, time) {
        var str = "<p>" +
                  "<h4>" + new Date(date).toString().substr(0, 25) + " ...</h4>" +
                  "<h6>" + Math.round(distance * 100) / 100 + " km in " +
                  showTime(time) + "</h6><hr></p>";
        return str;
    }

    function buildList() {
        var idx = window.localStorage.getItem("runTimes");
        var obj;
        var domStr = "";
        for (var i = idx - 1; i >= 0; i--) {
            obj = JSON.parse(window.localStorage.getItem("run" + i));
            domStr += getListItem(obj.endTime, obj.distance, obj.time);
        }
        document.getElementById("placeholder").innerHTML = domStr;
    }

    var ControlConstructor = WinJS.UI.Pages.define("/pages/hub/section3Page.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            buildList();
        }
    });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("HubApps_SectionControls", {
        Section3Control: ControlConstructor
    });
})();