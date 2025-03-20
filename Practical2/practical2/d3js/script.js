const svg = d3.select("#trajectorySvg");
const width = Number.parseFloat(svg.attr("width"));
const height = Number.parseFloat(svg.attr("height"));

const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.bottom - margin.top; 

const svgElemGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear().domain([0, 400]).range([0, innerWidth]);
const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

const axisX = d3.axisBottom(xScale);
const axisY = d3.axisLeft(yScale);

const axisXGroup = svgElemGroup
  .append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .attr("class", "axis")
  .call(axisX);
const axisYGroup = svgElemGroup.append("g").attr("class", "axis").call(axisY);

axisXGroup
  .append("text")
  .attr("x", innerWidth - 20)
  .attr("y", 35)
  .attr("fill", "#000")
  .attr("text-anchor", "middle")
  .text("Відстань (м)");

axisYGroup
  .append("text")
  .attr("x", -20)
  .attr("y", -35)
  .attr("text-anchor", "middle")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .text("Висота (м)");

const lineGenerator = d3
  .line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));

const path = svgElemGroup.append("path").attr("class", "line");

function updateChart() {
  const v0 = Number.parseFloat(document.getElementById("v0").value);
  const angle = Number.parseFloat(document.getElementById("angle").value);
  const g = Number.parseFloat(document.getElementById("g").value);

  const theta = (angle * Math.PI) / 180;

  const tTotal = (2 * v0 * Math.sin(theta)) / g;

  const numPoints = 50;
  const dt = tTotal / numPoints;
  const data = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i * dt;
    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
    data.push({ x: x, y: y });
  }

  path.datum(data).attr("d", lineGenerator);
}

document.getElementById("updateBtn").addEventListener("click", updateChart);