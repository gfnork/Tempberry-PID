/**
 * Created by prawda on 12.01.2015.
 */
var Tinkerforge = require('tinkerforge');

var HOST = 'localhost';
var PORT = 4223;
var UID = 'qbE'; // Change to your UID

var ipcon = new Tinkerforge.IPConnection(); // Create IP connection
var ptc = new Tinkerforge.BrickletPTC(UID, ipcon); // Create device object

exports.disconnect = disconnect;
exports.getTemp = getTemp;

var measured_temperature = 0; // let default temp be 0

function getTemp() {
    return measured_temperature;
};

// Connect to brickd
ipcon.connect(HOST, PORT,
    function(error) {
        console.log('Error: '+error);
    }
);

// Don't use device before ipcon is connected
ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
        setInterval(function() {
            // Get current temperature (unit is °C/100)
            ptc.getTemperature(
                function (temp) {
                    measured_temperature = temp / 100;
                },
                function (error) {
                    console.log('Error: ' + error);
                }
            )
        }, 500); // delay between updates
    }
);

function disconnect() {
    ipcon.disconnect();
};
