// Constants
// Codes for the controles of the game
// Prevents the use of these numbers elsewhere
var ENTER_CODE = 13;
var UP_ARROW_CODE = 38;
var DOWN_ARROW_CODE = 40;
var LEFT_ARROW_CODE = 37;
var RIGHT_ARROW_CODE = 39;
var SPACE_BAR_CODE = 32;
var MOVE_UP = 'up';
var MOVE_DOWN = 'down';
var MOVE_LEFT = 'left';
var MOVE_RIGHT = 'right';
var FIRE = 'fire';
// General dimensions
var GAME_WIDTH = 4500;
var GAME_HEIGHT = 2900;
var ENTITY_DIMENSIONS = 100;
//var LEVEL = 1;
var PLAYER_STARTING_POSITION_X = (GAME_WIDTH - ENTITY_DIMENSIONS) / 2;
var PLAYER_STARTING_POSITION_Y = (GAME_HEIGHT - ENTITY_DIMENSIONS) / 2;
// Boss stats
var BOSS_HP = 20;
var BOSS_HP_UPDATE = 20;
var NUMBER_TIMES_BOSS_DIED = 0;
// Basic enemy stats, multiplied by four
var MAX_ALIENS = 5;
var MAX_ALIENS_UPDATE = 5;
var NUMBER_WAVES_ALIENS_KILLED = 0;
var NUMBER_ALIENS_IN_WAVE = 5;
// Asteroid stats, multiplied by four
// TOP - BOTTOM have a max of 45 spots
// LEFT - RIGHT have a max of 29 spots
var MAX_ASTEROIDS_TOP_BOTTOM = 30;
var MAX_ASTEROIDS_LEFT_RIGHT = 15;
// Beam constants
var MAX_BEAMS = 2;
//var BEAM_SOUND = new sound("Pew_Pew.mp3");
var counter = 1;

// Preload game images
var backgroundImages = {};
['background level 1.jpg', 'background level 2.jpg', 'background level 3.jpg', 'background level 4.jpg', 'background level 5.jpg', 'game start.jpg', 'next level 2.jpg', 'next level 3.jpg', 'next level 4.jpg', 'next level 5.jpg', 'GAME OVER 1.jpg', 'GAME OVER 2.jpg', 'game won.jpg'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/background images/' + imgName;
    backgroundImages[imgName] = img;
});

var playerImages = {};
['player fly up.png', 'player fly down.png', 'player fly left.png', 'player fly right.png', 'player dead.png', 'player shooting up.png', 'player shooting down.png', 'player shooting left.png', 'player shooting right.png', 'shooting beams up.png', 'shooting beams down.png', 'shooting beams left.png', 'shooting beams right.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/player images/' + imgName;
    playerImages[imgName] = img;
});

var enemyImages = {};
['alien 1.png', 'alien 2.png', 'alien 3.png', 'alien 4.png', 'alien 5.png', 'alien 6.png', 'alien 7.png', 'alien 8.png', 'alien 9.png', 'alien 10.png', 'alien 11.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/enemy images/' + imgName;
    enemyImages[imgName] = img;

});

var bossImages = {};
['Sinistar Boss 1.png', 'Sinistar Boss 2.png', 'Boss Dead.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/boss images/' + imgName;
    bossImages[imgName] = img;
});

var asteroidImages = {};
['asteroid 1.png', 'asteroid 2.png', 'asteroid 3.png', 'asteroid 4.png', 'asteroid 5.png', 'asteroid 6.png', 'asteroid 7.png', 'asteroid 8.png', 'asteroid 9.png', 'asteroid 10.png', 'asteroid 11.png', 'asteroid dead.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/asteroid images/' + imgName;
    asteroidImages[imgName] = img;
});

