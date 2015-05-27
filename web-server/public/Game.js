
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.uid;		//  user id
    this.otherPlayers; // Other players
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    this.speed = 100;


    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {
	newPlayer: function(x, y) {
		res = this.game.add.sprite(x, y, 'panda');
        res.anchor.setTo(0.5, 0.5);
        res.animations.add('down', [0, 1, 2, 3], 4, true);
        res.animations.add('left', [4, 5, 6, 7], 4, true);
        res.animations.add('right', [8, 9, 10, 11], 4, true);
        res.animations.add('up', [12, 13, 14, 15], 4, true);

        this.game.physics.arcade.enable(res);
        return res
	},

    create: function () {
    	var self = this;
    	connect(function(uid) {
    		console.log(uid);
    		self.uid = uid;

    		// Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
	        // Initial states
	        self.game.stage.backgroundColor = '#3498db';
	        self.game.physics.startSystem(Phaser.Physics.ARCADE);
	        self.stage.backgroundColor = '#787878';

	        // Map
	        self.map = self.add.tilemap('map');

	        // The first parameter is the tileset name as specified in Tiled, the second is the key to the asset.
	        self.map.addTilesetImage('map10', 'tiles');

	        // Create layer
	        self.blockedLayer = self.map.createLayer('Tile Layer 1');
	        self.map.setCollision(8, true, self.blockedLayer);

	        // Berries
	        self.berries = self.game.add.group();

	        // Obstacles
	        self.obstacles = self.game.add.group();
	        self.obstacles.enableBody = true;
	        self.map.createFromObjects('Object Layer 1', 9, 'obstacle01', 0, true, false, self.obstacles);
	        self.obstacles.callAll('animations.add', 'animations', 'explode', [0, 1, 2, 3, 4, 5], 6, true);
	        self.obstacles.setAll('body.immovable', true);

	        // Kill obstacle after the animation is finished
	        self.obstacles.forEach(function(obstacle) {
	            obstacle.events.onAnimationComplete.add(function(){
	                obstacle.kill();
	            }, this);
	        }, this);


	        // Player
	        self.player = self.newPlayer(46, 26);

	        // This adjusts the collision body size.
	        self.player.body.setSize(10, 10, 0, 20);

	        // Emitter
	        self.emitter = self.game.add.emitter(0, 0);
	        self.emitter.gravity = 0;
	        self.emitter.minRotation = 0;
	        self.emitter.maxRotation = 0;
	        self.emitter.bounce.setTo(0.5, 0.5);
	        self.emitter.setXSpeed(-100, 100);
	        self.emitter.setYSpeed(-100, 100);

	        /**
	        // Keyboard
	        upKey = self.game.input.keyboard.addKey(Phaser.Keyboard.UP);
	        upKey.onDown.add(function() {
	            self.player.loadTexture('panda_up', 0);
	            self.player.animations.add('walk');
	            self.player.animations.play('walk', 10, true);

	            self.player.body.velocity.y = 0;
	            self.player.body.velocity.y -= self.speed;
	        }, this);

	        downKey = self.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	        downKey.onDown.add(function() {
	            self.player.loadTexture('panda_down', 0);
	            self.player.animations.add('walk');
	            self.player.animations.play('walk', 10, true);

	            self.player.body.velocity.y = 0;
	            self.player.body.velocity.y += self.speed;
	        }, this);

	        leftKey = self.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	        leftKey.onDown.add(function() {
	            self.player.loadTexture('panda_left', 0);
	            self.player.animations.add('walk');
	            self.player.animations.play('walk', 10, true);

	            self.player.body.velocity.x = 0;
	            self.player.body.velocity.x -= self.speed;
	        }, this);

	        rightKey = self.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	        rightKey.onDown.add(function() {
	            self.player.loadTexture('panda_right', 0);
	            self.player.animations.add('walk');
	            self.player.animations.play('walk', 10, true);

	            self.player.body.velocity.x = 0;
	            self.player.body.velocity.x += self.speed;
	        }, this);
	        **/

	        self.cursors = self.game.input.keyboard.createCursorKeys();
	        self.hitButton = self.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	});
    },

    update: function () {
    	var self = this;

        // Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.game.physics.arcade.collide(this.emitter, this.blockedLayer);
        this.game.physics.arcade.overlap(this.emitter, this.obstacles, this.collisionHandler, null, this);

        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.player, this.obstacles);


        // console.log(this.player.x , this.player.y);

        // Reset the players velocity (Movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursors.left.isDown) {
            // Move to the left
            this.player.animations.play('left', 10, true);
            this.player.body.velocity.x = -this.speed;
        }
        else if (this.cursors.right.isDown) {
            // Move to the right
            this.player.animations.play('right', 10, true);
            this.player.body.velocity.x = this.speed;
        }
        else if (this.cursors.up.isDown) {
            // Move to the up
            this.player.animations.play('up', 10, true);
            this.player.body.velocity.y = -this.speed;
        }
        else if (this.cursors.down.isDown) {
            // Move to the down
            //this.player.loadTexture('panda_down', 0);
            this.player.animations.play('down', 10, true);
            this.player.body.velocity.y = this.speed;
        }
        else if (this.hitButton.isDown) {
            // Release a berry
            this.releaseBerry()
        } else
        {
            // Stand still
            this.player.animations.stop();
            // this.player.frame = 4;
        }

        console.log(this.uid, this.player.x, this.player.y);
        update(this.uid, this.player.x, this.player.y, function(list) {
        	for (player in list) {
        		if (!self.otherPlayers[player.uid]) {
        			self.otherPlayers[player.uid] = self.newPlayer(player.x, player.y);
        		} else {
        			self.otherPlayers[player.uid].anchor.setTo(player.x, player.y);
        		}
        	}
        })

    },

    releaseBerry: function() {
        var x = this.player.x;
        var y = this.player.y;

        var berry = this.berries.create(x - 16, y, 'berry');
        var childIndex = this.berries.getChildIndex(berry);
        // Basic Timed Event
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.explosion, this, x, y + 16, berry);
    },

    explosion: function(x, y, berry) {
        this.berries.remove(berry);

        this.emitter.x = x;
        this.emitter.y = y;

        this.emitter.makeParticles('p_berry', 1, 10, true, true);
        this.emitter.explode(500, 1);
    },

    collisionHandler: function(berry, obstacle) {
        berry.kill();
        obstacle.animations.play('explode', 6, false, true);
        obstacle.alive = false;
    },

    quitGame: function (pointer) {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
    },

    render: function() {
        // this.game.debug.body(this.player);
    }
};
