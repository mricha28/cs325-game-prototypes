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
    
    var game = new Phaser.Game( 1200, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        //Load images
        game.load.image( 'Cursor_01', 'assets/Cursor_01.png' );
        game.load.image( 'Cursor_02', 'assets/Cursor_02.png');
        game.load.image( 'Bullet1', 'assets/Bullet1.png');
        game.load.image( 'Bullet2', 'assets/Bullet2.png');
        game.load.audio( 'Music', 'assets/Music.mp3');
    }
    
    var Cursor_01;
    var Cursor_02;
    var keys;
    var wasd;
    var bullets1;
    var bullets2;
    var bullet;
    var bullet2;
    var fireRate = 140;
    var nextFire = 0;
    var fireRate2 = 140;
    var nextFire2 = 0;
    var player1Health = 150;
    var player2Health = 150;
    var player1HealthText;
    var player2HealthText;
    var isEndGame;
    var endGameText;
    var music;
    
    function create() {

        isEndGame = false;
        // Create a sprite at the center of the screen using the 'logo' image.
        Cursor_01 = game.add.sprite( game.world.centerX - 25, game.world.centerY, 'Cursor_01' );
        Cursor_02 = game.add.sprite( game.world.centerX + 25, game.world.centerY, 'Cursor_02' );
        
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        Cursor_01.anchor.setTo( 0.5, 0.5 );
        Cursor_02.anchor.setTo( 0.5, 0.5 );

        game.physics.arcade.enable(Cursor_01);
        game.physics.arcade.enable(Cursor_02);

        Cursor_01.body.collideWorldBounds = true;
        Cursor_02.body.collideWorldBounds = true;

        //create player 1 bullets
        bullets1 = game.add.group();
        bullets1.enableBody = true;
        bullets1.physicsBodyType = Phaser.Physics.ARCADE;

        bullets1.createMultiple(100, 'Bullet1');
        bullets1.setAll('checkWorldBounds', true);
        bullets1.setAll('outOfBoundsKill', true);

        //create player 2 bullets
        bullets2 = game.add.group();
        bullets2.enableBody = true;
        bullets2.physicsBodyType = Phaser.Physics.ARCADE;

        bullets2.createMultiple(100, 'Bullet2');
        bullets2.setAll('checkWorldBounds', true);
        bullets2.setAll('outOfBoundsKill', true);

        //Create input keys
        keys = game.input.keyboard.createCursorKeys();
        wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            };

        player1HealthText = game.add.text(16, 16, 'Player 1 Health = ' + player1Health, { fill: '#ffffff' });
        player2HealthText = game.add.text(16, 46, 'Player 2 Health = ' + player2Health, { fill: '#ffffff' })

        game.physics.arcade.collide(bullets1, Cursor_02);
        game.physics.arcade.collide(bullets2, Cursor_01);

        music = game.add.audio('Music');
        music.play();

    }
    
    function update() {
        //if game is not over
        if(!isEndGame)
        {
        player1Move();
        player2Move();
        player1Rotation();
        player2Rotation();
        if(Cursor_01.body.velocity.x != 0 || Cursor_01.body.velocity.y != 0)
        {
            fire1();
        }
        if(Cursor_02.body.velocity.x != 0 || Cursor_02.body.velocity.y != 0)
        {
            fire2();
        }  

        game.physics.arcade.overlap(bullets1, Cursor_02, takeHealth2);
        game.physics.arcade.overlap(bullets2, Cursor_01, takeHealth1);
        }
        else if(isEndGame)
        {
            music.stop();
            //stop players from moving
            Cursor_01.body.velocity.x = 0;
            Cursor_01.body.velocity.y = 0;
            Cursor_02.body.velocity.x = 0;
            Cursor_02.body.velocity.y = 0;

            //check who won
            if(player1Health <= 0)
            {
               endGameText = game.add.text(game.world.centerX, game.world.centerY, 'Player 2  Wins!', { fill: '#800080' });
            }
            else if(player2Health <= 0)
            {
                endGameText = game.add.text(game.world.centerX, game.world.centerY, 'Player 1  Wins!', { fill: '#00FF00' });
            }
        }
        
    }
    //subtract player 1 health
    function takeHealth1()
    {
        if(player1Health > 0)
        {
            player1Health -= 1
            player1HealthText.setText("Player 1 Health = " + player1Health);
        }
        else
        {
            isEndGame = true;
        }
    }

    //subtract player 2 health
    function takeHealth2()
    {
        if(player2Health > 0)
        {
            player2Health -= 1
            player2HealthText.setText("Player 2 Health = " + player2Health);
        }
        else
        {
            isEndGame = true;
        }
    }


    //convert to degrees
    function toDegrees (angle) 
    {
        return angle * (180 / Math.PI);
    }
    
    //rotate player 1
    function player1Rotation()
    {
        var angle = toDegrees(Math.atan(Cursor_01.body.velocity.y/Cursor_01.body.velocity.x));
        //Check which quadrant cursor is in
        if(Cursor_01.body.velocity.x > 0)
        {
            Cursor_01.angle = angle + 90;
        }
        else if (Cursor_01.body.velocity.x < 0){

            Cursor_01.angle = angle - 90;
        }
                
        //console.log("Angle = "+angle);
    }
    
    //rotate player 2
    function player2Rotation()
    {
        var angle2 = toDegrees(Math.atan(Cursor_02.body.velocity.y/Cursor_02.body.velocity.x));
        //Check which quadrant cursor is in
        if(Cursor_02.body.velocity.x > 0)
        {
            Cursor_02.angle = angle2 + 90;
        }
        else if (Cursor_02.body.velocity.x < 0){

            Cursor_02.angle = angle2 - 90;
        }
                
        //console.log("Angle = "+angle);
    }

    //Set players velocity based on keyboard input
    function player1Move()
    {
        
        if (keys.left.isDown)
        {
            if(Cursor_01.body.velocity.x > 0)
            {
             Cursor_01.body.velocity.x -= 16;
            }
            else if(Cursor_01.body.velocity.x > -250)
            {
            Cursor_01.body.velocity.x -= 6;
            }
        }
        else
        {
         Cursor_01.body.velocity.x += 3;   
        }
        
        if(keys.right.isDown)
        {
            if(Cursor_01.body.velocity.x < 0)
            {
             Cursor_01.body.velocity.x += 16;
            }
            else if(Cursor_01.body.velocity.x < 250)
            {
            Cursor_01.body.velocity.x += 6;
            }
        } 
        else
        {
         Cursor_01.body.velocity.x -= 3;   
        }

        if(keys.down.isDown)
        {
            if(Cursor_01.body.velocity.y < 0)
            {
             Cursor_01.body.velocity.y += 16;
            }
            else if(Cursor_01.body.velocity.y < 250)
            {
            Cursor_01.body.velocity.y += 6;
            }
        }
        else
        {
         Cursor_01.body.velocity.y -= 3;   
        }
        
        if(keys.up.isDown)
        {
            if(Cursor_01.body.velocity.y > 0)
            {
             Cursor_01.body.velocity.y -= 16;
            }
            else if(Cursor_01.body.velocity.y > -250)
            {
             Cursor_01.body.velocity.y -= 6;
            }
        }
        else
        {
         Cursor_01.body.velocity.y += 3;   
        }
    }

    //set player 2 velocity
    function player2Move()
    {
        
        if (wasd.left.isDown)
        {
            if(Cursor_02.body.velocity.x > 0)
            {
             Cursor_02.body.velocity.x -= 16;
            }
            else if(Cursor_02.body.velocity.x > -250)
            {
            Cursor_02.body.velocity.x -= 6;
            }
        }
        else
        {
         Cursor_02.body.velocity.x += 3;   
        }
        
        if(wasd.right.isDown)
        {
            if(Cursor_02.body.velocity.x < 0)
            {
             Cursor_02.body.velocity.x += 16;
            }
            else if(Cursor_02.body.velocity.x < 250)
            {
            Cursor_02.body.velocity.x += 6;
            }
        } 
        else
        {
         Cursor_02.body.velocity.x -= 3;   
        }

        if(wasd.down.isDown)
        {
            if(Cursor_02.body.velocity.y < 0)
            {
             Cursor_02.body.velocity.y += 16;
            }
            else if(Cursor_02.body.velocity.y < 250)
            {
            Cursor_02.body.velocity.y += 6;
            }
        }
        else
        {
         Cursor_02.body.velocity.y -= 3;   
        }
        
        if(wasd.up.isDown)
        {
            if(Cursor_02.body.velocity.y > 0)
            {
             Cursor_02.body.velocity.y -= 16;
            }
            else if(Cursor_02.body.velocity.y > -250)
            {
             Cursor_02.body.velocity.y -= 6;
            }
        }
        else
        {
         Cursor_02.body.velocity.y += 3;   
        }
    }

    //fire for player 1
    function fire1() {

        //make delay for bullets firing
        if (game.time.now > nextFire && bullets1.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;
    
            bullet = bullets1.getFirstDead();
    
            bullet.reset(Cursor_01.x, Cursor_01.y);

            bullet.body.velocity.x = Cursor_01.body.velocity.x*3;
            bullet.body.velocity.y = Cursor_01.body.velocity.y*3;

            bullet.angle = Cursor_01.angle;

            if(game.physics.arcade.overlap(bullets1, Cursor_02))
            {
                bullet.destroy();
            }
        }
    
    }

    //fire for player 2
    function fire2() {

        if (game.time.now > nextFire2 && bullets2.countDead() > 0)
        {
            nextFire2 = game.time.now + fireRate2;
    
            bullet2 = bullets2.getFirstDead();
    
            bullet2.reset(Cursor_02.x, Cursor_02.y);

            bullet2.body.velocity.x = Cursor_02.body.velocity.x*3;
            bullet2.body.velocity.y = Cursor_02.body.velocity.y*3;

            bullet2.angle = Cursor_02.angle;

            if(game.physics.arcade.overlap(bullets2, Cursor_01))
            {
                bullet2.destroy();
            }
        }
    
    }

};