// Allows each enemy and asteroid to be given a random image upon creation
function randomAlien() {
    var int = Math.round(Math.random() * 10);
    switch (int) {
        case 0: return 'alien 1.png';
        case 1: return 'alien 2.png';
        case 2: return 'alien 3.png';
        case 3: return 'alien 4.png';
        case 4: return 'alien 5.png';
        case 5: return 'alien 6.png';
        case 6: return 'alien 7.png';
        case 7: return 'alien 8.png';
        case 8: return 'alien 9.png';
        case 9: return 'alien 10.png';
        case 10: return 'alien 11.png';
    }
}
function randomAsteroid() {
    var int = Math.round(Math.random() * 10);
    switch (int) {
        case 0: return 'asteroid 1.png'
        case 1: return 'asteroid 2.png';
        case 2: return 'asteroid 3.png';
        case 3: return 'asteroid 4.png';
        case 4: return 'asteroid 5.png';
        case 5: return 'asteroid 6.png';
        case 6: return 'asteroid 7.png';
        case 7: return 'asteroid 8.png';
        case 8: return 'asteroid 9.png';
        case 9: return 'asteroid 10.png';
        case 10: return 'asteroid 11.png';
    }
}
// Allows to create the beam only when the spacebar is pushed
// It must be put outside of the main loop or else it would cause 'undefined' errors
function setUpBeam(currentDir, xPlayerPos, yPlayerPos) {
    if (!this.beamExist) { this.beamExist = []; }
    switch (currentDir) {
        case 1:
            this.beamDir = this.beamExist.push(xPlayerPos);
        case 2:
            this.beamDir = this.beamExist.push(xPlayerPos);
        case 3:
            this.beamDir = this.beamExist.push(yPlayerPos);
        case 4:
            this.beamDir = this.beamExist.push(yPlayerPos);
    }
    this.beamDir = new Beam(currentDir, xPlayerPos, yPlayerPos);
}
// Allows every entity to be rendered with every game loop
class Render {
    render(ctx) { ctx.drawImage(this.sprite, this.x, this.y); }
}
// Gives the Boss it's spawn location, speed, and positional update
// Maybe lets it have an alernating image
class Boss {
    constructor() {
        this.x = (Math.round(Math.random())) * GAME_WIDTH;
        this.y = (Math.round(Math.random())) * GAME_HEIGHT;
    }
    update(xPlayerPos, yPlayerPos) {
        if (this.y === yPlayerPos) { this.y = this.y; }
        else if (this.y > yPlayerPos) { this.y -= 5; }
        else if (this.y < yPlayerPos) { this.y += 5; }
        if (this.x === xPlayerPos) { this.x = this.x; }
        else if (this.x > xPlayerPos) { this.x -= 5; }
        else if (this.x < xPlayerPos) { this.x += 5; }
    }
    render(ctx, counter) {
        if (counter < 25) { ctx.drawImage(bossImages['Sinistar Boss 1.png'], this.x - 200, this.y - 200); /*++counter;*/ }
        if (25 <= counter ) { ctx.drawImage(bossImages['Sinistar Boss 2.png'], this.x - 200, this.y - 200); /*++counter;*/ }
        //if (counter < 202) { ctx.drawImage(bossImages['Boss Dead.png'], this.x - 200, this.y - 200); /*++counter;*/ }
    }
}

class TopAlien extends Render {
    constructor(alienPos) {
        super();
        this.x = alienPos;
        this.y = 0 - ENTITY_DIMENSIONS;
        this.sprite = enemyImages[randomAlien()];
    }
    update(xPlayerPos, yPlayerPos) {
        if (this.y === yPlayerPos) { this.y = this.y; }
        else if (this.y > yPlayerPos) { this.y -= 3; }
        else if (this.y < yPlayerPos) { this.y += 3; }
        if (this.x === xPlayerPos) { this.x = this.x; }
        else if (this.x > xPlayerPos) { this.x -= 3; }
        else if (this.x < xPlayerPos) { this.x += 3; }
    }
}
class BottomAlien extends Render {
    constructor(alienPos) {
        super();
        this.x = alienPos;
        this.y = GAME_HEIGHT + ENTITY_DIMENSIONS;
        this.sprite = enemyImages[randomAlien()];
    }
    update(xPlayerPos, yPlayerPos) {
        if (this.y === yPlayerPos) { this.y = this.y; }
        else if (this.y > yPlayerPos) { this.y -= 3; }
        else if (this.y < yPlayerPos) { this.y += 3; }
        if (this.x === xPlayerPos) { this.x = this.x; }
        else if (this.x > xPlayerPos) { this.x -= 3; }
        else if (this.x < xPlayerPos) { this.x += 3; }
    }
}
class LeftAlien extends Render {
    constructor(alienPos) {
        super();
        this.x = 0 - ENTITY_DIMENSIONS;
        this.y = alienPos;
        this.sprite = enemyImages[randomAlien()];
    }
    update(xPlayerPos, yPlayerPos) {
        if (this.y === yPlayerPos) { this.y = this.y; }
        else if (this.y > yPlayerPos) { this.y -= 3; }
        else if (this.y < yPlayerPos) { this.y += 3; }
        if (this.x === xPlayerPos) { this.x = this.x; }
        else if (this.x > xPlayerPos) { this.x -= 3; }
        else if (this.x < xPlayerPos) { this.x += 3; }
    }
}
class RightAlien extends Render {
    constructor(alienPos) {
        super();
        this.x = GAME_WIDTH + ENTITY_DIMENSIONS;
        this.y = alienPos;
        this.sprite = enemyImages[randomAlien()];
    }
    update(xPlayerPos, yPlayerPos) {
        if (this.y === yPlayerPos) { this.y = this.y; }
        else if (this.y > yPlayerPos) { this.y -= 3; }
        else if (this.y < yPlayerPos) { this.y += 3; }
        if (this.x === xPlayerPos) { this.x = this.x; }
        else if (this.x > xPlayerPos) { this.x -= 3; }
        else if (this.x < xPlayerPos) { this.x += 3; }
    }
}
class TopAsteroid extends Render {
    constructor(xTopPos) {
        super();
        this.x = xTopPos;
        this.y = 0;
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = (Math.random() / 1.5);
    }
    update(timeDiff) {
        this.y = this.y + (timeDiff * this.speed);
    }
}

