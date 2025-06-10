export default class Enemy{
    max_health = 25;
    constructor(x, y, health, width, height, speed){
        this.x = x;
        this.y = y;
        this.health = health;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.onCalculateColor();
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        if (this.health > 0){
            ctx.strokeStyle = "white";
        }

        else {
            ctx.strokeStyle = this.color;
        }

        ctx.shadowColor="red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    takeDamage(damage){
        this.health -= damage;
        this.onCalculateColor();
    }

    onCalculateColor(){
        const t = this.health / this.max_health;
        const g = Math.round(255 * t);
        const r = Math.round(255 * (1 - t));
        const b = 0;                        
        this.color = `rgb(${r}, ${g}, ${b})`;
    }

    onMoveToPlayer(player){
        const rot = Math.atan2(player.getCenterY() - this.getCenterY(), player.getCenterX() - this.getCenterX());
        let velocityX = Math.cos(rot) * this.speed;
        let velocityY = Math.sin(rot) * this.speed;

        this.x += velocityX;
        this.y += velocityY;
    }

    getCenterX(){
        return this.x + (this.width / 2.0);
    }
    
    getCenterY(){
        return this.y + (this.height / 2.0);
    }
}