export default class MainMenu {
    button_width = 205;
    button_height = 80;
    username = "";
    is_mouse_inside_play_button = false;

    constructor(canvas, on_play_button_pressed){
        this.canvas = canvas;
        this.on_play_button_pressed = on_play_button_pressed;
        this.button_x = this.canvas.width / 2.5;
        this.button_y = this.canvas.height / 3.0;
        this.recent_points = 0;
        this.canvas.addEventListener('click', (event) => {this.onScreenPressed(event);});
        this.canvas.addEventListener('mousemove', (event) => {this.onMouseMoved(event);})
    } 

    setRecentPoints(recent_points){
        this.recent_points = recent_points;
    }

    setUsername(username){
        this.username = username;
    }

    draw(ctx){
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.fillRect(this.button_x, this.button_y, this.button_width, this.button_height);

        if (!this.is_mouse_inside_play_button){
            ctx.strokeStyle = "grey";
        }
        else {
            ctx.strokeStyle = "rgb(44, 44, 44)";
        }

        ctx.strokeRect(this.button_x, this.button_y, this.button_width, this.button_height);

        ctx.shadowBlur = 20;

        if (!this.is_mouse_inside_play_button){
            ctx.fillStyle = "grey";
        }
        else {
            ctx.fillStyle = "rgb(44, 44, 44)";
        }

        ctx.font = "48px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Play", this.button_x + this.button_width / 2, this.button_y + this.button_height / 2);

        ctx.shadowColor = "black";
        let points_margin = 10;
        ctx.fillStyle = "white";
        ctx.font = "24px Roboto";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";

        ctx.fillText("Recent Points: " + this.recent_points, this.canvas.width - points_margin, points_margin);

        let usernameMargin = 40;
        ctx.fillText(this.username, this.canvas.width - points_margin, usernameMargin);
    }

    onScreenPressed(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (
            x >= this.button_x &&
            x <= this.button_x + this.button_width &&
            y >= this.button_y &&
            y <= this.button_y + this.button_height
        ) {
            this.on_play_button_pressed();
        }
    }

    onMouseMoved(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (
            x >= this.button_x &&
            x <= this.button_x + this.button_width &&
            y >= this.button_y &&
            y <= this.button_y + this.button_height
        ) {
            this.is_mouse_inside_play_button = true;
        }
        else {
            this.is_mouse_inside_play_button = false;
        }
    }
}