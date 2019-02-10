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
        game.load.image( 'Cursor_01', 'assets/Cursor_01.png' );
    }
    
    var Cursor_01;
    var keys;
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        Cursor_01 = game.add.sprite( game.world.centerX, game.world.centerY, 'Cursor_01' );
        
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        Cursor_01.anchor.setTo( 0.5, 0.5 );

        game.physics.arcade.enable(Cursor_01);

        Cursor_01.body.collideWorldBounds = true;

        keys = game.input.keyboard.createCursorKeys();
    }
    
    function update() {
    
        player1Move();
        playerRotation();
        
    }
    
    function toDegrees (angle) 
    {
        return angle * (180 / Math.PI);
    }
    
    function playerRotation()
    {
        var angle = toDegrees(Math.atan(Cursor_01.body.velocity.y/Cursor_01.body.velocity.x));
        console.log("Angle = "+angle);
        //Check which quadrant cursor is in
        if(Cursor_01.body.velocity.x > 0 && Cursor_01.body.velocity.y < 0)
        {
            Cursor_01.angle = angle;
        }
        else if(Cursor_01.body.velocity.x < 0 && Cursor_01.body.velocity.y < 0)
        {
            Cursor_01.angle = angle*-1;
        }
        else if(Cursor_01.body.velocity.x < 0 && Cursor_01.body.velocity.y > 0)
        {
            Cursor_01.angle = -90 - angle;
        }
        else if(Cursor_01.body.velocity.x > 0 && Cursor_01.body.velocity.y > 0)
        {
            Cursor_01.angle = 90 + angle;
        }
    }

    //Set players velocity based on keyboard input
    function player1Move()
    {
        
        if (keys.left.isDown)
        {
            if(Cursor_01.body.velocity.x > 0)
            {
             Cursor_01.body.velocity.x -= 12;
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
             Cursor_01.body.velocity.x += 12;
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
             Cursor_01.body.velocity.y += 12;
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
             Cursor_01.body.velocity.y -= 12;
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
};
