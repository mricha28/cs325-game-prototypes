// Create our 'main' state that will contain the game
var car;
var cone;
var background;
var ramp;
var gameEvent;
var tempX = 0;
var tempY = 0;
var overlap = true;
var scrollSpeed = 200;
var spike;
var tireSound;
var music;
var carEngine;
var eventTime = 1200;
var spawnTime = 3000;
var speedTimer;
var mainState = {
    preload: function() { 
        // Load the bird sprite
        game.load.image('car', 'assets/car.png'); 

        game.load.image('pipe', 'assets/pipe.png');

        game.load.image('cone', 'assets/cone.png');

        game.load.image('background', 'assets/background.png');

        game.load.image('ramp', 'assets/ramp.png');

        game.load.image('spike', 'assets/spike.png');

        game.load.audio('music', 'assets/music.mp3');

        game.load.audio('carEngine', 'assets/carEngine.mp3');

        game.load.audio('tires', 'assets/tires.mp3');
    },
    
    create: function() { 
        background = game.add.sprite(0, 0, 'background');
    
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        car = game.add.sprite(100, 245, 'car');
    
        // Add physic
        game.physics.arcade.enable(car); 
    

        var leftkey = game.input.keyboard.addKey(
            Phaser.Keyboard.LEFT);
        leftkey.onDown.add(this.leftMove, this); 

        var rightkey = game.input.keyboard.addKey(
            Phaser.Keyboard.RIGHT);
        rightkey.onDown.add(this.rightMove, this); 

        var cursors = game.input.keyboard.createCursorKeys();
        
        this.pipes = game.add.group();

        this.timer = game.time.events.loop(spawnTime, this.addRowOfCones, this); 

        speedTime = game.time.events.loop(30000, this.speedUp, this);

        gameEvent = game.time.events.loop(eventTime, this.gameAction, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        tireSound = game.add.audio('tires');
        music = game.add.audio('music');
        music.play();
        carEngine = game.add.audio('carEngine');
    },
    
    update: function() {
     
        // Call the 'restartGame function
        if (car.y < 0 || car.y > 490 || car.x < -50 || car.x > 400)
        {
            this.restartGame();
        }
        
        if(overlap)
        {
        game.physics.arcade.overlap(car, this.pipes, this.restartGame, null, this);
        game.physics.arcade.overlap(car, ramp, this.scaleUp, null, this);
        game.physics.arcade.overlap(car, spike, this.hitSpike, null, this);
        }
    },

leftMove: function() {
    car.body.velocity.x = -250;
},

rightMove: function() {
    car.body.velocity.x = 250;
},

// Restart the game
restartGame: function() {
    // Start the 'main' state, which restarts the game
    music.stop();
    game.state.start('main');
},

addOneCone: function(x, y) {
    // Create a cone at the position x and y
    var cone = game.add.sprite(x, y, 'cone');

    // Add the cone to group
    this.pipes.add(cone);

    // Enable physics on the cone 
    game.physics.arcade.enable(cone);

    // Add velocity to the pipe to make it move left
    cone.body.velocity.y = scrollSpeed; 

    // Automatically kill the pipe when it's no longer visible 
    cone.checkWorldBounds = true;
    cone.outOfBoundsKill = true;
},

addRowOfCones: function() {
    // This will be the hole 
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 cones
    for (var i = 0; i < 8; i++)
    {
        if (i != hole && i != hole + 1) 
        {
            this.addOneCone(i * 60 + 10, 0);  
        }
            
    }

    this.score += 100;
    this.labelScore.text = this.score; 
         
},

gameAction: function() {
    //Picks a random amount of objects to place on the screen.
    //Each object does something different

    var rand = Math.floor((Math.random()*2) + 1);
    var randX;
    var randY = 0;

    if(rand == 2)
    {
        
            rand = Math.floor((Math.random()*5)) + 1;
            randX =  Math.floor((Math.random()*300)) + 20;
            randY =  randY - Math.floor((Math.random()*100)) + 50;
           
            if(rand == 1 || rand == 2)//ramp
            {
             ramp = game.add.sprite(randX, randY, 'ramp');
                
             game.physics.arcade.enable(ramp);
                
             ramp.body.velocity.y = scrollSpeed; 

            }    

            rand = Math.floor((Math.random()*5)) + 1;
            randX =  Math.floor((Math.random()*300)) + 20;
            randY =  randY - Math.floor((Math.random()*100)) + 50;

            if(rand == 1 || rand == 3)
            {
                spike = game.add.sprite(randX, randY, 'spike');

                game.physics.arcade.enable(spike);

                spike.body.velocity.y = scrollSpeed; 
            }


            

        
    }

    game.world.bringToTop(car);
    
},

scaleUp: function() {
    carEngine.stop();
    carEngine.play();

    this.score += 50;
    this.labelScore.text = this.score; 
    
    overlap = false;

    tempX = ramp.scale.x;
    tempY = ramp.scale.y;

    car.scale.setTo(tempX*1.25, tempY*1.25);

    game.time.events.add(Phaser.Timer.SECOND * .75, this.scaleDown, this);
    
},

scaleDown: function(){

    car.scale.setTo(tempX, tempY);
    overlap = true;
},

hitSpike: function(){
    tireSound.stop();
    tireSound.play();
    car.body.velocity.y = 50;
    
    game.time.events.add(Phaser.Timer.SECOND * 2, this.resetSpeed, this);
    game.time.events.add(Phaser.Timer.SECOND * 10, this.resetLocation, this);
},

resetSpeed: function(){
    car.body.velocity.y = 0;
},

resetLocation: function(){
    car.body.velocity.y = -50;
    game.time.events.add(Phaser.Timer.SECOND * 2, this.resetSpeed, this);
},

speedUp: function(){
    scrollSpeed = scrollSpeed*1.2
}

}
// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');