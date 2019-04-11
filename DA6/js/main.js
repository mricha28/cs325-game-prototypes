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
    }
    
    var bouncy;
    var EnemyGroup;
    var SpawnTimer = 0;
    var keys;
    var Player;
    var EnemySpeed = 200;
    
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

        EnemyGroup = game.add.group();
        EnemyGroup.enableBody = true;
        EnemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        EnemyGroup.createMultiple(100, 'Enemy');
        EnemyGroup.setAll('checkWorldBounds', true);
        EnemyGroup.setAll('outOfBoundsKill', true);

        if(SpawnTimer == 0)
        {
            SpawnTimer = game.time.events.loop(1000, SpawnEnemy, this);
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
        
    }

    function playerMove(){
        if (keys.left.isDown)
        {
           Player.body.velocity.x = -200;
        }
        
        if(keys.right.isDown)
        {
            Player.body.velocity.x = 200;
        } 

        if(keys.down.isDown)
        {
            Player.body.velocity.y = 200;
        }
    
        if(keys.up.isDown)
        {
            Player.body.velocity.y = -200;
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

        var randX = Math.floor((Math.random()*800) + 1);
        var randY = Math.floor((Math.random()*600) + 1);
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

        EnemySpeed++;
        
        

    }

    function Reset()
    {
        EnemyGroup.removeAll(true);
        Player.destroy();
        EnemySpeed = 200;
        create();

    }
};
