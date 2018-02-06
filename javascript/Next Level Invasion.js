var body = document.getElementById('bodyBackground');
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
// Basic enemy stats
var alienCounter = 0;
var MAX_ALIENS = 8;
var MAX_ALIENS_UPDATE = 5;
var NUMBER_WAVES_ALIENS_KILLED = 0;
var NUMBER_ALIENS_IN_WAVE = 5;
// Asteroid stats
var asteroidCounter = 1;
var MAX_ASTEROIDS = 10;
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
        case 1: this.beamDir = this.beamExist.push(xPlayerPos);
        case 2: this.beamDir = this.beamExist.push(xPlayerPos);
        case 3: this.beamDir = this.beamExist.push(yPlayerPos);
        case 4: this.beamDir = this.beamExist.push(yPlayerPos);
    }
    this.beamDir = new Beam(currentDir, xPlayerPos, yPlayerPos);
}

class Render { render(ctx) { ctx.drawImage(this.sprite, this.x, this.y); } }

class Boss {
    constructor() {
        this.x = (Math.round(Math.random())) * GAME_WIDTH;
        this.y = (Math.round(Math.random())) * GAME_HEIGHT;
    }
    update(xPlayerPos, yPlayerPos) {
        this.x > xPlayerPos ? this.x -= 5 : this.x < xPlayerPos ? this.x += 5 : this.x;
        this.y > yPlayerPos ? this.y -= 5 : this.y < yPlayerPos ? this.y += 5 : this.y;
    }
    render(ctx, counter) {
        if (counter < 25) { ctx.drawImage(bossImages['Sinistar Boss 1.png'], this.x - 200, this.y - 200); }
        if (25 <= counter) { ctx.drawImage(bossImages['Sinistar Boss 2.png'], this.x - 200, this.y - 200); }
    }
}

class Alien extends Render {
    constructor(alienPos, alienSide) {
        super();
        this.sprite = enemyImages[randomAlien()];
        switch (alienSide) {
            case 0:
                this.x = alienPos;
                this.y = -ENTITY_DIMENSIONS;
                break;
            case 1:
                this.x = alienPos;
                this.y = GAME_HEIGHT + ENTITY_DIMENSIONS;
                break;
            case 2:
                this.x = -ENTITY_DIMENSIONS;
                this.y = alienPos;
                break;
            case 3:
                this.x = GAME_WIDTH + ENTITY_DIMENSIONS;
                this.y = alienPos;
                break;
        }
    }
    update(xPlayerPos, yPlayerPos) {
        this.x > xPlayerPos ? this.x -= 3 : this.x < xPlayerPos ? this.x += 3 : this.x;
        this.y > yPlayerPos ? this.y -= 3 : this.y < yPlayerPos ? this.y += 3 : this.y;
    }
}

