"use strict";
window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".   

var phaserGlobal;
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('ball', 'assets/Sprites/ball.png');
    game.load.audio('plop', 'assets/soundEffects/plop.mp3');
    game.load.audio('music', 'assets/soundEffects/music.mp3')
}

var sprite;
var ballSpeed = 500;
var text;
var plop;
var music;

function create() {

   // text = game.add.text(0, 0, "Deaths: ", style);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'ball');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.inputEnabled = true;

    plop = game.add.audio('plop');
    music = game.add.audio('music');
    
    music.onDecoded.add(start, this);
    

    //  Enable Arcade Physics for the sprite
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

    //speed up ball
    game.time.events.repeat(Phaser.Timer.SECOND * 5, 1000, addSpeed, this);

}

function update() {

    sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, ballSpeed);
    
    if(sprite.input.pointerOver()){
        start();
        plop.play();
        sprite.reset(0, 0);
        ballSpeed = 500;
    }
    
}

function start(){
    
    music.fadeIn(24000);
}

function render() {

    //game.debug.spriteInfo(sprite, 32, 32);

    game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 32, 32);
    //game.debug.soundInfo(music, 20, 32);
}

function addSpeed() {
    if(ballSpeed > 10){
        ballSpeed = ballSpeed*.75;
    }
    
}
}
