export default class Bullet{
    constructor(x, y, radius, rot, speed, damage){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rot = rot;
        this.speed = speed;
        this.damage = damage;
        this.color = "rgb(200, 200, 200)";
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        let velocityX = Math.cos(this.rot) * this.speed;
        let velocityY = Math.sin(this.rot) * this.speed;
        this.x += velocityX;
        this.y += velocityY;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    collideWith(sprite){
        if (this.x < sprite.x + sprite.width &&
            this.x + (this.radius * 2.0) > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + (this.radius * 2.0) > sprite.y
        ){
            sprite.takeDamage(this.damage);
            return true;
        }
        return false;
    }
}