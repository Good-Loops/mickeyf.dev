import { getRandomX, getRandomY } from "./handlers/positionHandler";
import { getRandomBoolean, getRandomInt } from "./helpers/methods";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./helpers/constants";
import sprites from "./helpers/loadSprites";

export default function p4Vega() {
    let gameLive: boolean = true;

    // Canvas
    const canvas: HTMLCanvasElement = document.getElementById("p4-Vega") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Set up player
    interface p4 {
        startX: number,
        startY: number,
        x: number,
        y: number,
        speed: number,
        width: number,
        height: number,
        totalWater: number,
        isMovingRight: boolean,
        isMovingLeft: boolean,
        isMovingUp: boolean,
        isMovingDown: boolean
    }
    let p4: p4;

    function movePlayer(e: KeyboardEvent) {
        if (e.code == "ArrowRight") {
            p4.isMovingRight = true;
        }
        if (e.code == "ArrowLeft") {
            p4.isMovingLeft = true;
        }
        if (e.code == "ArrowUp") {
            p4.isMovingUp = true;
        }
        if (e.code == "ArrowDown") {
            p4.isMovingDown = true;
        }
    }
    document.addEventListener("keydown", movePlayer);

    function stopPlayer(e: KeyboardEvent) {
        if (e.code == "ArrowRight") {
            p4.isMovingRight = false;
        }
        if (e.code == "ArrowLeft") {
            p4.isMovingLeft = false;
        }
        if (e.code == "ArrowUp") {
            p4.isMovingUp = false;
        }
        if (e.code == "ArrowDown") {
            p4.isMovingDown = false;
        }
    }
    document.addEventListener("keyup", stopPlayer);

    // Goal - Water
    interface water {
        width: number,
        height: number,
        x: number,
        y: number,
    }
    let water: water;

    // Enemy variables
    interface enemy {
        height: number,
        width: number,
        x: number,
        y: number,
        speedX: number,
        speedY: number,
        hue: number
    }
    let enemy: enemy;

    let currentIndex: number;
    let inactiveEnemies: enemy[] = [];
    let activeEnemies: enemy[] = [];

    const checkCollision = (rect1: enemy | water | p4, rect2: enemy | water | p4): boolean => {
        return rect1.x + rect1.width > rect2.x &&
            rect1.x < rect2.x + rect2.width &&
            rect1.y + rect1.height > rect2.y &&
            rect1.y < rect2.y + rect2.height;
    }

    // Adding audio
    // var hitSound = {};

    const load = (): void => {
        // hitSound = new Audio();
        // hitSound.src = "./dist/assets/hit-sound.wav";

        const gap = 10;
        const hitBoxAdjust = 15;

        // Player Object
        p4 = {
            startX: gap,
            startY: (canvas.height / 2),
            x: gap,
            y: (canvas.height / 2),
            speed: 10,
            width: sprites.p4.width - hitBoxAdjust,
            height: sprites.p4.height - hitBoxAdjust,
            totalWater: 0,
            isMovingRight: false,
            isMovingLeft: false,
            isMovingUp: false,
            isMovingDown: false
        }

        // Water Object
        water = {
            width: sprites.water.width - hitBoxAdjust,
            height: sprites.water.height - hitBoxAdjust,
            x: canvas.width - sprites.water.width - gap,
            y: p4.y - p4.height / 4
        }

        // Enemy Object and Array
        for (var i = 0; i < 500; i++) {
            enemy = {
                width: sprites.enemy.width - hitBoxAdjust,
                height: sprites.enemy.height - hitBoxAdjust,
                x: getRandomX(sprites.enemy.width),
                y: getRandomY(sprites.enemy.height),
                speedX: 0,
                speedY: 0,
                hue: getRandomInt(0, 360)
            }

            // Check if first enemy is spawned on top of player
            if(i == 0) {
                while((enemy.x >= p4.x - gap && enemy.x <= p4.x + p4.width + gap) 
                || (enemy.y >= p4.y - gap && enemy.y <= p4.y + p4.height + gap)) {
                    enemy.x = getRandomX(sprites.enemy.width);
                    enemy.y = getRandomY(sprites.enemy.height);
                }
            }

            if (getRandomBoolean()) {
                enemy.speedX = (Math.random() * 5) + 3;
                enemy.speedY = 0;
            }
            else {
                enemy.speedY = (Math.random() * 5) + 3;
                enemy.speedX = 0;
            }

            inactiveEnemies.push(enemy);
        }

        currentIndex = inactiveEnemies.length - 1;

        activeEnemies.push(inactiveEnemies[currentIndex]);
    }

    const update = (): void => {
        // Update player (p4)
        if (p4.isMovingRight) {
            p4.x += p4.speed;
        }
        if (p4.isMovingLeft) {
            p4.x -= p4.speed;
        }
        if (p4.isMovingUp) {
            p4.y -= p4.speed;
        }
        if (p4.isMovingDown) {
            p4.y += p4.speed;
        }

        // World bounds
        if (p4.x + p4.width > canvas.width) {
            p4.x -= p4.speed;
        }
        if (p4.x < 0) {
            p4.x += p4.speed;
        }

        if (p4.y + p4.height > canvas.height) {
            p4.y -= p4.speed;
        }
        if (p4.y < 0) {
            p4.y += p4.speed;
        }

        // Update water
        if (checkCollision(p4, water)) {
            water.x = getRandomX(water.width);
            water.y = getRandomY(water.height);

            p4.totalWater += 10;

            currentIndex--;
            activeEnemies.push(inactiveEnemies[currentIndex]);
        }

        // Update enemies
        activeEnemies.forEach(function (enemy) {

            if (checkCollision(p4, enemy)) {

                // Load sound
                // hitSound.load();
                // Play sound
                // hitSound.play();

                // Stop game
                gameLive = false;
            }

            enemy.y += enemy.speedY;
            enemy.x += enemy.speedX;

            if (enemy.y + enemy.height >= CANVAS_HEIGHT - 3 || enemy.y <= 5) {
                enemy.speedY *= -1;
                enemy.hue = getRandomInt(0, 360);
            }
            if (enemy.x + enemy.width >= CANVAS_WIDTH - 3 || enemy.x <= 5) {
                enemy.speedX *= -1;
                enemy.hue = getRandomInt(0, 360);
            }
        });
    }

    class Particle {
        private effect: Effect;
        private x: number;
        private y: number;
        private radius: number;

        constructor(effect: Effect) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.radius = Math.random() + 1;
        }
        
        draw(context: CanvasRenderingContext2D) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();            
        }

        update() {
            this.x += Math.random() * .4 - .2;
            this.y += Math.random() * .4 - .2;
            this.radius += Math.random() * .2 - .1;
            if (this.radius < 0) {
                this.radius *= -1;
            }
            else if (this.radius > 3) {
                this.radius -= 0.5;
            }
        }
    }

    class Effect {
        public width: number;
        public height: number;
        private canvas: HTMLCanvasElement;
        private particles: Particle[] = [];
        private numberOfParticles: number;

        public handleParticles(context: CanvasRenderingContext2D): void {
            this.particles.forEach((particle: Particle) => {
                particle.draw(context);
                particle.update();
            });
        }

        private createParticles(): void {
            for (let i = 0; i < this.numberOfParticles; i++) {
                this.particles.push(new Particle(this));
            }
        }

        constructor(canvas: HTMLCanvasElement) {
            this.width = canvas.width;
            this.height = canvas.height;
            this.canvas = canvas;
            this.particles = [];
            this.numberOfParticles = 80;    
            this.createParticles();
        }
    }
    const effect = new Effect(canvas);

    const draw = (): void => {
        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = 'white';
        effect.handleParticles(ctx);

        // Draw player (p4)
        ctx.drawImage(sprites.p4, p4.x, p4.y);

        // Draw water
        ctx.drawImage(sprites.water, water.x, water.y);

        // Draw enemies
        activeEnemies.forEach(function (enemy) {
            ctx.filter = `sepia(100%) saturate(600%) hue-rotate(${enemy.hue}deg)`;
            ctx.drawImage(sprites.enemy, enemy.x, enemy.y);
            ctx.filter = "none";
        });

        if (!gameLive) {

            // Display message
            ctx.font = "50px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
            ctx.fillStyle = "cyan";
            ctx.fillText("Total Water: " + p4.totalWater, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        }
    }

    const step = (): void => {
        if (gameLive) {
            update();
            draw();
            window.requestAnimationFrame(step);
        }
    }

    load();
    step();

    const reload = (): void => {
        gameLive = true;
            p4.totalWater = 0;
            inactiveEnemies = [];
            activeEnemies = [];
            load();
            step();
    }
    window.addEventListener("keydown", function (e: KeyboardEvent): void {
        if ((e.key === " " || e.key === "Spacebar") && !gameLive) {
            reload();
        }
    });
}