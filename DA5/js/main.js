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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        //Load images
        game.load.image( 'Cursor_01', 'assets/Cursor_01.png' );
        game.load.image( 'Bullet1', 'assets/Bullet1.png');
        game.load.audio( 'Music', 'assets/Music.mp3');
        game.load.image( 'Enemy', 'assets/Enemy.png');
        game.load.image( 'Dot', 'assets/Dot.png');
        game.load.image( 'Spike', 'assets/Spike.png');
    }
    
    var Cursor_01;
    var keys;
    var bullets1;
    var bullet;
    var fireRate = 140;
    var nextFire = 0;
    var player1Health = 150;
    var player1HealthText;
    var isEndGame;
    var endGameText;
    var music;
    var Enemy_01;
    var gun;
    var fireButton;
    var dot;
    var spawnTimer;
    var enemy1Health = 1000;
    var Spikes;
    var enemy1Speed = 100;
    var speedTimer;
    var spikeSpeed = 150;
    var frequency = 800;
    var screenSpikeTimer;
    var location;
    var xSpacing = 400/20;
    var ySpacing = 300/20;
    var spikeTime = 20;
    var score = 0;
    var scoreText;
    
    function create() {

        isEndGame = false;
        // Create a sprite at the center of the screen using the 'logo' image.
        Cursor_01 = game.add.sprite( game.world.centerX, game.world.centerY + 50, 'Cursor_01' );
        
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        Cursor_01.anchor.setTo( 0.5, 0.5 );

        game.physics.arcade.enable(Cursor_01);

        Cursor_01.body.collideWorldBounds = true;

        dot = game.add.sprite(game.world.centerX, game.world.centerY, 'Dot');
        //create weapon for player
        gun = game.add.weapon(30, 'Bullet1');

        gun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        gun.bulletSpeed = 600;

        gun.fireRate = 1000;

        gun.bulletAngleOffset = 90;

        gun.trackSprite(Cursor_01, 0, 0, true);

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        
        Enemy_01 = game.add.group();
        Enemy_01.enableBody = true;
        Enemy_01.physicsBodyType = Phaser.Physics.ARCADE;

        Enemy_01.createMultiple(100, 'Enemy_01');
        Enemy_01.setAll('checkWorldBounds', true);
        Enemy_01.setAll('outOfBoundsKill', true);

        Spikes = game.add.group();
        Spikes.enableBody = true;
        Spikes.physicsBodyType = Phaser.Physics.ARCADE;

        Spikes.createMultiple(100, 'Spikes');
        Spikes.setAll('checkWorldBounds', true);
        Spikes.setAll('outOfBoundsKill', true);

        //set health

    
        //Create input keys
        keys = game.input.keyboard.createCursorKeys();

        player1HealthText = game.add.text(16, 16, 'Player 1 Health = ' + player1Health, { fill: '#ffffff' });
        scoreText = game.add.text(16, 40, 'Score = ' + score, { fill: '#ffffff' });
        //game.physics.arcade.collide(bullets1, Cursor_

        music = game.add.audio('Music');
        music.play();

        //spawn timer
        spawnTimer = game.time.events.loop(frequency, spawnEnemy, this);
        
        //increase speed
        speedTimer = game.time.events.loop(10000, increaseSpeed, this);

        //screen spike timer
        //screenSpikeTimer = game.time.events.loop(1000, screenSpike, this);

    }
    
    function update() {
        if(player1Health <= 0)
        {
            isEndGame = true;
        }
        //if game is not over
        if(!isEndGame)
        {
        player1Move();
        Cursor_01.rotation = game.physics.arcade.angleBetween(Cursor_01, dot) + 90;
        //player1Rotation();
        /*if(Cursor_01.body.velocity.x != 0 || Cursor_01.body.velocity.y != 0)
        {
            fire1();
        }*/

        }
        else if(isEndGame)
        {
            music.stop();
            //stop players from moving
            Cursor_01.body.velocity.x = 0;
            Cursor_01.body.velocity.y = 0;

            spawnTimer = 0;
        
            speedTimer = 0;

        }
        //overlap bullets and enemy1
        game.physics.arcade.overlap(gun.bullets, Enemy_01, hitEnemy1, null, this);
        game.physics.arcade.overlap(Spikes, Cursor_01, hitPlayer, null, this);
        game.physics.arcade.overlap(Enemy_01, Cursor_01, hitPlayer2, null, this);
        
    }
    //subtract player 1 health
    function hitPlayer()
    {
        var temp = Spikes.getClosestTo(Cursor_01);
        temp.destroy();
        if(player1Health > 0)
        {
            player1Health -= 10
            player1HealthText.setText("Player 1 Health = " + player1Health);
        }
        else
        {
            isEndGame = true;
        }
    }

    function hitPlayer2()
    {
        var temp = Enemy_01.getClosestTo(Cursor_01);
        temp.destroy();
        if(player1Health > 0)
        {
            player1Health -= 50
            player1HealthText.setText("Player 1 Health = " + player1Health);
        }
        else
        {
            player1Health = 0;
            player1HealthText.setText("Player 1 Health = " + player1Health);
            isEndGame = true;
        }
    }


    //convert to degrees
    function toDegrees (angle) 
    {
        return angle * (180 / Math.PI);
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

        if(fireButton.isDown)
        {
            gun.fireAtSprite(dot);
        }
    }
    
    function spawnEnemy()
    {
        var rand = Math.floor((Math.random()*1) + 1);
        
        if(rand == 1)
        {
            spawnEnemy1();
        }
    }

    function spawnEnemy1()
    {
        Enemy_01.create(game.world.centerX, game.world.centerY, 'Enemy');
        game.physics.arcade.enable(Enemy_01);
        game.physics.arcade.moveToObject(Enemy_01.getTop(), Cursor_01, enemy1Speed);
    }

    function hitEnemy1(bullet)
    {
        bullet.kill();
            var temp = Enemy_01.getClosestTo(bullet);
            var spike1;
            Spikes.create(temp.x, temp.y - 10, 'Spike');
            spike1 = Spikes.getTop()
            spike1.body.velocity.y = - spikeSpeed;
            
            Spikes.create(temp.x, temp.y + 10, 'Spike');
            spike1 = Spikes.getTop()
            spike1.body.velocity.y = spikeSpeed;
            spike1.angle += 180;
            
            Spikes.create(temp.x - 10, temp.y, 'Spike');
            spike1 = Spikes.getTop()
            spike1.body.velocity.x = - spikeSpeed;
            spike1.angle -= 90;
            
            Spikes.create(temp.x + 10, temp.y, 'Spike');
            spike1 = Spikes.getTop()
            spike1.body.velocity.x = spikeSpeed;
            spike1.angle += 90;
            
            temp.destroy();

            score += 10
            scoreText.setText("Score = " + score);
    }

    function increaseSpeed()
    {
        if(enemy1Speed < 500)
        {
            enemy1Speed += 20 
        }
        
        if(spikeSpeed < 500)
        {
            spikeSpeed += 20;
        }
        
        if(frequency > 100)
        {
            frequency -=100;
        }
        
    }
    /*
    function screenSpike()
    {
        spawnTimer = 0;
        
        //increase speed
        speedTimer = 0;

        //screen spike timer
        screenSpikeTimer = 0;

        var rand = 1 //Math.floor((Math.random()*4) + 1);

        if(rand == 1)
        {
            var spikeTimer = game.time.events.loop(100, screenSpike1, this);
        }
        else if(rand == 2)
        {
            var spikeTimer = game.time.events.loop(100, screenSpike2, this);
        }
        else if(rand == 3)
        {
            var spikeTimer = game.time.events.loop(100, screenSpike3, this);
        }
        else
        {
            var spikeTimer = game.time.events.loop(100, screenSpike4, this);
        }
    }

    function screenSpike1()
    {
        var rand = Math.floor((Math.random()*2) + 1);

        if(rand == 1)
        {
            location = 0;
        }
        else
        {
            location = 600;
            ySpacing = ySpacing*(-1);
        }
        
        if(spikeTime == 0)
        {
            spikeTime = 10;
            //spawn timer
            spawnTimer = game.time.events.loop(frequency, spawnEnemy, this);
        
            //increase speed
            speedTimer = game.time.events.loop(20000, increaseSpeed, this);

            //screen spike timer
            screenSpikeTimer = game.time.events.loop(50000, screenSpike, this);

        }
        else
        {
            Spikes.create(0, location, 'Spike');
            var temp1 = Spikes.getTop();
            temp1.body.velocity.x = spikeSpeed;
            location += ySpacing;
            spikeTime--;
        }
    }*/
};
