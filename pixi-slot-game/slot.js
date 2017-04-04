//constants
var IMG_MACHINE = "./images/reels.png";
var IMG_BODY = "./images/body.png";
var IMG_BUTTON = "./images/button.png";

var STATE_ZERO = 0;
var STATE_INIT = 1;
var STATE_MOVING = 2;
var STATE_CHECK_WIN = 3;

var SLOT_NUMBER = 3;
var INITIAL_X = 25;
var TILE_HEIGHT = 100;
var TILE_WIDTH = TILE_HEIGHT;
var N_CYCLE = 5;
var TOT_TILES = 7;

/*
 * 0: fermo
 * 1: moving
 * 2: check win
 */
var gameStatus = 0;
var finalTileY = [];
var slotSprite = [];
var preChoosedPosition = [];

var stage = new PIXI.Stage(0x000000);
var renderer = PIXI.autoDetectRenderer(
    window.innerWidth, window.innerHeight, { antialiasing: false, transparent: false, resolution: 1 }
);
// var mainContainer = document.getElementById('main-container');
// mainContainer.appendChild(renderer.view);
document.body.appendChild(renderer.view);
stage.interactive = true;

//loading images
var loader = new PIXI.AssetLoader(
    [IMG_MACHINE, IMG_BODY, IMG_BUTTON]
);
loader.onComplete = setup;
loader.load();



//setup
function setup() {
    console.log("setup()");

    var texture = PIXI.TextureCache[IMG_BODY];
    bodySprite = new PIXI.Sprite(texture);
    bodySprite.x = 0;
    bodySprite.y = 0;
    stage.addChild(bodySprite);

    texture = PIXI.TextureCache[IMG_BUTTON];
    buttonSprite = new PIXI.Sprite(texture);
    buttonSprite.x = 386;
    buttonSprite.y = 50;
    stage.addChild(buttonSprite);
    buttonSprite.interactive = true;
    buttonSprite.click = function(e) {
        startAnimation();
    }

    buttonSprite.touchstart = function(e) {
        startAnimation();
    }


    //tiles
    texture = PIXI.TextureCache[IMG_MACHINE];
    preChoosedPosition = [1, 2, 3];
    for (var i = 0; i < SLOT_NUMBER; i++) {
        slotSprite[i] = new PIXI.TilingSprite(texture, TILE_WIDTH, TILE_HEIGHT + 20);
        slotSprite[i].tilePosition.x = 0;
        slotSprite[i].tilePosition.y = (-preChoosedPosition[i] * TILE_HEIGHT) + 10;
        slotSprite[i].x = INITIAL_X + (i * 115);
        slotSprite[i].y = 190;
        stage.addChild(slotSprite[i]);
    }
    draw();
}




var INC = [15, 20, 25];

//functions draw
function draw() {
    console.info("draw(" + gameStatus + ")");
    if (gameStatus == STATE_ZERO) {
        gameStatus = STATE_INIT;
    } else
    if (gameStatus == STATE_INIT) {
        console.log("waiting start");
        gameStatus = STATE_CHECK_WIN;

    } else if (gameStatus == STATE_MOVING) {
        console.log("moving");

        for (var i = 0; i < SLOT_NUMBER; i++) {
            if (finalTileY[i] > 0) {
                slotSprite[i].tilePosition.y = slotSprite[i].tilePosition.y + INC[i];
                finalTileY[i] = finalTileY[i] - INC[i];
                //console.info( "dec.finalTile["+i+"]="+finalTileY[i] );
            }
        }

        if (finalTileY[0] - 5 <= 0) {
            gameStatus = STATE_CHECK_WIN;

        }

        //  gameStatus = STATE_CHECK_WIN;

    } else if (gameStatus == STATE_CHECK_WIN) {
        console.log("checking win");
        var test = true;
        for (var i = 1; i < SLOT_NUMBER; i++) {
            if (preChoosedPosition[i] != preChoosedPosition[i - 1]) {
                test = false;
            }
        }
        if (test) {
            alert("Congratulations, you won!");
        }
        return; //no more animation
    }
    renderer.render(stage);
    requestAnimationFrame(draw);
} //draw

function startAnimation() {
    if (gameStatus == STATE_INIT || gameStatus == STATE_CHECK_WIN) {
        preChoosedPosition = getRandomPositions();
        for (var i = 0; i < SLOT_NUMBER; i++) {
            //preChoosedPosition[i] = getRandomInt(0,6);
            console.info("preChoosedPosition[" + i + "]=" + preChoosedPosition[i]);
            slotSprite[i].tilePosition.y = (-preChoosedPosition[i] * TILE_HEIGHT) + 10;
            finalTileY[i] = (N_CYCLE * TILE_HEIGHT * TOT_TILES);
            console.info("tilePosition.y[" + i + "]=" + slotSprite[i].tilePosition.y);
            console.info("finalTile[" + i + "]=" + finalTileY[i]);
        }
        gameStatus = STATE_MOVING;
        draw();
    }
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPositions() {
    var x = getRandomInt(0, 100);
    if (x > 50) {
        x = getRandomInt(0, 6);
        return [x, x, x];
    }
    return [getRandomInt(0, 6), getRandomInt(0, 6), getRandomInt(0, 6)];
}