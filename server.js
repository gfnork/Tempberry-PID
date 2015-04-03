/**
 * Created by prawda on 12.01.2015.
 */

var Q = require('q');

//controller stuff
var pt100 = require('./PTC.js');
var heater = require('./Heater.js');
var pid = require('./PID.js');

var controlling = false;
var currentPower = 0;
var currentTemp = 0;
var targetTemp = 0;

//webserver stuff
var app = require('express')();
var http = require('http').Server(app);
var serveStatic = require('serve-static');
app.use(serveStatic('angular/app'));

http.listen(8080, function(){

});

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/overview', function(req, res) {
    if(req.body.msg == 'startstop') {
        startStop();
    }
    else {
        processPostData(req.body).then(function(result) { res.end(JSON.stringify(result)); } );
    }
});

function processPostData(data) {

    var receivedTarget = Number(data.msg);

    if(typeof receivedTarget === 'number' && receivedTarget != targetTemp) {
        targetTemp = receivedTarget;
        console.log("New targetTemp temperature is: "+targetTemp);
        pid.setTarget(targetTemp);
    }
    else {
        if(typeof receivedTarget !== 'number') console.log("non number received", data.msg);
    }

    currentTemp = pt100.getTemp();
    var state = {temp: currentTemp, power: currentPower, time: new Date()};

    return Q.fcall(function () {
        return state;
    });
}





// heater power in W (a good value is the average of the power range, assumption ^^)
var heaterAvgPower = 1000;
// minimal and maximal values of heater
var lowerPowerThreshold = 300;
var upperPowerThreshold = 2000;

// start or stop the controller
function startStop() {
    controlling = !controlling;
}

//control cycle
var updateInterval = 2000;
setInterval(control, updateInterval);

// control function
function control() {
    //at first get current temperature
    currentTemp = pt100.getTemp();

    //check if controlling should be done
    if(controlling)
    {
        //then push temp into pid and database
        pid.feedData(currentTemp);

        var powerTarget = heaterAvgPower * pid.getCorrection();
        console.log("current temp:",currentTemp,"/",targetTemp,"powertarget:",powerTarget);

        // adjust power to targetTemp
        if(powerTarget < lowerPowerThreshold) heater.turnOff();
        else if(powerTarget > upperPowerThreshold) {
            heater.turnOn();
            currentPower = heater.setPower(upperPowerThreshold);
        }
        else {
            heater.turnOn();
            currentPower = heater.setPower(powerTarget);
        }
    }
}

// shut down stuff on exit
process.on('exit', function(code) {
    heater.turnOff();
    pt100.disconnect();
    heater.disconnect();
});

