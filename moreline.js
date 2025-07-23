const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.clientWidth; //to compensate for my 30 vh or else shape will not be circular
  canvas.height = window.innerHeight; //no need to change this, already set to 100vh
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 4,
  color: "hsla(156, 92%, 61%, 1.00)",
  health: 1,
};

let hubs = [];
function spawnHub() {
  hubs.push({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.floor(Math.random() * 10) + 5, //random radius from 5 to 14
    color: `hsla(${Math.floor(Math.random() * 360) + 1},${
      Math.floor(Math.random() * 100) + 1
    }%,${Math.floor(Math.random() * 100) + 1}%)`,
  });
}
setInterval(spawnHub, Math.random() * 2000); //

const img = new Image();
img.src = "backe.jpeg";

let y = 0;
function drawupscroll() {
  y += 4;
  if (y >= canvas.height) y = 0;

  ctx.drawImage(img, 0, y - canvas.height, canvas.width, canvas.height); //y- is important so that the image dosent just superimpose on top of each other
  ctx.drawImage(img, 0, y, canvas.width, canvas.height);
}

function drawplayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawhubs() {
  hubs.forEach((hub) => {
    ctx.fillStyle = hub.color;
    ctx.beginPath();
    ctx.arc(hub.x, hub.y, hub.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function movehubs() {
  hubs.forEach((hub) => (hub.y += 4));
  hubs = hubs.filter((hub) => hub.y < canvas.height + 20);
}
function collision() {
  for (let hub of hubs) {
    let dx = player.x - hub.x;
    let dy = player.y - hub.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < player.size + hub.r) {
      gameOver();
      break;
    }
  }
}

function animate() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawupscroll();
  movehubs();
  drawhubs();
  drawplayer();
  collision();
  requestAnimationFrame(animate);
}
document.getElementById("resetButton").addEventListener("click", () => {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  attachedHub = null;
  angle = 0;
  hubs = [];
  y = 0;
});

let gameRunning = true;

function gameOver() {
  gameRunning = false;
  ctx.fillStyle = "LightBlue";
  ctx.font = "bold 70px fantasy",
  ctx.fillText("GAME OVER", canvas.width / 2-150, canvas.height / 2);
}

// Start when image loads
gameRunning = true;
img.onload = animate;
