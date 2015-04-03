/**
 * Created by prawda on 12.01.2015.
 */
var Q = require('q');
var Tinkerforge = require('tinkerforge');

// connection variables
var HOST = 'localhost';
var PORT = 4223;
var UID = 'mUn';
var delay = 600; // relay delay in ms

var ipcon = new Tinkerforge.IPConnection(); // Create IP connection
var iqr = new Tinkerforge.BrickletIndustrialQuadRelay(UID, ipcon); // Create device object

exports.flop = flopRelais;

// controlling variables
var connected = false;

// Connect to brickd
ipcon.connect(HOST, PORT,
    function(error) {
        console.log('Error: '+error);
    }
);

// Don't do stuff on device before ipcon is connected
ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
        connected = true;
    }
);

function disconnect() {
    ipcon.disconnect();
    connected = false;
};


var queue = Q.Promise(function(resolve, reject, notify) {
    resolve();
});

function flopRelais(id) {
    var shitzens = function() {
        return Q.Promise(function(resolve, reject, notify) {
            //close and open relais (1=0001, 2=0010, 4=0100, 8=1000)
            var relais = {1:1, 2:2, 3:4, 4:8};
            iqr.setMonoflop(relais[id], relais[id], delay);

            console.log("flop "+relais[id]+"!");

            // resolve after delay
            //setTimeout(function() { resolve(); }, delay+10);
            setTimeout(resolve, delay+10);
        });
    };

    queue = queue.then(shitzens).fail(function(err) { console.log( err )});
}
