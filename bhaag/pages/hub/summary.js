(function () {
    "use strict";

    var obj;

    function showTime() {
        var time = obj.time;
        var s = time % 60;
        time = Math.floor(time / 60);
        var m = time % 60;
        time = Math.floor(time / 60);
        var str = (time < 10 ? "0" + time : time) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        document.getElementById("duration").innerHTML += "<br/>" + str;
    }

    function showDistance() {
        var dist = obj.distance;
        var str = (Math.round(dist * 100) / 100) + " km";
        document.getElementById("distance").innerHTML += "<br/>" + str;
    }

    function showSpeeds() {
        var speeds = obj.speeds;
        var maxm = speeds[0];
        for (var i = 1; i < speeds.length; i++) {
            if (maxm < speeds[i])
                maxm = speeds[i];
        }
        var avg = Math.round((obj.distance * 1000 / obj.time) * 100) / 100;
        document.getElementById("maxSpeed").innerHTML += "<br/>" + maxm + " m/s";
        document.getElementById("avgSpeed").innerHTML += "<br/>" + avg + " m/s";
    }

    /*function computeDirns(arr) {
        var ddx = [];
        var totalddx = 0.0;
        for (var i = 1; i < arr.length - 1; i++) {
            ddx.push(arr[i + 1] + arr[i - 1] - 2 * arr[i]);
            //ddx.push(arr[i + 1] - arr[i]);
            totalddx += ddx[ddx.length - 1];
        }  
        var avgddx1 = totalddx / ddx.length,
            avgddx2 = -avgddx1;
        var numPeaks = 0;
        var posAvg, negAvg;
        if (avgddx1 > 0) {
            posAvg = avgddx1;
            negAvg = avgddx2;
        } else {
            negAvg = avgddx1;
            posAvg = avgddx2;
        }
        for (var i = 0; i < ddx.length ; i++) {
            if (ddx[i] > posAvg || ddx[i] < negAvg && Math.abs(arr[i + 1]) > 0.1)
                numPeaks++;
        }
        return numPeaks;
    }

    function showStrides() {
        var px = computeDirns(obj.acX);
        var py = computeDirns(obj.acY);
        var pz = computeDirns(obj.acZ);
        //var maxp = Math.floor(Math.max(px, py, pz) / 2);
        document.getElementById("strides").innerHTML += "<br/>" + px + "," + py + "," + pz;
    }*/

    function showStrides() {
        var strides = 0;
        var length;
        for (var i = 0; i < obj.acX.length; i++) {
            length = Math.sqrt(obj.acX[i] * obj.acX[i] + obj.acY[i] * obj.acY[i] + obj.acZ[i] * obj.acZ[i]);
            if (length >= 1.5)
                strides++;
        }
        if (strides > obj.time * 3)
            strides = Math.round(Math.sqrt(strides));
        document.getElementById("strides").innerHTML += "<br/>" + strides;
    }

    WinJS.UI.Pages.define("/pages/hub/summary.html", {
        ready: function (element, options) {
            var idx = options.item;
            element.querySelector(".titlearea .pagetitle").textContent = "Summary";
            obj = JSON.parse(window.localStorage.getItem("run" + idx));
            showTime();
            showDistance();
            showSpeeds();
            showStrides();
        }
    });
})();
