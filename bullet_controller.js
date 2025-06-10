import Bullet from "./bullet.js";
export default class BulletController{
    bullets = [];
    time_till_next_bullet = 0;
    constructor(canvas){
        this.canvas = canvas;
    }

    shoot(x, y, radius, rot, speed, damage, delay){
        console.log(x, y);
        if (this.time_till_next_bullet <= 0){
            this.bullets.push(new Bullet(x, y, radius, rot, speed, damage))
            this.time_till_next_bullet = delay;
        }

        this.time_till_next_bullet--;
    }

    draw(ctx){
        this.bullets.forEach((bullet) => {
            if (this.isBulletOffScreen(bullet)){
                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
            }
            bullet.draw(ctx);
        });
    }

    onCleanUp(){
        this.bullets = [];
    }

    isBulletOffScreen(bullet){
        return bullet.y + bullet.height < 0 || bullet.y > this.canvas.height || bullet.x < 0 || bullet.x + bullet.width > this.canvas.width;
    }

    collideWith(sprite){
        return this.bullets.some(bullet=>{
            if (bullet.collideWith(sprite)){
                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
                return true;
            }
            return false;
        })
    }
}