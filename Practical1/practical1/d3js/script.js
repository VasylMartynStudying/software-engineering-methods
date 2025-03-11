const svg = d3.select("#trajectorySvg");
const width = Number.parseFloat(svg.attr("width"));
const height = Number.parseFloat(svg.attr("height"));

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

  const points = [];
  const startX = x0;
  const startY = height - y0;

  points.push({ x: startX, y: startY });

  const dt = 0.1;
  let t = dt;
  const maxTime = 10;

  while (t <= maxTime) {
    const s = speed * t + 0.5 * acceleration * t * t;
    const physX = x0 + dirX * s;
    const physY = y0 + dirY * s;
    const svgX = physX;
    const svgY = height - physY;

    if (svgX < 0 || svgX > width || svgY < 0 || svgY > height) {
      break;
    }

    t += dt;

    points.push({ x: svgX, y: svgY });
  }

  const lineGenerator = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  const pathData = lineGenerator(points);

  svg
    .append("path")
    .attr("d", pathData)
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("fill", "none");
}

document
  .getElementById("drawButton")
  .addEventListener("click", drawTrajectory);

document.getElementById("clearButton").addEventListener("click", () => {
  svg.selectAll("path").remove();
});

function drawGrid() {
  const svg = d3.select("#trajectorySvg");
  const width = parseFloat(svg.attr("width"));
  const height = parseFloat(svg.attr("height")); 
  const gridSize = 50; 

  for (let y = gridSize; y < height; y += gridSize) {
    svg
      .append("line") 
      .attr("x1", 0) 
      .attr("y1", y)
      .attr("x2", width) 
      .attr("y2", y) 
      .attr("stroke", "#ddd") 
      .attr("stroke-width", 1) 

    svg
      .append("text")
      .attr("x", 5) 
      .attr("y", y - 5) 
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .text(height - y);
  }

  for (let x = gridSize; x < width; x += gridSize) {
    svg
      .append("line") 
      .attr("x1", x) 
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", height)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1)

    svg
      .append("text")
      .attr("x", x + 2)
      .attr("y", height - 5)
      .attr("fill", "#555")
      .attr("font-size", "12px")
      .text(x);
  }
}

drawGrid();
