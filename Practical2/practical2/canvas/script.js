const canvas = document.getElementById("trajectorySvg");
const canvasContext = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.bottom - margin.top;

function xScale(x) {
  return margin.left + (x / 400) * innerWidth;
}
function yScale(y) {
  return margin.top + innerHeight - (y / 100) * innerHeight;
}

function drawAxes() {
  canvasContext.strokeStyle = "#000";
  canvasContext.lineWidth = 1;
  canvasContext.font = "12px text-anchor";
  canvasContext.fillStyle = "#000";

  canvasContext.beginPath();
  canvasContext.moveTo(margin.left, margin.top + innerHeight);
  canvasContext.lineTo(margin.left + innerWidth, margin.top + innerHeight);
  canvasContext.stroke();

  for (let x = 0; x <= 400; x += 50) {
    const px = xScale(x);
    canvasContext.beginPath();
    canvasContext.moveTo(px, margin.top + innerHeight);
    canvasContext.lineTo(px, margin.top + innerHeight + 5);
    canvasContext.stroke();
    canvasContext.textAlign = "center";
    canvasContext.fillText(x, px, margin.top + innerHeight + 20);
  }
  canvasContext.fillText("Відстань (м)", innerWidth + 20, height - 5);

  canvasContext.beginPath();
  canvasContext.moveTo(margin.left, margin.top);
  canvasContext.lineTo(margin.left, margin.top + innerHeight);
  canvasContext.stroke();

  for (let y = 0; y <= 100; y += 10) {
    const py = yScale(y);
    canvasContext.beginPath();
    canvasContext.moveTo(margin.left - 5, py);
    canvasContext.lineTo(margin.left, py);
    canvasContext.stroke();
    canvasContext.textAlign = "right";
    canvasContext.fillText(y, margin.left - 10, py + 3);
  }

  canvasContext.save();
  canvasContext.translate(15, margin.top);
  canvasContext.rotate(-Math.PI / 2);
  canvasContext.fillText("Висота (м)", 0, 0);
  canvasContext.restore();
}

function drawTrajectory(data) {
  canvasContext.strokeStyle = "blue";
  canvasContext.lineWidth = 2;
  
  canvasContext.beginPath();
  data.forEach((point, i) => {
    const px = xScale(point.x);
    const py = yScale(point.y);
    if (i === 0) {
      canvasContext.moveTo(px, py);
    } else {
      canvasContext.lineTo(px, py);
    }
  });
  canvasContext.stroke();
}

function updateChart() {
  const v0 = Number.parseFloat(document.getElementById("v0").value);
  const angle = Number.parseFloat(document.getElementById("angle").value);
  const g = Number.parseFloat(document.getElementById("g").value);
  const theta = (angle * Math.PI) / 180;

  const tTotal = (2 * v0 * Math.sin(theta)) / g;

  const range = v0 * Math.cos(theta) * tTotal;

  const maxHeight = (v0 * Math.sin(theta)) ** 2 / (2 * g);

  document.getElementById("result-container").classList.remove("hidden");
  document.getElementById(
    "flightTime"
  ).textContent = `Час польоту: ${tTotal.toFixed(2)} с`;
  document.getElementById(
    "range"
  ).textContent = `Дальність польоту: ${range.toFixed(2)} м`;
  document.getElementById(
    "maxHeight"
  ).textContent = `Максимальна висота підняття: ${maxHeight.toFixed(2)} м`;

  const numPoints = 50;
  const dt = tTotal / numPoints;
  const data = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i * dt;

    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;

    data.push({ x: x, y: y });
  }

  canvasContext.clearRect(0, 0, width, height);

  drawAxes();

  drawTrajectory(data);
}

drawAxes();

document.getElementById("updateBtn").addEventListener("click", updateChart);