class BottomAsteroid extends Render {
    constructor(xBottomPos) {
        super();
        this.x = xBottomPos;
        this.y = GAME_HEIGHT - ENTITY_DIMENSIONS;
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = (Math.random() / 1.5);
    }
    update(timeDiff) {
        this.y = this.y - (timeDiff * this.speed);
    }
}

class LeftAsteroid extends Render {
    constructor(xLeftPos) {
        super();
        this.y = xLeftPos;
        this.x = 0;
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = (Math.random() / 1.5);
    }
    update(timeDiff) {
        this.x = this.x + (timeDiff * this.speed);
    }
}

class RightAsteroid extends Render {
    constructor(xRightPos) {
        super();
        this.y = xRightPos;
        this.x = GAME_WIDTH - ENTITY_DIMENSIONS;
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = (Math.random() / 1.5);
    }
    update(timeDiff) {
        this.x = this.x - (timeDiff * this.speed);
    }
}

class Player extends Render {
    constructor() {
        super();
        this.x = PLAYER_STARTING_POSITION_X;
        this.y = PLAYER_STARTING_POSITION_Y;
        this.sprite = playerImages['player fly up.png'];
    }
    // This method is called by the game engine when up/down/left/right arrows are pressed
    move(direction) {
        if (direction === MOVE_UP && this.y > 0) {
            this.arrowPressed = 1;
            this.sprite = playerImages['player fly up.png'];
            this.y = this.y - ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - ENTITY_DIMENSIONS) {
            this.arrowPressed = 2;
            this.sprite = playerImages['player fly down.png'];
            this.y = this.y + ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_LEFT && this.x > 0) {
            this.arrowPressed = 3;
            this.sprite = playerImages['player fly left.png'];
            this.x = this.x - ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - ENTITY_DIMENSIONS) {
            this.arrowPressed = 4;
            this.sprite = playerImages['player fly right.png'];
            this.x = this.x + ENTITY_DIMENSIONS;
        }
    }
}

class Beam extends Render {
    constructor(currentDir, xPlayerPos, yPlayerPos) {
        super();
        this.speed = 5/* * LEVEL*/;
        switch (currentDir) {
            case 1:
                this.currentDir = currentDir;
                this.x = xPlayerPos;
                this.y = yPlayerPos;
                this.sprite = playerImages['shooting beams up.png'];
                break;
            case 2:
                this.currentDir = currentDir;
                this.x = xPlayerPos;
                this.y = yPlayerPos + ENTITY_DIMENSIONS;
                this.sprite = playerImages['shooting beams down.png'];
                break;
            case 3:
                this.currentDir = currentDir;
                this.x = xPlayerPos;
                this.y = yPlayerPos;
                this.sprite = playerImages['shooting beams left.png'];
                break;
            case 4:
                this.currentDir = currentDir;
                this.x = xPlayerPos + ENTITY_DIMENSIONS;
                this.y = yPlayerPos;
                this.sprite = playerImages['shooting beams right.png'];
                break;
        }
    }

    update(timeDiff) {
        switch (this.currentDir) {
            case 1: return this.y = this.y - (timeDiff * this.speed);
            case 2: return this.y = this.y + (timeDiff * this.speed);
            case 3: return this.x = this.x - (timeDiff * this.speed);
            case 4: return this.x = this.x + (timeDiff * this.speed);
        }
    }
}

/*
This section is a tiny game engine.
This engine will use your Asteroid and Player classes to create the behavior of the game.
The engine will try to draw your game at 60 frames per second using the requestAnimationFrame function
*/
class Engine {
    constructor(element) {
        // Setup the player
        this.player = new Player();


        this.setUpBoss();

        this.setupTopAliens();
        this.setupBottomAliens();
        this.setupLeftAliens();
        this.setupRightAliens();

        // Setup asteroids
        this.setupTopAsteroids();
        this.setupBottomAsteroids();
        this.setupLeftAsteroids();
        this.setupRightAsteroids();

        // Setup the <canvas> element where we will be drawing
        var canvas = document.createElement('canvas');
        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;
        element.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
        // Since gameLoop will be called out of context, bind it once here.
        this.gameLoop = this.gameLoop.bind(this);
    }

    setUpBoss() {
        if (!this.boss) {
            this.boss = [];
            this.boss[0] = new Boss();
        }
    }

