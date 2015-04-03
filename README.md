Tempberry-PID

There are several temperature controlling needs in every household. You might want to control the temperature in your room, the roast meat in your cooking pot, the schnaps distillation on your balcony or just build your own fridge from scratch.
Well, in the past I have done such things with an Arduino, some transducers and relais, but now it is 2015 and it is at least appropriate to have one code base, which controls the heater, reads out the temperature, calculates the PID regulation and
of course pushes everything to a webserver. There you can see the trend of the temperature, as well as the state of power regulation.

For a connection to the real world, Tinkerforge is used (http://www.tinkerforge.com), there are other solutions out there as well, but for me this looks like the most reliable and flexible.