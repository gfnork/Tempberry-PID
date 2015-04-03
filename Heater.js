/**
 * Created by prawda on 12.01.2015.
 */

var relay = require('./QuadRelay.js');

exports.turnOn = turnOn;
exports.turnOff = turnOff;
exports.setPower = setPower;
exports.disconnect = disconnect;

// controlling variables
var currentPower = 0;
var heaterOn = false;
var availablePower = [300, 600, 800, 1000, 1200, 1300, 1500, 1600, 1800, 2000];

function disconnect() {
    relay.disconnect();
};

function setPower(value){
    if(currentPower == 0) pressPowerUp();

    if(value > currentPower){
        while(value > currentPower) {
            pressPowerUp();
        }
    }
    else while(value < currentPower) {
        pressPowerDown();
    }

    return currentPower;
}

function turnOn() {
    if(!heaterOn) pressOnOff();
}

function turnOff() {
    if(heaterOn) {
        pressOnOff();
        currentPower = 0;
    }
}

function pressOnOff(){
    onOff();

    // set bool to new state
    heaterOn = !heaterOn;
}

function pressPowerUp(){
    // if lowest value already reached, do nothing
    if(currentPower == 2000) return;

    powerUp();

    // set currentPower
    if(currentPower == 0) currentPower = 1300;
    else {
        var index = availablePower.indexOf(currentPower);
        currentPower = availablePower[index+1];
    }

    console.log("power up: "+currentPower);
}

function pressPowerDown(){
    // if lowest value already reached, do nothing
    if(currentPower == 300) return;

   powerDown();

    // set currentPower
    if(currentPower == 0) currentPower = 1300;
    else {
        var index = availablePower.indexOf(currentPower);
        currentPower = availablePower[index-1];
    }

    console.log("power down: "+currentPower);
}

function onOff() {
    relay.flop(1);
}

function powerUp() {
    relay.flop(3);
}

function powerDown() {
    relay.flop(4);
}

/* Zustände:
 0: An/Aus, Gerät startet mit 1300W
 1: nicht belegt
 2: Leistung hoch
 3: Leistung runter

 Es gibt folgende Leistungswerte in Watt:
 300, 600, 800, 1000, 1200, 1300, 1500, 1600, 1800, 2000
 */