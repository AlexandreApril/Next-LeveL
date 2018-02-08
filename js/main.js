var body = document.getElementById('bodyBackground');
// Constants
// Codes for the controls of the game
// Easier to identify
var GAME_WIDTH = 1125;
var GAME_HEIGHT = 725;
var ENTITY_DIMENSIONS = 25;
var ENTER_CODE = 13;
var UP_ARROW_CODE = 38;
var DOWN_ARROW_CODE = 40;
var LEFT_ARROW_CODE = 37;
var RIGHT_ARROW_CODE = 39;
var SPACE_BAR_CODE = 32;
var PAUSE_KEY = 80;
var REFRESH_KEY = 82;
var MOVE_UP = 'up';
var MOVE_DOWN = 'down';
var MOVE_LEFT = 'left';
var MOVE_RIGHT = 'right';
var FIRE = 'fire';
var PAUSED = true;
var SWITCH = true;
var LEVEL_OVER = false;
var COUNTER = 1;
var LEVEL = 1;
var PLAYER_STARTING_POSITION_X = (GAME_WIDTH - ENTITY_DIMENSIONS) / 2;
var PLAYER_STARTING_POSITION_Y = (GAME_HEIGHT - ENTITY_DIMENSIONS) / 2;
// Boss stats
var BOSS_HP = 20;
var BOSS_HP_UPDATE = 20;
var NUMBER_TIMES_BOSS_DIED = 0;
var TOTAL_BOSS_DEATHS_NEEDED = 5;
// Basic alien stats
var alienCounter = 1;
var MAX_ALIENS = 5;
var NUMBER_ALIENS_KILLED = 0;
var TOTAL_NUMBER_ALIENS = 15;
// Asteroid stats
var asteroidCounter = 1;
var MAX_ASTEROIDS = 10;