    setupTopAliens() {
        if (!this.topAliens) {
            this.topAliens = [];
        }
        while (this.topAliens.filter(e => !!e).length < MAX_ALIENS/* * LEVEL*/) {
            this.addTopAlien();
        }
    }
    addTopAlien() {
        var topAlienSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var topAlienSpot;

        while (!topAlienSpot || this.topAliens[topAlienSpot]) {
            topAlienSpot = Math.floor(Math.random() * topAlienSpots);
        }
        this.topAliens[topAlienSpot] = new TopAlien((topAlienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupBottomAliens() {
        if (!this.bottomAliens) {
            this.bottomAliens = [];
        }
        while (this.bottomAliens.filter(e => !!e).length < MAX_ALIENS/* * LEVEL*/) {
            this.addBottomAlien();
        }
    }
    addBottomAlien() {
        var bottomAlienSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var bottomAlienSpot;

        while (!bottomAlienSpot || this.bottomAliens[bottomAlienSpot]) {
            bottomAlienSpot = Math.floor(Math.random() * bottomAlienSpots);
        }
        this.bottomAliens[bottomAlienSpot] = new BottomAlien((bottomAlienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupLeftAliens() {
        if (!this.leftAliens) {
            this.leftAliens = [];
        }
        while (this.leftAliens.filter(e => !!e).length < MAX_ALIENS/* * LEVEL*/) {
            this.addLeftAlien();
        }
    }
    addLeftAlien() {
        var leftAlienSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var leftAlienSpot;

        while (!leftAlienSpot || this.leftAliens[leftAlienSpot]) {
            leftAlienSpot = Math.floor(Math.random() * leftAlienSpots);
        }
        this.leftAliens[leftAlienSpot] = new LeftAlien((leftAlienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupRightAliens() {
        if (!this.rightAliens) {
            this.rightAliens = [];
        }
        while (this.rightAliens.filter(e => !!e).length < MAX_ALIENS/* * LEVEL*/) {
            this.addRightAlien();
        }
    }
    addRightAlien() {
        var rightAlienSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var rightAlienSpot;

        while (!rightAlienSpot || this.rightAliens[rightAlienSpot]) {
            rightAlienSpot = Math.floor(Math.random() * rightAlienSpots);
        }
        this.rightAliens[rightAlienSpot] = new RightAlien((rightAlienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }

    setupTopAsteroids() {
        if (!this.topAsteroids) {
            this.topAsteroids = [];
        }

        while (this.topAsteroids.filter(e => !!e).length < (/*(*/MAX_ASTEROIDS_TOP_BOTTOM/* * LEVEL) - 5*/)) {
            this.addTopAsteroid();
        }
    }
    addTopAsteroid() {
        var topAsteroidSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var topAsteroidSpot;
        while (!topAsteroidSpot || this.topAsteroids[topAsteroidSpot]) {
            topAsteroidSpot = Math.floor(Math.random() * topAsteroidSpots);
        }

        this.topAsteroids[topAsteroidSpot] = new TopAsteroid((topAsteroidSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupBottomAsteroids() {
        if (!this.bottomAsteroids) {
            this.bottomAsteroids = [];
        }

        while (this.bottomAsteroids.filter(e => !!e).length < (/*(*/MAX_ASTEROIDS_TOP_BOTTOM /** LEVEL) - 5*/)) {
            this.addBottomAsteroid();
        }
    }
    addBottomAsteroid() {
        var bottomAsteroidSpots = (GAME_WIDTH / ENTITY_DIMENSIONS) + 1;
        var bottomAsteroidSpot;
        while (!bottomAsteroidSpot || this.bottomAsteroids[bottomAsteroidSpot]) {
            bottomAsteroidSpot = Math.floor(Math.random() * bottomAsteroidSpots);
        }

        this.bottomAsteroids[bottomAsteroidSpot] = new BottomAsteroid((bottomAsteroidSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupLeftAsteroids() {
        if (!this.leftAsteroids) {
            this.leftAsteroids = [];
        }

        while (this.leftAsteroids.filter(e => !!e).length < (/*(*/MAX_ASTEROIDS_LEFT_RIGHT/* * LEVEL) - 5*/)) {
            this.addLeftAsteroid();
        }
    }
    addLeftAsteroid() {
        var leftAsteroidSpots = (GAME_HEIGHT / ENTITY_DIMENSIONS) + 1;
        var leftAsteroidSpot;
        while (!leftAsteroidSpot || this.leftAsteroids[leftAsteroidSpot]) {
            leftAsteroidSpot = Math.floor(Math.random() * leftAsteroidSpots);
        }

        this.leftAsteroids[leftAsteroidSpot] = new LeftAsteroid((leftAsteroidSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }
    setupRightAsteroids() {
        if (!this.rightAsteroids) {
            this.rightAsteroids = [];
        }

        while (this.rightAsteroids.filter(e => !!e).length < (/*(*/MAX_ASTEROIDS_LEFT_RIGHT/* * LEVEL) - 5*/)) {
            this.addRightAsteroid();
        }
    }
    addRightAsteroid() {
        var rightAsteroidSpots = (GAME_HEIGHT / ENTITY_DIMENSIONS) + 1;
        var rightAsteroidSpot;
        while (!rightAsteroidSpot || this.rightAsteroids[rightAsteroidSpot]) {
            rightAsteroidSpot = Math.floor(Math.random() * rightAsteroidSpots);
        }

        this.rightAsteroids[rightAsteroidSpot] = new RightAsteroid((rightAsteroidSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS);
    }

    // This method kicks off the game
    start() {
        this.numberOfSinistars =
            this.lastFrame = Date.now();
        if (!this.player.arrowPressed) { this.player.arrowPressed = 1 }
        // Listen for keyboard up/down/left/right/spacebar and update the player
        document.addEventListener('keydown', e => {
            if (e.keyCode === UP_ARROW_CODE) {
                this.player.move(MOVE_UP);
            }
            else if (e.keyCode === DOWN_ARROW_CODE) {
                this.player.move(MOVE_DOWN);
            }
            else if (e.keyCode === LEFT_ARROW_CODE) {
                this.player.move(MOVE_LEFT);
            }
            else if (e.keyCode === RIGHT_ARROW_CODE) {
                this.player.move(MOVE_RIGHT);
            }
            else if (e.keyCode === SPACE_BAR_CODE) {
                if (!this.beamDir) {
                    this.beamExist = [];

                    switch (this.player.arrowPressed) {
                        case 1:
                            this.player.sprite = playerImages['player shooting up.png'];
                            this.beamDir = this.beamExist.push(this.player.x);
                            return this.beamDir = new Beam(this.player.arrowPressed, this.player.x, this.player.y);
                        case 2:
                            this.player.sprite = playerImages['player shooting down.png'];
                            this.beamDir = this.beamExist.push(this.player.x);
                            return this.beamDir = new Beam(this.player.arrowPressed, this.player.x, this.player.y);
                        case 3:
                            this.player.sprite = playerImages['player shooting left.png'];
                            this.beamDir = this.beamExist.push(this.player.y);
                            return this.beamDir = new Beam(this.player.arrowPressed, this.player.x, this.player.y);
                        case 4:
                            this.player.sprite = playerImages['player shooting right.png'];
                            this.beamDir = this.beamExist.push(this.player.y);
                            return this.beamDir = new Beam(this.player.arrowPressed, this.player.x, this.player.y);
                    }
                }
            }
            else if (e.keyCode === ENTER_CODE) {
                location.reload();
            }
        });
        this.gameLoop();
    }

    gameLoop() {
        counter += 1;
        if(counter === 50) {
            counter = 0;
        }
        // Check how long it's been since last frame
        var currentFrame = Date.now();
        var timeDiff = currentFrame - this.lastFrame;
        this.ctx.drawImage(backgroundImages['background level 5.jpg'], 0, 0);
        /*
                if (LEVEL === 1) {
                    this.ctx.drawImage(images['background level 1.jpg'], 0, 0);
                }
                if (LEVEL === 2) {
                    this.ctx.drawImage(images['background level 2.jpg'], 0, 0);
                    this.setUpBoss();
                    this.boss.forEach(e => e.update(this.player.x, this.player.y));
                    this.boss.forEach(e => e.render(this.ctx, counter));
                }
        
                if (LEVEL === 3) {
                    this.ctx.drawImage(images['background level 3.jpg'], 0, 0);
                }
        
                if (LEVEL === 4) {
                    this.ctx.drawImage(images['background level 4.jpg'], 0, 0);
                    this.setUpBoss();
                    this.boss.forEach(e => e.update(this.player.x, this.player.y));
                    this.boss.forEach(e => e.render(this.ctx, counter));
                }
        
                if (LEVEL === 5) {
                    this.ctx.drawImage(images['background level 5.jpg'], 0, 0);
                    this.setUpBoss();
                    this.boss.forEach(e => e.update(this.player.x, this.player.y));
                    this.boss.forEach(e => e.render(this.ctx, counter));
                }
        */
        if (this.beamDir) {
            this.beamDir.update(timeDiff);
            this.beamDir.render(this.ctx);
        }


        this.topAliens.forEach(topAlien => topAlien.update(this.player.x, this.player.y));
        this.bottomAliens.forEach(bottomAlien => bottomAlien.update(this.player.x, this.player.y));
        this.leftAliens.forEach(leftAlien => leftAlien.update(this.player.x, this.player.y));
        this.rightAliens.forEach(rightAlien => rightAlien.update(this.player.x, this.player.y));

        this.topAliens.forEach(topAlien => topAlien.render(this.ctx));
        this.bottomAliens.forEach(bottomAlien => bottomAlien.render(this.ctx));
        this.leftAliens.forEach(leftAlien => leftAlien.render(this.ctx));
        this.rightAliens.forEach(rightAlien => rightAlien.render(this.ctx));

        this.topAsteroids.forEach(topAsteroid => topAsteroid.update(timeDiff));
        this.bottomAsteroids.forEach(bottomAsteroid => bottomAsteroid.update(timeDiff));
        this.leftAsteroids.forEach(leftAsteroid => leftAsteroid.update(timeDiff));
        this.rightAsteroids.forEach(rightAsteroid => rightAsteroid.update(timeDiff));

        this.topAsteroids.forEach(topAsteroid => topAsteroid.render(this.ctx));
        this.bottomAsteroids.forEach(bottomAsteroid => bottomAsteroid.render(this.ctx))
        this.leftAsteroids.forEach(leftAsteroid => leftAsteroid.render(this.ctx));
        this.rightAsteroids.forEach(rightAsteroid => rightAsteroid.render(this.ctx));


        this.player.render(this.ctx);

        this.boss.forEach(e => e.update(this.player.x, this.player.y));
        this.boss.forEach(e => e.render(this.ctx, counter));


        this.topAsteroids.forEach((topAsteroid, topAsteroidIdx) => {
            if (topAsteroid.y > GAME_HEIGHT) {
                delete this.topAsteroids[topAsteroidIdx];
            }
        });
        this.setupTopAsteroids();
        this.bottomAsteroids.forEach((bottomAsteroid, bottomAsteroidIdx) => {
            if (bottomAsteroid.y < - ENTITY_DIMENSIONS) {
                delete this.bottomAsteroids[bottomAsteroidIdx];
            }
        });
        this.setupBottomAsteroids();
        this.leftAsteroids.forEach((leftAsteroid, leftAsteroidIdx) => {
            if (leftAsteroid.x > GAME_WIDTH) {
                delete this.leftAsteroids[leftAsteroidIdx];
            }
        });
        this.setupLeftAsteroids();
        this.rightAsteroids.forEach((rightAsteroid, rightAsteroidIdx) => {
            if (rightAsteroid.x < - ENTITY_DIMENSIONS) {
                delete this.rightAsteroids[rightAsteroidIdx];
            }
        });
        this.setupRightAsteroids();



        if (this.beamDir) {
            var connect = false;
            if (this.beamDir.x < 0 - ENTITY_DIMENSIONS) { connect = true; }
            if (this.beamDir.x > GAME_WIDTH) { connect = true; }
            if (this.beamDir.y < 0 - ENTITY_DIMENSIONS) { connect = true; }
            if (this.beamDir.y > GAME_HEIGHT) { connect = true; }

            //if ((LEVEL === 2) || (LEVEL > 3)) {
            this.boss.forEach((boss) => {
                if (boss.x + 200 >= this.beamDir.x) {
                    if (boss.x <= this.beamDir.x + 200) {
                        if (boss.y + 200 >= this.beamDir.y) {
                            if (boss.y <= this.beamDir.y + 200) {
                                connect = true;
                                BOSS_HP -= 1;

                                if (BOSS_HP === 0) {
                                    delete this.boss;
                                    this.ctx.drawImage(bossImages['Boss Dead.png'], boss.x, boss.y);
                                    NUMBER_TIMES_BOSS_DIED += 1;
                                    BOSS_HP_UPDATE += 20;
                                    BOSS_HP = BOSS_HP_UPDATE;
                                    if (NUMBER_TIMES_BOSS_DIED === 5); {
                                        this.gameWon();
                                    }
                                    // BOSS_HP = 4 * LEVEL * LEVEL;
                                    // levelOver();
                                    this.setUpBoss();
                                }
                            }
                        }
                    }
                }
            });
            //}
            this.topAliens.forEach((topAlien, topAlienIdx) => {
                if (topAlien.x + 99 >= this.beamDir.x) {
                    if (topAlien.x <= this.beamDir.x + 99) {
                        if (topAlien.y + 99 >= this.beamDir.y) {
                            if (topAlien.y <= this.beamDir.y + 99) {
                                delete this.topAliens[topAlienIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], topAlien.x - 25, topAlien.y - 25);
                                // ALIENS_TO_KILL -= 1;
                                // if (ALIENS_TO_KILL === 0) { levelOver(); }
                                this.setupTopAliens();
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.bottomAliens.forEach((bottomAlien, bottomAlienIdx) => {
                if (bottomAlien.x + 99 >= this.beamDir.x) {
                    if (bottomAlien.x <= this.beamDir.x + 99) {
                        if (bottomAlien.y + 99 >= this.beamDir.y) {
                            if (bottomAlien.y <= this.beamDir.y + 99) {
                                delete this.bottomAliens[bottomAlienIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], bottomAlien.x - 25, bottomAlien.y - 25);
                                // ALIENS_TO_KILL -= 1;
                                // if (ALIENS_TO_KILL === 0) { levelOver(); }
                                this.setupBottomAliens();
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.leftAliens.forEach((leftAlien, leftAlienIdx) => {
                if (leftAlien.x + 99 >= this.beamDir.x) {
                    if (leftAlien.x <= this.beamDir.x + 99) {
                        if (leftAlien.y + 99 >= this.beamDir.y) {
                            if (leftAlien.y <= this.beamDir.y + 99) {
                                delete this.leftAliens[leftAlienIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], leftAlien.x - 25, leftAlien.y - 25);
                                // ALIENS_TO_KILL -= 1;
                                // if (ALIENS_TO_KILL === 0) { levelOver(); }
                                this.setupLeftAliens();
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.rightAliens.forEach((rightAlien, rightAlienIdx) => {
                if (rightAlien.x + 99 >= this.beamDir.x) {
                    if (rightAlien.x <= this.beamDir.x + 99) {
                        if (rightAlien.y + 99 >= this.beamDir.y) {
                            if (rightAlien.y <= this.beamDir.y + 99) {
                                delete this.rightAliens[rightAlienIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], rightAlien.x - 25, rightAlien.y - 25);
                                // ALIENS_TO_KILL -= 1;
                                // if (ALIENS_TO_KILL === 0) { levelOver(); }
                                this.setupRightAliens();
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.topAsteroids.forEach((topAsteroid, topAsteroidIdx) => {
                if (topAsteroid.x + 99 >= this.beamDir.x) {
                    if (topAsteroid.x <= this.beamDir.x + 99) {
                        if (topAsteroid.y + 99 >= this.beamDir.y) {
                            if (topAsteroid.y <= this.beamDir.y + 99) {
                                delete this.topAsteroids[topAsteroidIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], topAsteroid.x - 25, topAsteroid.y - 25);
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.bottomAsteroids.forEach((bottomAsteroid, bottomAsteroidIdx) => {
                if (bottomAsteroid.x + 99 >= this.beamDir.x) {
                    if (bottomAsteroid.x <= this.beamDir.x + 99) {
                        if (bottomAsteroid.y + 99 >= this.beamDir.y) {
                            if (bottomAsteroid.y <= this.beamDir.y + 99) {
                                delete this.bottomAsteroids[bottomAsteroidIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], bottomAsteroid.x - 25, bottomAsteroid.y - 25);
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.leftAsteroids.forEach((leftAsteroid, leftAsteroidIdx) => {
                if (leftAsteroid.y + 99 >= this.beamDir.y) {
                    if (leftAsteroid.y <= this.beamDir.y + 99) {
                        if (leftAsteroid.x + 99 >= this.beamDir.x) {
                            if (leftAsteroid.x <= this.beamDir.x + 99) {
                                delete this.leftAsteroids[leftAsteroidIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], leftAsteroid.x - 25, leftAsteroid.y - 25);
                                connect = true;
                            }
                        }
                    }
                }
            });
            this.rightAsteroids.forEach((rightAsteroid, rightAsteroidIdx) => {
                if (rightAsteroid.y + 99 >= this.beamDir.y) {
                    if (rightAsteroid.y <= this.beamDir.y + 99) {
                        if (rightAsteroid.x + 99 >= this.beamDir.x) {
                            if (rightAsteroid.x <= this.beamDir.x + 99) {
                                delete this.rightAsteroids[rightAsteroidIdx];
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], rightAsteroid.x - 25, rightAsteroid.y - 25);
                                connect = true;
                            }
                        }
                    }
                }
            });

            if (connect) { delete this.beamDir; }
        }

        if (this.isPlayerDead()) {
            this.ctx.drawImage(backgroundImages['GAME OVER 2.jpg'], 0, 0);
            this.ctx.font = 'bold 100px Impact';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText("SINISTAR HEALTH : " + BOSS_HP, 100, 100);
            this.ctx.fillText("SINISTAR KILLED : " + NUMBER_TIMES_BOSS_DIED + "/5", 100, 200);

            document.addEventListener("keydown", e => {
                if (e.keyCode === ENTER_CODE) {
                    restart();
                }
            });
        }
        else {
            this.lastFrame = Date.now();
            this.ctx.font = 'bold 100px Impact';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText("SINISTAR HEALTH : " + BOSS_HP, 100, 100);
            this.ctx.fillText("SINISTAR KILLED : " + NUMBER_TIMES_BOSS_DIED + "/5", 100, 200);
            requestAnimationFrame(this.gameLoop);
        }
    }
    gameWon() {
        this.ctx.drawImage(backgroundImages['game won.jpg'], 0, 0);
        this.ctx.font = 'bold 100px Impact';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText("SINISTAR KILLED : " + NUMBER_TIMES_BOSS_DIED + "/5", 100, 200);
        document.addEventListener("click", e => {
            alert("CONGRATZ BRO! NOW START OVER!");
        });
    }
    isPlayerDead() {
        var isDead = false;
        // return false;
        //if ((LEVEL === 2) || (LEVEL > 3)) {
        if (this.boss) {
            this.boss.forEach((boss) => {
                if (boss.x + 199 >= this.player.x) {
                    if (boss.x <= this.player.x + 199) {
                        if (boss.y + 199 >= this.player.y) {
                            if (boss.y <= this.player.y + 199) {
                                this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                                this.ctx.drawImage(backgroundImages['GAME OVER 2.jpg'], 0, 0);
                                return isDead = true;
                            }
                        }
                    }
                }
            });
        }
        //}
        this.topAliens.forEach((topAlien, topAlienIdx) => {
            if (topAlien.x == this.player.x) {
                if (topAlien.y + 99 >= this.player.y) {
                    if (topAlien.y <= this.player.y + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.bottomAliens.forEach((bottomAlien, bottomAlienIdx) => {
            if (bottomAlien.x == this.player.x) {
                if (bottomAlien.y + 99 >= this.player.y) {
                    if (bottomAlien.y <= this.player.y + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.leftAliens.forEach((leftAlien, leftAlienIdx) => {
            if (leftAlien.y == this.player.y) {
                if (leftAlien.x + 99 >= this.player.x) {
                    if (leftAlien.x <= this.player.x + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.rightAliens.forEach((rightAlien, rightAlienIdx) => {
            if (rightAlien.y == this.player.y) {
                if (rightAlien.x + 99 >= this.player.x) {
                    if (rightAlien.x <= this.player.x + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.topAsteroids.forEach((topAsteroid, topAsteroidIdx) => {
            if (topAsteroid.x == this.player.x) {
                if (topAsteroid.y + 99 >= this.player.y) {
                    if (topAsteroid.y <= this.player.y + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.bottomAsteroids.forEach((bottomAsteroid, bottomAsteroidIdx) => {
            if (bottomAsteroid.x == this.player.x) {
                if (bottomAsteroid.y + 99 >= this.player.y) {
                    if (bottomAsteroid.y <= this.player.y + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.leftAsteroids.forEach((leftAsteroid, leftAsteroidIdx) => {
            if (leftAsteroid.y == this.player.y) {
                if (leftAsteroid.x + 99 >= this.player.x) {
                    if (leftAsteroid.x <= this.player.x + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        this.rightAsteroids.forEach((rightAsteroid, rightAsteroidIdx) => {
            if (rightAsteroid.y == this.player.y) {
                if (rightAsteroid.x + 99 >= this.player.x) {
                    if (rightAsteroid.x <= this.player.x + 99) {
                        this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
                        return isDead = true;
                    }
                }
            }
        });
        return isDead;
    }
}

// Restarts the game after death
function restart() {
    location.reload();
}

// function levelOver() {

//     // if (LEVEL === 2) { this.ctx.drawImage(['next level 2.jpg'], 0, 0); }
//     // if (LEVEL === 3) { this.ctx.drawImage(['next level 3.jpg'], 0, 0); }
//     // if (LEVEL === 4) { this.ctx.drawImage(['next level 4.jpg'], 0, 0); }
//     // if (LEVEL === 5) { this.ctx.drawImage(['next level 5.jpg'], 0, 0); }
//     // if (LEVEL === 6) { this.ctx.drawImage(['game won.jpg'], 0, 0); }
// /*
//     delete this.topAsteroids;
//     delete this.bottomAsteroids;
//     delete this.leftAsteroids;
//     delete this.rightAsteroids;
// */

//     // if ((LEVEL === 2) || (LEVEL >= 4)) {
//     //     delete this.boss[0];
//     // }
// /*
//     delete this.topAliens;
//     delete this.bottomAliens;
//     delete this.leftAliens;
//     delete this.rightAliens;
// */
//     LEVEL += 1;
//     ALIENS_TO_KILL = LEVEL * 20;

//     MAX_ASTEROIDS_TOP_BOTTOM = 10 * LEVEL;
//     MAX_ASTEROIDS_LEFT_RIGHT = 6 * LEVEL;
//     MAX_ALIENS = 5* LEVEL;


//     document.addEventListener("keydown", e => {
//         if (e.keyCode === ENTER_CODE) {
//             gameEngine.start();
//         }
//     });
// }

// Starts the game
var gameEngine = new Engine(document.getElementById('app'));

document.addEventListener("keydown", e => {
    if (e.keyCode === ENTER_CODE) {
        gameEngine.start();
    }
});
