import Player from "./player.js";
import BulletController from "./bullet_controller.js";
import EnemyController from "./enemy_controller.js";
import MainMenu from "./main_menu.js";

const server_path = "https://cda5-178-73-37-217.ngrok-free.app";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const ngrok_token = "2yHCJfuflnSgQ7g0xc4PV6ZeTBT_6TjpDHdKtHFJoiUW79HSd";

canvas.width = 800;
canvas.height = 600;

const bullet_controller  = new BulletController(canvas);
const player = new Player(canvas.width / 2.2, canvas.height / 1.3, bullet_controller, isGameFinished, canvas);
const enemy_controller = new EnemyController(canvas, bullet_controller, player);
const main_menu = new MainMenu(canvas, isPlayButtonPressed);

let is_in_main_menu = true;

document.addEventListener('DOMContentLoaded', onPageLoaded);
window.addEventListener('resize', onUpdateOverlayPosition);

function gameLoop(){
    setCommonStyle();
    
    if (!is_in_main_menu){
        player.draw(ctx);
        enemy_controller.draw(ctx);
    }
    else {
        main_menu.draw(ctx);
    }
}

function setCommonStyle(){
    ctx.shadowColor = "white";
    ctx.shadowBlur = 20;
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 5;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function isPlayButtonPressed(){
    if (!is_in_main_menu) {return;}
    is_in_main_menu = false;
    enemy_controller.onCleanUp();
    bullet_controller.onCleanUp();
    player.onCleanUp(canvas.width / 2.2, canvas.height / 2.2);
    
    let username = document.getElementById("playernameInput").value;
    player.setUsername(username);
    enemy_controller.setUsername(username);
    document.getElementById("playernameInput").style.display = 'none';
    document.getElementById("leaderboard").style.display = 'none';
    document.getElementById("tutorial").style.display = 'none';
}

function isGameFinished(username, points){
    is_in_main_menu = true;
    enemy_controller.onCleanUp();
    bullet_controller.onCleanUp();
    main_menu.setRecentPoints(points);
    main_menu.setUsername(username);
    player.onCleanUp(canvas.width / 2.2, canvas.height / 2.2);
    document.getElementById("playernameInput").style.display = 'block';
    document.getElementById("leaderboard").style.display = 'block';
    document.getElementById("tutorial").style.display = 'block';

    onWriteToLeaderboard(username, points)
    setTimeout(function(){onReadFromLeaderboard()}, 1000);
}

function onUpdateOverlayPosition(){
    const rect = canvas.getBoundingClientRect();
    console.log(rect.x);

    let playernameInput = document.getElementById("playernameInput");
    playernameInput.style.left = rect.x + 327 + "px";
    playernameInput.style.top = rect.y + 320 + "px";

    let leaderboard = document.getElementById("leaderboard");
    leaderboard.style.left = rect.x + 10 + "px";
    leaderboard.style.top = rect.y + "px";

    let tutorial = document.getElementById("tutorial");
    tutorial.style.left = rect.x - 48 + "px";
    tutorial.style.top = rect.y + 440 + "px";
}

function onPageLoaded(){
    onReadFromLeaderboard();
    onUpdateOverlayPosition();
}

async function onWriteToLeaderboard(username, points){
    let headers = {
        'Authorization': `Bearer ${ngrok_token}`,
        'ngrok-skip-browser-warning': 'any',
        'content-type': "application/json"
    }

    let json_val = JSON.stringify({"name": username, "points": points});
    await fetch(server_path + "/leaderboard", {
        method: 'POST',
        headers: headers,
        body: json_val
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }
        return response.text();
    })
    .then(response_text => {
        console.log(response_text);
    })
    .catch(error => {
        console.error("Error: ", error);
    })
}

async function onReadFromLeaderboard(){
    let leaderboard_data = {};
    let headers = {
        'Authorization': `Bearer ${ngrok_token}`,
        'ngrok-skip-browser-warning': 'any'
    }

    await fetch(server_path + "/leaderboard", {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        leaderboard_data = data.data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    let rows = document.getElementById('leaderboard').tBodies[0].rows;
    console.log(leaderboard_data);
    for (let i = 0; i < leaderboard_data.length; i++){
        let name = leaderboard_data[i].name;
        let points = leaderboard_data[i].points;
        
        let name_td = rows[i].cells[0];
        let points_td = rows[i].cells[1];

        name_td.textContent = name;
        points_td.textContent = points;
        console.log(name, points)
    }
}

setInterval(gameLoop, 1000 / 60); // 60 FPS
