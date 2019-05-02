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
        // Load an image and call it 'logo'.
        game.load.image( 'Player', 'assets/Player.png' );
        game.load.image( 'Enemy', 'assets/Enemy.png' );
        game.load.image( 'Enemy2', 'assets/Enemy2.jpg' );
        game.load.image( 'Enemy3', 'assets/Enemy3.jpg' );
        game.load.image( 'Freeze', 'assets/Freeze.png');
        game.load.image( 'Bomb', 'assets/Bomb.png');
        game.load.image( 'Speed', 'assets/Speed.png');
    }
    var tempTimer;
    var itemKillTimer;
    var itemTimer;
    var Freeze;
    var Bomb;
    var Speed;
    var speedBoost = 0;
    var bouncy;
    var EnemyGroup;
    var Enemy2Group;
    var Enemy3Group;
    var SpawnTimer = 0;
    var Enemy2Timer;
    var Enemy3Timer;
    var keys;
    var Player;
    var EnemySpeed = 200;
    var E3HasSpawned = false;
    var scaleCheck = 0;
    var currentTime = 0;
    var text;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        Player = game.add.sprite( game.world.centerX, game.world.centerY, 'Player' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        Player.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( Player, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        Player.body.collideWorldBounds = true;

        //Set enemy groups
        EnemyGroup = game.add.group();
        EnemyGroup.enableBody = true;
        EnemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        EnemyGroup.createMultiple(100, 'Enemy');
        EnemyGroup.setAll('checkWorldBounds', true);
        EnemyGroup.setAll('outOfBoundsKill', true);

        Enemy2Group = game.add.group();
        Enemy2Group.enableBody = true;
        Enemy2Group.physicsBodyType = Phaser.Physics.ARCADE;

        Enemy2Group.createMultiple(100, 'Enemy2');
        Enemy2Group.setAll('checkWorldBounds', true);
        Enemy2Group.setAll('outOfBoundsKill', true);

        Enemy3Group = game.add.group();
        Enemy3Group.enableBody = true;
        Enemy3Group.physicsBodyType = Phaser.Physics.ARCADE;

        Enemy3Group.createMultiple(100, 'Enemy3');
        Enemy3Group.setAll('checkWorldBounds', true);
        Enemy3Group.setAll('outOfBoundsKill', true);

        if(SpawnTimer == 0)
        {
            SpawnTimer = game.time.events.loop(1000, SpawnEnemy, this);
            itemTimer = game.time.events.loop(10000, SpawnItem, this);
            Enemy2Timer = game.time.events.loop(10000, killEnemy2, this);
        }
        

        keys = game.input.keyboard.createCursorKeys();
        
    }
    
    function update() {

        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        playerMove();

        game.physics.arcade.overlap(EnemyGroup, Player, Reset, null, this);
        game.physics.arcade.overlap(Enemy2Group, Player, Reset, null, this);
        game.physics.arcade.overlap(Enemy3Group, Player, Reset, null, this);
        game.physics.arcade.overlap(Freeze, Player, freeze, null, this);
        game.physics.arcade.overlap(Bomb, Player, bomb, null, this);
        game.physics.arcade.overlap(Speed, Player, speed, null, this);
        
    }

    function playerMove(){
        if (keys.left.isDown)
        {
           Player.body.velocity.x = -200 - speedBoost;
        }
        
        if(keys.right.isDown)
        {
            Player.body.velocity.x = 200 + speedBoost;
        } 

        if(keys.down.isDown)
        {
            Player.body.velocity.y = 200 + speedBoost;
        }
    
        if(keys.up.isDown)
        {
            Player.body.velocity.y = -200 - speedBoost;
        }

        if(!(keys.left.isDown || keys.right.isDown))
        {
            Player.body.velocity.x = 0;
        }

        if(!(keys.down.isDown || keys.up.isDown))
        {
            Player.body.velocity.y = 0;
        }
       

    
    }

    function SpawnEnemy() {
        var rand = Math.floor((Math.random()*100) + 1)

        var randX = Math.floor((Math.random()*800) + 1);
        var randY = Math.floor((Math.random()*600) + 1);
        
        if(rand > 0 && rand <= 50)
        {
            EnemyGroup.create(randX, randY, 'Enemy');
            game.physics.arcade.enable(EnemyGroup);

            randX = Math.floor((Math.random()*EnemySpeed) + 1);
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            randX = randX*plusOrMinus;
       
            randY = Math.floor((Math.random()*EnemySpeed) + 1);
            plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            randY = randY*plusOrMinus;

            var Enemy = EnemyGroup.getTop();
            Enemy.body.velocity.x = randX;
            Enemy.body.velocity.y = randY;
        }
        else if(rand > 50 && rand <= 80)
        {
            Enemy2Group.create(randX, randY, 'Enemy2');
            game.physics.arcade.enable(Enemy2Group);
            game.physics.arcade.moveToObject(Enemy2Group.getTop(), Player, 250);
        }
        else if(!E3HasSpawned)
        {
            E3HasSpawned = true;
            Enemy3Group.create(randX, randY, 'Enemy3');
            game.physics.arcade.enable(Enemy3Group);
            Enemy3Timer = game.time.events.loop(200, Enemy3, this);
        }

        EnemySpeed++;
    }

    function SpawnItem()
    {
        speedBoost = 0;
        EnemySpeed = 200;

        Freeze = 0;
        Bomb = 0;
        Speed = 0;
        var rand = Math.floor((Math.random()*3 + 1));
        var randX = Math.floor((Math.random()*800) + 1);
        var randY = Math.floor((Math.random()*600) + 1);

        if(rand == 1)
        {
            Freeze = game.add.sprite( randX, randY, 'Freeze' );
            Freeze.enableBody = true;
            Freeze.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.enable( Freeze, Phaser.Physics.ARCADE );
        }
        else if(rand == 2)
        {
            Bomb = game.add.sprite( randX, randY, 'Bomb' );
            Bomb.enableBody = true;
            Bomb.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.enable( Bomb, Phaser.Physics.ARCADE );
        }
        else if(rand == 3)
        {
            Speed = game.add.sprite( randX, randY, 'Speed' );
            Speed.enableBody = true;
            Speed.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.enable( Speed, Phaser.Physics.ARCADE );
        }

        itemKillTimer = game.time.events.loop(7000, killItems, this);
       
    }

    function freeze()
    {
        Freeze.destroy();
        game.time.events.remove(SpawnTimer);
        tempTimer = game.time.events.loop(5000, unfreeze, this);
    }

    function bomb()
    {
        EnemyGroup.removeAll(true);
        Enemy2Group.removeAll(true);
        Enemy3Group.removeAll(true);
        Bomb.destroy();
    }

    function speed()
    {
        speedBoost = 200;
        Speed.destroy();
    }

    function killItems()
    {
        game.time.events.remove(itemKillTimer);
        if(Freeze != 0)
        {
            Freeze.destroy();
        }

        if(Bomb != 0)
        {
            Bomb.destroy();
        }
        
        if(Speed != 0)
        {
            Speed.destroy();
        }
        
    }

    function unfreeze()
    {
        game.time.events.remove(tempTimer);
        SpawnTimer = game.time.events.loop(1000, SpawnEnemy, this);
    }
    
    function killEnemy2()
    {
        var temp = Enemy2Group.getBottom();
        temp.destroy();
    }

    function Enemy3()
    {
        var temp = Enemy3Group.getTop();
        temp.anchor.setTo( 0.5, 0.5 );
        if(scaleCheck >= 20 && scaleCheck < 40)
        {
            temp.scale.x = temp.scale.x + 1;
            temp.scale.y = temp.scale.y + 1;
        }
        else if(scaleCheck > 50)
        {
            temp.destroy();
            scaleCheck = -1;
            E3HasSpawned = false;
            game.time.events.remove(Enemy3Timer);
        }

        scaleCheck++
    } 

    function Reset()
    {
        EnemyGroup.removeAll(true);
        Enemy2Group.removeAll(true);
        Enemy3Group.removeAll(true);
        Player.destroy();
        EnemySpeed = 200;
        create();

    }
};