class Asteroid extends Render {
    constructor(asteroidPos, aCounter) {
        super();
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = Math.random() / 1.5;
        this.thing = aCounter;
        switch (aCounter) {
            case 1:
                this.x = asteroidPos;
                this.y = 0;
                break;
            case 2:
                this.x = asteroidPos;
                this.y = GAME_HEIGHT - ENTITY_DIMENSIONS;
                break;
            case 3:
                this.x = 0;
                this.y = asteroidPos;
                break;
            case 4:
                this.x = GAME_WIDTH - ENTITY_DIMENSIONS;
                this.y = asteroidPos;
                break;
        }
    }
    update(timeDiff) {
        switch (this.thing) {
            case 1: return this.y = this.y + (timeDiff * this.speed);
            case 2: return this.y = this.y - (timeDiff * this.speed);
            case 3: return this.x = this.x + (timeDiff * this.speed);
            case 4: return this.x = this.x - (timeDiff * this.speed);
        }
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
        this.speed = 5;
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
        this.setupAliens();
        this.setupAsteroids();

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

    setupAliens() {
        if (!this.aliens) { this.aliens = []; }
        while (this.aliens.filter(e => !!e).length < MAX_ALIENS) { this.addAlien(); }
    }
    addAlien() {
        var alienSpots = 30;
        var alienSpot;
        ++alienCounter;
        if (alienCounter === 4) { alienCounter = 0; }
        while (!alienSpot || this.aliens[alienSpot]) { alienSpot = Math.floor(Math.random() * alienSpots); }
        this.aliens[alienSpot] = new Alien((alienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS, alienCounter);
    }
    setupAsteroids() {
        if (!this.asteroids) { this.asteroids = []; }
        while (this.asteroids.filter(e => !!e).length < MAX_ASTEROIDS) { this.addAsteroid(); }
    }
    addAsteroid() {
        if (asteroidCounter === 5) { asteroidCounter = 1; }
        var asteroidSpots = 30;
        var asteroidSpot;
        while (!asteroidSpot || this.asteroids[asteroidSpot]) { asteroidSpot = Math.floor(Math.random() * asteroidSpots); }
        this.asteroids[asteroidSpot] = new Asteroid(((asteroidSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS), asteroidCounter);
        ++asteroidCounter;
    }
    // This method kicks off the game
    start() {
        this.lastFrame = Date.now();
        if (!this.player.arrowPressed) { this.player.arrowPressed = 1 }
        // Listen for keyboard up/down/left/right/spacebar and update the player
        document.addEventListener('keydown', e => {
            if (e.keyCode === UP_ARROW_CODE) { this.player.move(MOVE_UP); }
            else if (e.keyCode === DOWN_ARROW_CODE) { this.player.move(MOVE_DOWN); }
            else if (e.keyCode === LEFT_ARROW_CODE) { this.player.move(MOVE_LEFT); }
            else if (e.keyCode === RIGHT_ARROW_CODE) { this.player.move(MOVE_RIGHT); }
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
            else if (e.keyCode === ENTER_CODE) { location.reload(); }
        });
        this.gameLoop();
    }

    gameLoop() {
        var connect = false;
        counter += 1;
        if (counter === 50) { counter = 0; }
        // Check how long it's been since last frame
        var currentFrame = Date.now();
        var timeDiff = currentFrame - this.lastFrame;
        this.ctx.drawImage(backgroundImages['background level 5.jpg'], 0, 0);

        if (this.beamDir) {
            this.beamDir.update(timeDiff);
            this.beamDir.render(this.ctx);
        }

        this.aliens.forEach(alien => alien.update(this.player.x, this.player.y));
        this.aliens.forEach(alien => alien.render(this.ctx));
        this.asteroids.forEach(asteroid => asteroid.update(timeDiff));
        this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
        this.player.render(this.ctx);
        this.boss.forEach(e => e.update(this.player.x, this.player.y));
        this.boss.forEach(e => e.render(this.ctx, counter));
        this.asteroids.forEach((asteroid, asteroidIdx) => { asteroid.y > GAME_HEIGHT + ENTITY_DIMENSIONS ? delete this.asteroids[asteroidIdx] : asteroid.y < -(ENTITY_DIMENSIONS * 2) ? delete this.asteroids[asteroidIdx] : asteroid.x > GAME_WIDTH + ENTITY_DIMENSIONS ? delete this.asteroids[asteroidIdx] : asteroid.x < -(ENTITY_DIMENSIONS * 2) ? delete this.asteroids[asteroidIdx] : false; });
        this.setupAsteroids();

        if (this.beamDir) {
            this.beamDir.x < -ENTITY_DIMENSIONS ? delete this.beamDir : this.beamDir.x > GAME_WIDTH ? delete this.beamDir : this.beamDir.y < -ENTITY_DIMENSIONS ? delete this.beamDir : this.beamDir.y > GAME_HEIGHT ? delete this.beamDir : connect;
            this.boss.forEach((boss) => {
                if (this.beamDir) {
                    ((boss.x + 399 >= this.beamDir.x) && (boss.x <= this.beamDir.x + 399) && (boss.y + 399 >= this.beamDir.y) && (boss.y <= this.beamDir.y + 399)) ? connect = true : connect = false;
                    if (connect) {
                        BOSS_HP -= 1;
                        delete this.beamDir;
                        if (BOSS_HP === 0) {
                            this.ctx.drawImage(bossImages['Boss Dead.png'], boss.x, boss.y);
                            delete this.boss;
                            NUMBER_TIMES_BOSS_DIED += 1;
                            BOSS_HP_UPDATE += 20;
                            BOSS_HP = BOSS_HP_UPDATE;
                            this.setUpBoss();
                        }
                    }
                }
            });
            this.aliens.forEach((alien, alienIdx) => {
                if (this.beamDir) {
                    alien.x + 99 >= this.beamDir.x ? alien.x <= this.beamDir.x + 99 ? alien.y + 99 >= this.beamDir.y ? alien.y <= this.beamDir.y + 99 ? connect = true : connect : connect : connect : connect;
                    if (connect) {
                        this.ctx.drawImage(asteroidImages['asteroid dead.png'], alien.x - 25, alien.y - 25);
                        delete this.beamDir;
                        delete this.aliens[alienIdx];
                        this.setupAliens();
                    }
                }
            });
            this.asteroids.forEach((asteroid, asteroidIdx) => {
                if (this.beamDir) {
                    asteroid.x + 99 >= this.beamDir.x ? asteroid.x <= this.beamDir.x + 99 ? asteroid.y + 99 >= this.beamDir.y ? asteroid.y <= this.beamDir.y + 99 ? connect = true : connect = false : connect = false : connect = false : connect = false;
                    if (connect) {
                        this.ctx.drawImage(asteroidImages['asteroid dead.png'], asteroid.x - 25, asteroid.y - 25);
                        delete this.beamDir;
                        delete this.asteroids[asteroidIdx];
                        this.setupAsteroids();
                    }
                }
            });
        }
        if (this.isPlayerDead()) {
            this.ctx.drawImage(playerImages['player dead.png'], this.player.x - 100, this.player.y - 100);
            this.ctx.drawImage(backgroundImages['GAME OVER 2.jpg'], 0, 0);
            this.score();
        }
        else {
            this.lastFrame = Date.now();
            this.score();
            requestAnimationFrame(this.gameLoop);
        }
    }
    isPlayerDead() {
        var isDead = false;
        return false;
        this.boss.forEach((boss) => {
            boss.x + 199 >= this.player.x ? isDead = true : boss.x <= this.player.x + 199 ? isDead = true : boss.y + 199 >= this.player.y ? isDead = true : boss.y <= this.player.y + 199 ? isDead = true : isDead = false;
            if (isDead) { return true; }
        });
        this.aliens.forEach((alien, alienIdx) => {
            alien.x + 99 >= this.player.x ? isDead = true : alien.x <= this.player.x + 99 ? isDead = true : alien.y + 99 >= this.player.y ? isDead = true : alien.y <= this.player.y + 99 ? isDead = true : isDead = false;
            if (isDead) { return true; }
        });
        this.asteroids.forEach((asteroid, asteroidIdx) => {
            asteroid.x + 99 >= this.player.x ? isDead = true : asteroid.x <= this.player.x + 99 ? isDead = true : asteroid.y + 99 >= this.player.y ? isDead = true : asteroid.y <= this.player.y + 99 ? isDead = true : isDead = false;
            if (isDead) { return true; }
        });
        return isDead;
    }
    score() {
        this.ctx.font = 'bold 100px Impact';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText("SINISTAR HEALTH : " + BOSS_HP, 100, 100);
        this.ctx.fillText("SINISTAR KILLED : " + NUMBER_TIMES_BOSS_DIED + "/5", 100, 200);
    }
}
// Starts the game
var gameEngine = new Engine(document.getElementById('app'));
document.addEventListener("keydown", e => {
    if (e.keyCode === ENTER_CODE) {
        body.id = "";
        gameEngine.start();
    }
});
// Restarts the game after death
/*
document.addEventListener("keydown", e => {
    if (e.keyCode === ENTER_CODE) { location.reload(); }
});*/
