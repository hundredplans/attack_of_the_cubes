import Enemy from "./enemy.js";
import EnemyType from "./enemy_type.js";

export default class EnemyController{
    points = 0;
    enemies = [];
    time_till_next_enemy = 0;
    start_spawn_delay = 40;
    spawn_delay = 40;
    spawn_delay_decrease_amount = 2; // How much to decrease spawn delay by
    spawn_amount_decrease_delay_default = 8; // How many units to decrease spawn delay
    spawn_delay_minimum = 3;

    constructor(canvas, bullet_controller, player){
        this.canvas = canvas;
        this.bullet_controller = bullet_controller;
        this.player = player;
        this.player.setEnemyController(this);
        this.x_spawn_range = [[-100, 0], [this.canvas.width, this.canvas.width + 100]];
        this.y_spawn_range = [[-100, 0], [this.canvas.height, this.canvas.height + 100]];
        this.points = 0;
        this.enemy_types = [ // Health, Size, Speed
            new EnemyType(6, 50, 4),
            new EnemyType(3, 20, 6),
            new EnemyType(10, 80, 2),
            new EnemyType(1, 30, 10),
            new EnemyType(25, 100, 1)
        ]
    }

    draw(ctx){
        for (let i = this.enemies.length - 1; i >= 0; i--){ 
            let enemy = this.enemies[i];
            if (this.bullet_controller.collideWith(enemy)){
                if (enemy.health <= 0){
                    const index = this.enemies.indexOf(enemy);
                    this.enemies.splice(index, 1);
                    this.points += 1;
                    continue;
                }
            }

            enemy.draw(ctx);
            enemy.onMoveToPlayer(this.player);
        }

        if (this.time_till_next_enemy === 0){
            this.time_till_next_enemy = this.spawn_delay;
            this.spawn_amount_decrease_delay--;
            if (this.spawn_amount_decrease_delay === 0){
                this.spawn_amount_decrease_delay = this.spawn_amount_decrease_delay_default;
                this.spawn_delay = Math.max(this.spawn_delay_minimum, this.spawn_delay - this.spawn_delay_decrease_amount);
            }
            this.onSpawnEnemy();
        }

        this.spawn_delay_decrease_delay
        this.time_till_next_enemy--;

        ctx.shadowColor = "black";
        let points_margin = 10;
        ctx.fillStyle = "white";
        ctx.font = "24px Roboto";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";

        ctx.fillText("Points: " + this.points, this.canvas.width - points_margin, points_margin);

        let usernameMargin = 40;
        ctx.fillText(this.username, this.canvas.width - points_margin, usernameMargin);
    }

    setUsername(username){
        this.username = username;
    }

    onCleanUp(){
        this.spawn_delay = this.start_spawn_delay;
        this.time_till_next_enemy = 0;
        this.spawn_amount_decrease_delay = this.spawn_amount_decrease_delay_default;
        this.points = 0;
        this.enemies = [];
    }

    onSpawnEnemy(){
        const x_range_index = Math.floor(Math.random() * 2);
        const y_range_index = Math.floor(Math.random() * 2);

        const minX = this.x_spawn_range[x_range_index][0];
        const maxX = this.x_spawn_range[x_range_index][1];

        const minY = this.y_spawn_range[y_range_index][0];
        const maxY = this.y_spawn_range[y_range_index][1];

        const x = Math.floor(minX + Math.random() * (maxX - minX + 1));
        const y = Math.floor(minY + Math.random() * (maxY - minY + 1));

        const index = Math.floor(Math.random() * this.enemy_types.length);
        let enemy_type = this.enemy_types[index];
        const health = enemy_type.health;
        const width = enemy_type.size;
        const height = enemy_type.size;
        const speed = enemy_type.speed;

        let enemy = new Enemy(x, y, health, width, height, speed);
        this.enemies.push(enemy);
    }    
}