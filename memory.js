"use strict";

/* ======================================================================================= */
/* ------- Non-game-loop Variables, Function, and Class Definitions ---------------------- */
/* ======================================================================================= */


//Change available random Font Awesome icon classes here
var iconList = "fa-beer,fa-bell,fa-cab,fa-diamond,fa-fighter-jet,fa-flask,fa-graduation-cap,fa-headphones,fa-linux,fa-legal,fa-life-ring,fa-money,fa-motorcycle,fa-pencil,fa-rocket,fa-truck,fa-birthday-cake,fa-camera-retro,fa-drupal,fa-fax,fa-futbol-o,fa-github-alt,fa-floppy-o,fa-lightbulb-o,fa-fort-awesome";

var body = document.getElementsByTagName('body')[0];
var startMenu = document.getElementById('start-menu');
var gameScreen = document.getElementById('game');
var easyBtn = document.getElementById('easy-btn');
var easyGrid = document.getElementById('easy-grid-container');
var hardBtn = document.getElementById('hard-btn');
var hardGrid = document.getElementById('hard-grid-container');
var easyBtnPressed = false;
var hardBtnPressed = false;
var boxes = [];
var lives = 0;

function printLives(display, count) {
    var str = '<i class="fa fa-heart"></i>';
    for (var i = 0; i < count; i += 1) {
        str += '<i class="fa fa-heart"></i>';
    }
    display.innerHTML = str;
}

easyBtn.addEventListener('click', function() {
    body.style.backgroundColor = "#3f51b5";
    startMenu.style.display = "none";
    gameScreen.style.visibility = "visible";
    easyBtnPressed = true;
    lives = 11;
    //Display initial lives
    printLives(document.getElementById('lives'), lives);
    boxes = easyGrid.getElementsByClassName('box');
    startTimer();
});

hardBtn.addEventListener('click', function() {
    body.style.backgroundColor = "#3f51b5";
    startMenu.style.display = "none";
    gameScreen.style.visibility = "visible";
    hardBtnPressed = true;
    easyGrid.style.display = "none";
    hardGrid.style.visibility = "visible";
    lives = 19;
    //Display initial lives
    printLives(document.getElementById('lives'), lives);
    boxes = hardGrid.getElementsByClassName('box');
    startTimer();
});

/* ES6 Stopwatch class, heavily inspired by https://codepen.io/_Billy_Brown/pen/dbJeh */
class StopWatch {
    constructor(display) {
        //Element that elapsed time will be rendered onto
        this.display = display;
        this.running = false;
        this.reset();
        this.print(this.times);
    }

    reset() {
        this.times = [0, 0, 0];
    }

    start() {
        //Current timestamp in milliseconds, based on page load rather than Date.now() unix timestamp
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));

    }

    stop() {
        this.running = false;
    }

    calculate(timestamp) {

        //Get the change in timestamps between render frames
        var diff = timestamp - this.time;

        //Get hundredths of a second from milliseconds
        this.times[2] += diff / 10;

        //Increment seconds at the frame when ms >= 100
        if (this.times[2] >= 100) {
            this.times[2] -= 100;
            this.times[1] += 1;
        }

        //Increment minutes after 60 seconds have elapsed at the frame
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }

    }

    pad0(value, placecount) {
        var result = value.toString();

        for (; result.length < placecount; --placecount) {
            result = '0' + result;
        }
        return result;
    }

    format(times) {
        return `\
            ${this.pad0(times[0], 2)}:\
            ${this.pad0(times[1], 2)}:\
            ${this.pad0(Math.floor(times[2]),2)}`;
    }

    print() {
        this.display.innerHTML = this.format(this.times);
    }

}

class Box {
    constructor(id, faicon, twinid, elemid = 0) {
        //Unique identifier and index in boxList
        this.id = id;

        //favicon class
        this.faicon = faicon;

        //index of matching twin in boxList
        this.twinid = twinid;

        //Real id of element in dom 
        this.elemid = elemid;
    }

}

let stopwatch = new StopWatch(document.getElementById('timer'));

function startTimer() {
    stopwatch.start();
    startGame();
}






/* ======================================================================================= */
/* ------- Game-loop Variables and Function Definitions ---------------------------------- */
/* ======================================================================================= */




