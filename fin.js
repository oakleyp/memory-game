"use strict";

/* A cool end screen */


//Change up the colors while we're at it
function getRandomColor(hex = true) {
    if (hex) {
        //Return random a hex color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;

    } else {
        //return random rgba bit out of 255
        var bit = 0;
        bit = Math.floor(Math.random() * 255);

        return bit;
    }
}



function setBgCSS() {
    document.getElementsByTagName('body')[0].style.background = "radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.15) 30%, rgba(255,255,255,.3) 32%, rgba(255,255,255,0) 33%) 0 0,radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.1) 11%, rgba(255,255,255,.3) 13%, rgba(255,255,255,0) 14%) 0 0,radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 17%, rgba(255,255,255,.43) 19%, rgba(255,255,255,0) 20%) 0 110px,radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 11%, rgba(255,255,255,.4) 13%, rgba(255,255,255,0) 14%) -130px -170px,radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 11%, rgba(255,255,255,.4) 13%, rgba(255,255,255,0) 14%) 130px 370px,radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.1) 11%, rgba(255,255,255,.2) 13%, rgba(255,255,255,0) 14%) 0 0,linear-gradient(45deg, #343702 0%, #184500 20%, #187546 30%, #006782 40%, #0b1284 50%, #760ea1 60%, #83096e 70%, #840b2a 80%, #b13e12 90%, #e27412 100%)";
    document.getElementsByTagName('body')[0].style.backgroundRepeat = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundSize = "cover";
    document.getElementsByTagName('body')[0].style.overflow = "hidden";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startAnimation() {




    //Give CSS animations time to finish up
    await sleep(2000);

    setBgCSS();

    //Objects to be in orbit
    var objs = document.getElementById('easy-grid-container').getElementsByTagName('i');

    //set top and left coords close enough to center of the window, and as an accidental bonus, whichever part of the page that may be
    var centerx = Math.round(window.innerWidth * .4);
    var centery = Math.round(window.innerHeight * .3);

    //The radius of each "satellite" object, which behaves like a circle when mapping its coordinates during each render cycle. If instead the individual elements varying sizes were used instead to find their center, it would be more complicated and the spacing wouldn't be as uniform.                    
    var radiusSat = 100;
    //The radius of the circle that these satellites follow
    var radius = 200;

    //Initial x and y coords of each satellite object
    var objX = centerx + radius,
        objY = centery + radius;

    //Coords to be set by loop when moving satellites
    var x, y, angle = 0;

    //Current position on circle in degrees at which the same index of objs is located 
    var angles = [];

    var objsCt = objs.length;

    //Spacing between each floating element, divided into equal parts (angles) within a circle
    var spc = 360 / objsCt;

    //Used to make those degrees real numbers when the real math comes in
    var deg2rad = Math.PI / 180;
    var i = 0;

    for (; i < objsCt; i++) {
        //Initializing array of angles parallel to 'objs[]'. Initial value is 0, following values are assigned angles of position in degrees to be equidistant from eachother given the number of objs as calculated in declaration of 'spc'.
        angles.push(angle);
        angle += spc;
    }

    loop();

    function loop() {
        for (var i = 0; i < angles.length; i++) {
            //for each object in our selection of 'objs[]', calculate the current x&y coordinates given the current position's angle in parallel array 'angles', along the circumference of circle as defined by 'radius'.

            angle = angles[i];

            //Highschool geometry finally becomes useful
            //next x = radius * cos(currentangleinradians)
            //next y = radius * sin(currentangleinrads)
            x = objX + radius * Math.cos(angle * deg2rad);
            y = objY + radius * Math.sin(angle * deg2rad);


            //Let all objects still be interactive regardless of screen position
            objs[i].style.zIndex = "20";

            //Set the position based on the center of the ghost circle guiding the orbiting element
            objs[i].style.position = "absolute";
            objs[i].style.left = (x - radiusSat) + "px";
            objs[i].style.top = (y - radiusSat) + "px";

            if (angle > 180 && angle < 200) {
                //Get rgba alpha from random out of 100, to be rounded to nearest tenth. it may look redundant reading it, but the initial variable that these operations are working with has to have accuracy to 2 decimal places for the division's meaning to be preserved, but also rounded so that there is no more than 1 decimal place for the 0.0-1.0 alpha bit.
                var alphabit = Math.round(Math.floor((Math.random) * 100) / 100) / 10;
                objs[i].style.color = getRandomColor();
            }

            //Set the next degree for position to be calculated for when it's called by 'requestAnimationFrame()'.
            angles[i] = angles[i] + 1;
            if (angles[i] > 360)
                angles[i] = 0;


        }

        //run loop continuously in a separate thread at whichever rate the browser allots based on framerate and available memory
        var fps = 50;
        setTimeout(function() {
            requestAnimationFrame(loop);
        }, 1000 / fps);
    }
}