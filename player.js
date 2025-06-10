export default class Player {
    constructor(x, y, bulletController, is_game_finished, canvas){
        this.x = x;
        this.y = y;
        this.is_game_finished = is_game_finished;
        this.bulletController = bulletController;
        this.width = 50;
        this.height = 50;
        this.speed = 8;
        this.mouse = {x:0,y:0};
        this.canvas = canvas;

        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    }

    onCleanUp(new_x, new_y){
        this.x = new_x;
        this.y = new_y;
    }

    setUsername(username){
        this.username = username;
    }

    setEnemyController(enemy_controller){
        this.enemy_controller = enemy_controller;
    }

    draw(ctx){
        this.move();
        ctx.shadowColor = "green";
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.bulletController.draw(ctx);
        this.shoot();

        if (this.enemy_controller.enemies.some(this.collideWith)){
            this.is_game_finished(this.username, this.enemy_controller.points);
        }
    }

    collideWith = (sprite) => {
        if (this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        ){
            return true;
        }
        return false;
    }

    shoot(){
        if (this.shootPressed){
            const bulletSpeed = 15;
            const bulletDelay = 3;
            const bulletDamage = 1;
            const bulletX = this.x + (this.width / 2);
            const bulletY = this.y + (this.height / 2);
            const bulletRadius = 5;
            const bulletRot = Math.atan2(this.mouse.y - (bulletY + (bulletRadius * 2)), this.mouse.x - (bulletX + (bulletRadius * 2)));
            this.bulletController.shoot(bulletX, bulletY, bulletRadius, bulletRot, bulletSpeed, bulletDamage, bulletDelay);
        }
    }

    move(){
        if (this.downPressed) {
            this.y += this.speed;
        }

        if (this.upPressed) {
            this.y -= this.speed;
        }

        if (this.leftPressed) {
            this.x -= this.speed;
        }

        if (this.rightPressed){
            this.x += this.speed;
        }

        if (this.x < 0){
            this.x = 0;
        }

        if (this.y < 0){
            this.y = 0;
        }

        if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }

        if (this.y + this.height > this.canvas.height){
            this.y = this.canvas.height - this.height;
        }
    }

    keydown = (e) =>{
        if (e.code == "ArrowDown" || e.code == "KeyS"){
            this.downPressed = true;
        }

        if (e.code == "ArrowUp" || e.code == "KeyW"){
            this.upPressed = true;
        }

        if (e.code == "ArrowLeft" || e.code == "KeyA"){
            this.leftPressed = true;
        }

        if (e.code == "ArrowRight" || e.code == "KeyD"){
            this.rightPressed = true;
        }

        if (e.code == "Space"){
            this.shootPressed = true;
        }
    }

    keyup = (e) =>{
        if (e.code == "ArrowDown" || e.code == "KeyS"){
            this.downPressed = false;
        }

        if (e.code == "ArrowUp" || e.code == "KeyW"){
            this.upPressed = false;
        }

        if (e.code == "ArrowLeft" || e.code == "KeyA"){
            this.leftPressed = false;
        }

        if (e.code == "ArrowRight" || e.code == "KeyD"){
            this.rightPressed = false;
        }

        if (e.code == "Space"){
            this.shootPressed = false;
        }
    }

    onMouseUp = (event) => {
        if (event.button == 0){
            this.shootPressed = false;
        }
    }

    onMouseDown = (event) => {
        if (event.button == 0){
            this.shootPressed = true;
        }
    }

    onMouseMove = (event) => {
        const rect = document.getElementById('game').getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }

    getCenterX(){
        return this.x + (this.width / 2.0);
    }
    
    getCenterY(){
        return this.y + (this.height / 2.0);
    }
}