const canvas = document.getElementById("trajectoryCanvas");
const canvasContext = canvas.getContext("2d");

function drawGrid() {
  canvasContext.strokeStyle = "#ddd";
  canvasContext.lineWidth = 0.5;
  canvasContext.font = "12px font-size";
  canvasContext.fillStyle = "#555";

  for (let x = 0; x <= canvas.width; x += 50) {
    canvasContext.beginPath();
    canvasContext.moveTo(x, 0);
    canvasContext.lineTo(x, canvas.height);
    canvasContext.stroke();
    canvasContext.fillText(x, x + 2, canvas.height - 2);
  }

  for (let y = 0; y <= canvas.height; y += 50) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);
    canvasContext.lineTo(canvas.width, y);
    canvasContext.stroke();
    canvasContext.fillText(canvas.height - y, 2, y - 2);
  }
}

function drawTrajectory() {
  const x0 = Number.parseFloat(document.getElementById("x0").value);
  const y0 = Number.parseFloat(document.getElementById("y0").value);
  const angle = Number.parseFloat(document.getElementById("angle").value);
  const speed = Number.parseFloat(document.getElementById("speed").value);
  const acceleration = Number.parseFloat(
    document.getElementById("acceleration").value
  );
  const color = document.getElementById("color").value;
  const angleRad = (angle * Math.PI) / 180;
  const dirX = Math.cos(angleRad);
  const dirY = Math.sin(angleRad);

  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 2;

  canvasContext.beginPath();

  const startX = x0;
  const startY = canvas.height - y0;
  
  canvasContext.moveTo(startX, startY);

  let t = 0;
  const dt = 0.1;
  const maxTime = 10;

  while (t <= maxTime) {
    const s = speed * t + 0.5 * acceleration * t * t;
    const physX = x0 + dirX * s;
    const physY = y0 + dirY * s;
    const canvasX = physX;
    const canvasY = canvas.height - physY;

    canvasContext.fillStyle = color;

    canvasContext.beginPath();
    canvasContext.arc(canvasX, canvasY, 2, 0, 2 * Math.PI);
    canvasContext.fill();

    if (canvasX < 0 ||
      canvasX > canvas.width ||
      canvasY < 0 ||
      canvasY > canvas.height
    ) {
      break;
    }
    t += dt;
  }
  canvasContext.stroke();
}

document.getElementById("drawButton").addEventListener("click", drawTrajectory);
document.getElementById("clearButton").addEventListener("click", () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
});

drawGrid();