function startGame() {
    //Stores list of ids of boxes currently 'opened'
    var boxesOpen = [];

    //Stores list of ids of boxes already matched to ignore
    var boxesMatched = [];

    //Stores the list of available places which random pairs of numbers can be picked out of
    var boxMapNL = [];
    for (var i = 0; i < boxes.length; i++) {
        boxMapNL.push(i);
    }

    //Stores the boxes' object counterparts as JS sees them in an array parallel to 
    var boxObjList = [];

    //Split up the icon class values into an array
    var iconsNL = iconList.split(",");

    //Make the NodeLists into arrays so that we can use the slice function later
    var icons = Array.from(iconsNL),
        boxMap = Array.from(boxMapNL);

    //Generates a random integer from 0 to arrlength
    function getRandomIndex(arrlength) {
        return Math.floor(Math.random() * arrlength);
    }




    /* ======================================================================================= */
    /* ------------------------- Main Game Logic 'onBoxClick()' ------------------------------ */
    /* ======================================================================================= */

    //Called each time a box is clicked
    function onBoxClick(id) {

        //This is where most main game functions happen, called on click of one of the boxes below, and points based on JS objects generated per unique box

        //Declare our box element and JS object in 'boxObjList' based on that element
        console.log(`Attempting to grab element id '${id}'`);
        var box = document.getElementById(id);
        var intID = id.replace("box", "");
        var oListIndex = boxObjList[intID].id;
        var boxObj = boxObjList[oListIndex];

        //Make sure we can't flip any matched boxes back over
        if (boxesMatched.indexOf(intID) == -1) {

            //If it's not the same box clicked to close it, add it to the list of open boxes
            if (boxesOpen[0] != intID && boxesOpen[1] != intID) {
                boxesOpen.push(intID);
            }

            if (boxesOpen.length <= 2) {
                if (!box.classList.contains('flipfront')) {
                    //Animate open boxes and FAico on screen
                    if (box.classList.contains('flipback'))
                        box.classList.remove('flipback');
                    box.classList.add('flipfront');
                    box.innerHTML = `<i class="flipfrontfade fa ${boxObj.faicon}"></i>`;
                    console.log(`Box #${boxObjList[boxesOpen[0]].elemid} clicked`);
                } else {
                    //Animate closed boxes and clear FAico
                    box.classList.remove('flipfront');
                    box.classList.add('flipback');
                    box.innerHTML = "";
                    console.log(`Box #${boxObjList[boxesOpen[0]].elemid} clicked`);
                    boxesOpen = [];


                }
            }

            if (boxesOpen.length == 2) {
                if (boxes[boxesOpen[1]].innerHTML == boxes[boxesOpen[0]].innerHTML) {

                    //We got a winning pair, leave flipped
                    boxesMatched.push(boxesOpen[1]);
                    boxesMatched.push(boxesOpen[0]);

                    if (boxesMatched.length == boxes.length) {
                        stopwatch.stop();
                        //Wiiiiinnnnnnnerrrrrrrrr
                        //alert("You won, please await your check for one zillion dollars");
                        startAnimation();
                        var wintext = document.getElementById('youwon');
                        wintext.classList.add('flipfront');
                        wintext.innerHTML = "YOU WON!!!";

                    }

                    //Reset boxesOpen so new tiles can be flipped even without flipping them back
                    boxesOpen = [];
                } else {

                    //Nope, flip 'em back and lose a life

                    if (lives > 0) {
                        lives = lives - 1;
                        printLives(document.getElementById('lives'), lives);
                    } else {
                        //Loser
                        alert("You lose, no cool ending animation this time.\nClick the memory logo to play again.");
                        stopwatch.stop();
                    }


                    var box1ElemID = boxesOpen[1];
                    var box2ElemID = boxesOpen[0];


                    //This is apparently a convention of ES6 as opposed to the old setTimeout(), can't say I mind, godspeed IE
                    function sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }

                    //Let the boxes display for 1s, so the pair of wrong cards is momentarily visible
                    async function flipBack(box1ElemID, box2ElemID) {
                        var box1Elem = boxes[box1ElemID];
                        var box2Elem = boxes[box2ElemID];

                        await sleep(1000);

                        console.log(`box1Elem: ${box1ElemID}`);
                        console.log(`box2Elem: ${box2ElemID}`);

                        //Animate closed boxes and clear FAico
                        box1Elem.classList.remove('flipfront');
                        box1Elem.classList.add('flipback');
                        box1Elem.innerHTML = "";

                        box2Elem.classList.remove('flipfront');
                        box2Elem.classList.add('flipback');
                        box2Elem.innerHTML = "";

                        boxesOpen = [];

                    }

                    flipBack(box1ElemID, box2ElemID);
                }

            } // if(boxesOpen.length...) 
        } // if(boxesMatched...)
    } // onBoxClick()



    /* ======================================================================================= */
    /* ---------------------------- Game Tile (Boxes) Generation & Setup --------------------- */
    /* ======================================================================================= */

    //Only need to cycle through half the boxes, because each box is paired with a partner each loop (and obviously they have to be even no matter the grid layout) 
    for (var i = 0; i < (boxes.length / 2); i += 1) {

        //Get a random icon from the list
        var iconIndex = getRandomIndex(icons.length);
        var icon = icons[iconIndex];

        //Remove that icon from the list so it can't be picked for more than one pair per game
        icons.splice(iconIndex, 1);

        //Create box objects in pairs, and "cross out" those pairs in boxMap so that they are not overwritten by the next pair generated in this loop
        var thisId = getRandomIndex(boxMap.length);
        var realId = boxMap[thisId];
        boxMap.splice(thisId, 1);

        var twinId = getRandomIndex(boxMap.length);
        var realTwinId = boxMap[twinId];
        boxMap.splice(twinId, 1);


        let o = new Box(realId, icon, realTwinId);
        let o2 = new Box(realTwinId, icon, realId);

        boxObjList.push(o);
        boxObjList.push(o2);
        console.log(`Pair made at ${realId} and ${realTwinId}, using icon ${icon}`);
    }

    //Move into upper loop later, we'll just leave now for readability
    for (var i = 0; i < boxes.length; i += 1) {
        //Create an id attribute for each of the boxes, to determine which has been clicked
        boxes[i].setAttribute("id", `box${i}`);
        boxObjList[i].elemid = i;
    }

    //Gets clicks anywhere in the body, since DOM event listeners don't work well with elements' attributes generated dynamically.
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'button' && event.target.innerHTML.toLowerCase() != 'easy' && event.target.innerHTML.toLowerCase() != 'hard') {
            onBoxClick(event.target.id.replace("#", ""));
        }
    });
}