(function () {
    "use strict";
    var data = {
        labels: [],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }
        ]
    };

    var rendered = false;

    function buildData() {
        var storage = window.localStorage;
        var idx = storage.getItem("runTimes");
        var obj;
        var totalDist = 0.0;
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        var i = idx - 11 < 0 ? 0 : idx - 11;
        for (; i < idx; i++) {
            obj = JSON.parse(storage.getItem("run" + i));
            data.labels.push(i + 1);
            totalDist += obj.distance;
            data.datasets[0].data.push(obj.distance);
            data.datasets[1].data.push(obj.time);
        }
        totalDist = Math.round(totalDist * 100) / 100;
        var runOverview = document.getElementById("runOverview");
        runOverview.innerHTML = "You have run " + totalDist + " km in " + idx + " sessions.";
    }

    var ControlConstructor = WinJS.UI.Pages.define("/pages/hub/section1Page.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            if (!rendered) {
                var ctx = document.getElementById("runChart").getContext("2d");
                buildData();
                var runChart = new Chart(ctx).Line(data, {});
            }
        },
    });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("HubApps_SectionControls", {
        Section1Control: ControlConstructor
    });
})();