// Preload game images
var backgroundImages = {};
['background level 1.jpg', 'background level 2.jpg', 'background level 3.jpg', 'background level 4.jpg', 'background level 5.jpg', 'next level 2.jpg', 'next level 3.jpg', 'next level 4.jpg', 'next level 5.jpg', 'game over 1.jpg', 'game over 2.jpg', 'game over 3.jpg', 'game over 4.jpg', 'game over 5.jpg', 'game won.jpg', 'pause button.png'].forEach(imgName => {
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
var alienImages = {};
['alien 1.png', 'alien 2.png', 'alien 3.png', 'alien 4.png', 'alien 5.png', 'alien 6.png', 'alien 7.png', 'alien 8.png', 'alien 9.png', 'alien 10.png', 'alien 11.png', 'alien dead.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/alien images/' + imgName;
    alienImages[imgName] = img;
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

// Allows each alien and asteroid to be given a random image upon creation
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
        case 10: return 'asteroid 1.png';
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
        if (LEVEL === 4) { this.speed = 1; }
        if (LEVEL === 5) { this.speed = 2; }
    }
    update(xPlayerPos, yPlayerPos) {
        this.x > xPlayerPos ? this.x -= this.speed : this.x < xPlayerPos ? this.x += this.speed : this.x;
        this.y > yPlayerPos ? this.y -= this.speed : this.y < yPlayerPos ? this.y += this.speed : this.y;
    }
    render(ctx, COUNTER) {
        if (COUNTER < 25) { ctx.drawImage(bossImages['Sinistar Boss 1.png'], this.x - 50, this.y - 50); }
        if (25 <= COUNTER) { ctx.drawImage(bossImages['Sinistar Boss 2.png'], this.x - 50, this.y - 50); }
    }
}
class Alien extends Render {
    constructor(alienPos, alienSide) {
        super();
        this.sprite = alienImages[randomAlien()];
        this.speed = 1 + Math.random();
        switch (alienSide) {
            case 1:
                this.x = alienPos;
                this.y = -ENTITY_DIMENSIONS;
                break;
            case 2:
                this.x = alienPos;
                this.y = GAME_HEIGHT + ENTITY_DIMENSIONS;
                break;
            case 3:
                this.x = -ENTITY_DIMENSIONS;
                this.y = alienPos;
                break;
            case 4:
                this.x = GAME_WIDTH + ENTITY_DIMENSIONS;
                this.y = alienPos;
                break;
        }
    }
    update(xPlayerPos, yPlayerPos) {
        this.x > xPlayerPos ? this.x -= this.speed : this.x < xPlayerPos ? this.x += this.speed : this.x;
        this.y > yPlayerPos ? this.y -= this.speed : this.y < yPlayerPos ? this.y += this.speed : this.y;
    }
}
class Asteroid extends Render {
    constructor(asteroidPos, asteroidSide) {
        super();
        this.sprite = asteroidImages[randomAsteroid()];
        this.speed = (Math.random() + 0.01);
        this.side = asteroidSide;
        switch (asteroidSide) {
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
        switch (this.side) {
            case 1: return this.y = this.y + (timeDiff * this.speed) / 2.5;
            case 2: return this.y = this.y - (timeDiff * this.speed) / 2.5;
            case 3: return this.x = this.x + (timeDiff * this.speed) / 2.5;
            case 4: return this.x = this.x - (timeDiff * this.speed) / 2.5;
        }
    }
}
class Player extends Render {
    constructor() {
        super();
        this.x = PLAYER_STARTING_POSITION_X;
        this.y = PLAYER_STARTING_POSITION_Y;
        switch (LEVEL) {
            case 1: this.speed = 1.5;
            case 2: this.speed = 3;
            case 3:
            case 4:
            case 5: this.speed = 5;
        }
        this.sprite = playerImages['player fly up.png'];
    }
    // This method is called by the game engine when up/down/left/right arrows are pressed
    move(direction) {
        if (direction === MOVE_UP && this.y > 0) {
            this.arrowPressed = 1;
            this.sprite = playerImages['player fly up.png'];
            // this.y = this.y - ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - ENTITY_DIMENSIONS) {
            this.arrowPressed = 2;
            this.sprite = playerImages['player fly down.png'];
            // this.y = this.y + ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_LEFT && this.x > 0) {
            this.arrowPressed = 3;
            this.sprite = playerImages['player fly left.png'];
            // this.x = this.x - ENTITY_DIMENSIONS;
        }
        else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - ENTITY_DIMENSIONS) {
            this.arrowPressed = 4;
            this.sprite = playerImages['player fly right.png'];
            // this.x = this.x + ENTITY_DIMENSIONS;
        }
    }
    update() {
        if (this.arrowPressed === 1 && this.y > 0) { this.y = this.y - this.speed; }
        else if (this.arrowPressed === 2 && this.y < GAME_HEIGHT - ENTITY_DIMENSIONS) { this.y = this.y + this.speed; }
        else if (this.arrowPressed === 3 && this.x > 0) { this.x = this.x - this.speed; }
        else if (this.arrowPressed === 4 && this.x < GAME_WIDTH - ENTITY_DIMENSIONS) { this.x = this.x + this.speed; }
    }
}

class Beam extends Render {
    constructor(currentDir, xPlayerPos, yPlayerPos) {
        super();
        this.speed = 30;
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
    update() {
        switch (this.currentDir) {
            case 1: return this.y = this.y - this.speed;
            case 2: return this.y = this.y + this.speed;
            case 3: return this.x = this.x - this.speed;
            case 4: return this.x = this.x + this.speed;
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
        this.setupAliens();
        if (LEVEL !== 3) { this.setupAsteroids(); }
        if (LEVEL === 4 || LEVEL === 5) { this.setUpBoss(); }
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
        if (LEVEL === 3) { while (this.aliens.filter(e => !!e).length < MAX_ALIENS * 10) { this.addAlien(); } }
        else { while (this.aliens.filter(e => !!e).length < MAX_ALIENS * LEVEL) { this.addAlien(); } }
    }
    addAlien() {
        var alienSpots = 51;
        var alienSpot;
        if (alienCounter === 5) { alienCounter = 1; }
        while (!alienSpot || this.aliens[alienSpot]) { alienSpot = Math.floor(Math.random() * alienSpots); }
        this.aliens[alienSpot] = new Alien((alienSpot * ENTITY_DIMENSIONS) - ENTITY_DIMENSIONS, alienCounter);
        ++alienCounter;
    }
    setupAsteroids() {
        if (!this.asteroids) { this.asteroids = []; }
        while (this.asteroids.filter(e => !!e).length < MAX_ASTEROIDS * LEVEL) { this.addAsteroid(); }
    }
    addAsteroid() {
        var asteroidSpots = 51;
        var asteroidSpot;
        if (asteroidCounter === 5) { asteroidCounter = 1; }
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
            switch (e.keyCode) {
                case PAUSE_KEY: PAUSED = !PAUSED; break;
                case REFRESH_KEY: location.reload(); break;
                case UP_ARROW_CODE: this.player.move(MOVE_UP); break;
                case DOWN_ARROW_CODE: this.player.move(MOVE_DOWN); break;
                case LEFT_ARROW_CODE: this.player.move(MOVE_LEFT); break;
                case RIGHT_ARROW_CODE: this.player.move(MOVE_RIGHT); break;
                case ENTER_CODE:
                    if (LEVEL_OVER) {
                        LEVEL_OVER = false;
                        LEVEL += 1;
                        this.player.x = PLAYER_STARTING_POSITION_X;
                        this.player.y = PLAYER_STARTING_POSITION_Y;
                        this.setupAliens();
                        if (LEVEL !== 3) { this.setupAsteroids(); }
                        if (LEVEL === 4 || LEVEL === 5) { this.setUpBoss(); }
                        if (LEVEL === 6) { LEVEL = 1; }
                        this.gameLoop();
                    }
                    break;
            }
            document.addEventListener('keyup', e => {
                if (e.keyCode === SPACE_BAR_CODE) {
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
            })
        });
        this.gameLoop();
    }

    gameLoop() {
        if (PAUSED) {
            var connect = false;
            COUNTER += 1;
            if (COUNTER === 50) { COUNTER = 0; }
            // Check how long it's been since last frame
            var currentFrame = Date.now();
            var timeDiff = currentFrame - this.lastFrame;
            switch (LEVEL) {
                case 1: this.ctx.drawImage(backgroundImages['background level 1.jpg'], 0, 0); break;
                case 2: this.ctx.drawImage(backgroundImages['background level 1.jpg'], 0, 0); break;
                case 3: this.ctx.drawImage(backgroundImages['background level 3.jpg'], 0, 0); break;
                case 4: this.ctx.drawImage(backgroundImages['background level 4.jpg'], 0, 0); break;
                case 5: this.ctx.drawImage(backgroundImages['background level 5.jpg'], 0, 0); break;
            }

            if (this.beamDir) {
                this.beamDir.update();
                this.beamDir.render(this.ctx);
            }
            this.aliens.forEach(alien => alien.update(this.player.x, this.player.y));
            this.aliens.forEach(alien => alien.render(this.ctx));
            if (LEVEL !== 3) {
                this.asteroids.forEach(asteroid => asteroid.update(timeDiff));
                this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
            }
            this.player.update();
            this.player.render(this.ctx);
            if (LEVEL === 4 || LEVEL === 5) {
                this.boss.forEach(e => e.update(this.player.x, this.player.y));
                this.boss.forEach(e => e.render(this.ctx, COUNTER));
            }
            if (LEVEL !== 3) {
                this.asteroids.forEach((asteroid, asteroidIdx) => { asteroid.y > GAME_HEIGHT + ENTITY_DIMENSIONS ? delete this.asteroids[asteroidIdx] : asteroid.y < -(ENTITY_DIMENSIONS * 2) ? delete this.asteroids[asteroidIdx] : asteroid.x > GAME_WIDTH + ENTITY_DIMENSIONS ? delete this.asteroids[asteroidIdx] : asteroid.x < -(ENTITY_DIMENSIONS * 2) ? delete this.asteroids[asteroidIdx] : false; });
                this.setupAsteroids();
            }
            if (LEVEL === 4 || LEVEL === 5) {
                this.boss.forEach((boss) => {
                    this.asteroids.forEach((asteroid, asteroidIdx) => {
                        ((boss.x + 74 >= asteroid.x) && (boss.x <= asteroid.x + 74) && (boss.y + 74 >= asteroid.y) && (boss.y <= asteroid.y + 74)) ? connect = true : connect = false;
                        if (connect) {
                            this.ctx.drawImage(asteroidImages['asteroid dead.png'], asteroid.x - 6, asteroid.y - 6);
                            delete this.asteroids[asteroidIdx];
                            this.setupAsteroids();
                        }
                    });
                });
            }
            this.aliens.forEach((alien, alienIdx) => {
                if (LEVEL !== 3) {
                    this.asteroids.forEach((asteroid, asteroidIdx) => {
                        ((alien.x + 24 >= asteroid.x) && (alien.x <= asteroid.x + 24) && (alien.y + 24 >= asteroid.y) && (alien.y <= asteroid.y + 24)) ? connect = true : connect = false;
                        if (connect) {
                            this.ctx.drawImage(alienImages['alien dead.png'], alien.x - 6, alien.y - 6);
                            delete this.aliens[alienIdx];
                            this.setupAliens();
                        }
                    });
                }
                if (LEVEL === 4 || LEVEL === 5) {
                    this.boss.forEach((boss) => {
                        ((boss.x + 74 >= alien.x) && (boss.x <= alien.x + 74) && (boss.y + 74 >= alien.y) && (boss.y <= alien.y + 74)) ? connect = true : connect = false;
                        if (connect) {
                            this.ctx.drawImage(alienImages['alien dead.png'], alien.x - 6, alien.y - 6);
                            delete this.aliens[alienIdx];
                            this.setupAliens();
                        }
                    });
                }
            });
            if (this.beamDir) {
                this.beamDir.x < -ENTITY_DIMENSIONS ? delete this.beamDir : this.beamDir.x > GAME_WIDTH ? delete this.beamDir : this.beamDir.y < -ENTITY_DIMENSIONS ? delete this.beamDir : this.beamDir.y > GAME_HEIGHT ? delete this.beamDir : connect;
                if (LEVEL === 4 || LEVEL === 5) {
                    this.boss.forEach((boss) => {
                        if (this.beamDir) {
                            ((boss.x + 74 >= this.beamDir.x) && (boss.x <= this.beamDir.x + 74) && (boss.y + 74 >= this.beamDir.y) && (boss.y <= this.beamDir.y + 74)) ? connect = true : connect = false;
                            if (connect) {
                                BOSS_HP -= 1;
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], this.beamDir.x - 6, this.beamDir.y - 6);
                                delete this.beamDir;
                                if (BOSS_HP === 0) {
                                    this.ctx.drawImage(bossImages['Boss Dead.png'], boss.x - 50, boss.y - 50);
                                    delete this.boss;
                                    NUMBER_TIMES_BOSS_DIED += 1;
                                    BOSS_HP_UPDATE += 20;
                                    BOSS_HP = BOSS_HP_UPDATE;
                                    this.setUpBoss();
                                }
                            }
                        }
                    });
                }
                this.aliens.forEach((alien, alienIdx) => {
                    if (this.beamDir) {
                        alien.x + 24 >= this.beamDir.x ? alien.x <= this.beamDir.x + 24 ? alien.y + 24 >= this.beamDir.y ? alien.y <= this.beamDir.y + 24 ? connect = true : connect : connect : connect : connect;
                        if (connect) {
                            NUMBER_ALIENS_KILLED += 1;
                            this.ctx.drawImage(alienImages['alien dead.png'], alien.x - 6, alien.y - 6);
                            delete this.beamDir;
                            delete this.aliens[alienIdx];
                            this.setupAliens();
                        }
                    }
                });
                if (LEVEL !== 3) {
                    this.asteroids.forEach((asteroid, asteroidIdx) => {
                        if (this.beamDir) {
                            asteroid.x + 24 >= this.beamDir.x ? asteroid.x <= this.beamDir.x + 24 ? asteroid.y + 24 >= this.beamDir.y ? asteroid.y <= this.beamDir.y + 24 ? connect = true : connect = false : connect = false : connect = false : connect = false;
                            if (connect) {
                                this.ctx.drawImage(asteroidImages['asteroid dead.png'], asteroid.x - 6, asteroid.y - 6);
                                delete this.beamDir;
                                delete this.asteroids[asteroidIdx];
                                this.setupAsteroids();
                            }
                        }
                    });
                }
            }
            switch (LEVEL) {
                case 1:
                    if (NUMBER_ALIENS_KILLED === TOTAL_NUMBER_ALIENS * LEVEL) {
                        NUMBER_ALIENS_KILLED = 0;
                        this.aliens.forEach((alien, alienIdx) => { delete this.aliens[alienIdx]; });
                        this.asteroids.forEach((asteroid, asteroidIdx) => { delete this.asteroids[asteroidIdx]; });
                        this.ctx.drawImage(backgroundImages['next level 2.jpg'], 0, 0);
                        LEVEL_OVER = true;
                    }
                case 2:
                    if (NUMBER_ALIENS_KILLED === TOTAL_NUMBER_ALIENS * LEVEL) {
                        NUMBER_ALIENS_KILLED = 0;
                        this.aliens.forEach((alien, alienIdx) => { delete this.aliens[alienIdx]; });
                        this.asteroids.forEach((asteroid, asteroidIdx) => { delete this.asteroids[asteroidIdx]; });
                        this.ctx.drawImage(backgroundImages['next level 3.jpg'], 0, 0);
                        LEVEL_OVER = true;
                    }
                    break;
                case 3:
                    if (NUMBER_ALIENS_KILLED === TOTAL_NUMBER_ALIENS * 15) {
                        this.aliens.forEach((alien, alienIdx) => { delete this.aliens[alienIdx]; });
                        this.ctx.drawImage(backgroundImages['next level 4.jpg'], 0, 0);
                    }
                    break;
                case 4:
                    if (NUMBER_TIMES_BOSS_DIED === TOTAL_BOSS_DEATHS_NEEDED) {
                        BOSS_HP = 200;
                        BOSS_HP_UPDATE = 0;
                        NUMBER_TIMES_BOSS_DIED = 0;
                        this.asteroids.forEach((asteroid, asteroidIdx) => { delete this.asteroids[asteroidIdx]; });
                        this.aliens.forEach((alien, alienIdx) => { delete this.aliens[alienIdx]; });
                        this.boss.forEach((boss) => { delete this.boss; });
                        this.ctx.drawImage(backgroundImages['next level 5.jpg'], 0, 0);
                        LEVEL_OVER = true;
                    }
                    break;
                case 5:
                    if (NUMBER_TIMES_BOSS_DIED === 1) {
                        this.asteroids.forEach((asteroid, asteroidIdx) => { delete this.asteroids[asteroidIdx]; });
                        this.aliens.forEach((alien, alienIdx) => { delete this.aliens[alienIdx]; });
                        this.boss.forEach((boss) => { delete this.boss; });
                        this.ctx.drawImage(backgroundImages['game won.jpg'], 0, 0);
                        LEVEL_OVER = true;
                    }
                    break;
            }
        }
        if (!LEVEL_OVER) {
            if (this.isPlayerDead()) {
                this.ctx.drawImage(playerImages['player dead.png'], this.player.x - ENTITY_DIMENSIONS, this.player.y - ENTITY_DIMENSIONS);
                switch (LEVEL) {
                    case 1: this.ctx.drawImage(backgroundImages['game over 1.jpg'], 0, 0); break;
                    case 2: this.ctx.drawImage(backgroundImages['game over 2.jpg'], 0, 0); break;
                    case 3: this.ctx.drawImage(backgroundImages['game over 3.jpg'], 0, 0); break;
                    case 4: this.ctx.drawImage(backgroundImages['game over 4.jpg'], 0, 0); break;
                    case 5: this.ctx.drawImage(backgroundImages['game over 5.jpg'], 0, 0); break;
                    default: this.ctx.drawImage(backgroundImages['game over 6.jpg'], 0, 0); break;
                }
                document.addEventListener("keydown", e => { if (e.keyCode === ENTER_CODE) { location.reload(); } });
            }
            else {
                this.lastFrame = Date.now();
                if (PAUSED) { this.score(); }
                if (!PAUSED) {
                    this.ctx.drawImage(backgroundImages['pause button.png'], PLAYER_STARTING_POSITION_X - 75, PLAYER_STARTING_POSITION_Y - 75);
                }
                requestAnimationFrame(this.gameLoop);
            }
        }
    }
    isPlayerDead() {
        var isDead = false;
        this.aliens.forEach((alien, alienIdx) => { ((alien.x + 24 >= this.player.x) && (alien.x <= this.player.x + 24) && (alien.y + 24 >= this.player.y) && (alien.y <= this.player.y + 24)) ? isDead = true : null; });
        if (LEVEL !== 3) { this.asteroids.forEach((asteroid, asteroidIdx) => { ((asteroid.x + 24 >= this.player.x) && (asteroid.x <= this.player.x + 24) && (asteroid.y + 24 >= this.player.y) && (asteroid.y <= this.player.y + 24)) ? isDead = true : null; }); }
        if (LEVEL === 4 || LEVEL === 5) { this.boss.forEach((boss) => { ((boss.x + 49 >= this.player.x) && (boss.x <= this.player.x + 49) && (boss.y + 49 >= this.player.y) && (boss.y <= this.player.y + 49)) ? isDead = true : null; }); }
        return isDead;
    }
    score() {
        this.ctx.font = 'bold 25px Impact';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText("LEVEL " + LEVEL, 25, 25);
        switch (LEVEL) {
            case 1:
            case 2: this.ctx.fillText("ALIENS KILLED : " + NUMBER_ALIENS_KILLED + "/" + TOTAL_NUMBER_ALIENS * LEVEL, 25, 50); break;
            case 3: this.ctx.fillText("ALIENS KILLED : " + NUMBER_ALIENS_KILLED + "/" + TOTAL_NUMBER_ALIENS * 20, 25, 50); break;
            case 4:
                this.ctx.fillText("SINISTAR HEALTH : " + BOSS_HP, 25, 25);
                this.ctx.fillText("SINISTAR KILLED : " + NUMBER_TIMES_BOSS_DIED + "/" + TOTAL_BOSS_DEATHS_NEEDED, 25, 50);
                break;
            case 5: this.ctx.fillText("SINISTAR HEALTH : " + BOSS_HP, 25, 25); break;
        }
    }
}

// Starts the game
var gameEngine = new Engine(document.getElementById('app'));
document.addEventListener("keydown", e => {
    if (SWITCH) {
        SWITCH = false;
        if (e.keyCode === ENTER_CODE) {
            body.id = "";
            gameEngine.start();
        }
    }
});
