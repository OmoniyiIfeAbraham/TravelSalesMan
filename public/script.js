const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a grid
const gridData = d3.range(0, Math.max(innerWidth, innerHeight), 20);
g.append("g")
  .attr("class", "grid")
  .selectAll("line")
  .data(gridData)
  .enter()
  .append("line")
  .attr("x1", (d) => d)
  .attr("y1", 0)
  .attr("x2", (d) => d)
  .attr("y2", innerHeight)
  .attr("stroke", "#ddd")
  .attr("stroke-opacity", 0.8)
  .attr("stroke-width", 1);

g.append("g")
  .attr("class", "grid")
  .selectAll("line")
  .data(gridData)
  .enter()
  .append("line")
  .attr("x1", 0)
  .attr("y1", (d) => d)
  .attr("x2", innerWidth)
  .attr("y2", (d) => d)
  .attr("stroke", "#ddd")
  .attr("stroke-opacity", 0.8)
  .attr("stroke-width", 1);

let points = [];

svg.on("click", function (event) {
  const coords = d3.pointer(event);
  const point = {
    id: points.length,
    x: coords[0] - margin.left,
    y: coords[1] - margin.top,
  };
  points.push(point);
  drawGraph();
});

document
  .getElementById("startAlgorithm")
  .addEventListener("click", startAlgorithm);

function drawGraph() {
  g.selectAll(".point").remove();
  g.selectAll(".label").remove();
  g.selectAll(".path").remove();

  g.selectAll("circle")
    .data(points)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 5)
    .attr("fill", (d, i) => (i === 0 ? "red" : "black"));

  g.selectAll("text")
    .data(points)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => d.x + 10)
    .attr("y", (d) => d.y)
    .text((d) => d.id);
}

async function startAlgorithm() {
  if (points.length < 2) return;
  let unvisited = [...points];
  let path = [];
  let current = unvisited.shift();
  path.push(current);

  while (unvisited.length > 0) {
    let nearest = findNearestNeighbor(current, unvisited);
    path.push(nearest);
    unvisited = unvisited.filter((p) => p.id !== nearest.id);
    current = nearest;
    drawPath(path);
    await sleep(1000); // Wait for 1 second before drawing the next step
  }

  // Return to the starting point
  path.push(points[0]);
  drawPath(path);

  document.querySelector(
    ".result"
  ).innerHTML = `Path: <span class="path-array">[${path
    .map((p) => p.id)
    .join(", ")}]</span>`;
}

function findNearestNeighbor(current, unvisited) {
  let nearest = null;
  let minDist = Infinity;
  unvisited.forEach((p) => {
    let dist = Math.sqrt(
      Math.pow(p.x - current.x, 2) + Math.pow(p.y - current.y, 2)
    );
    if (dist < minDist) {
      nearest = p;
      minDist = dist;
    }
  });
  return nearest;
}

function drawPath(path) {
  g.selectAll(".path").remove();
  for (let i = 0; i < path.length - 1; i++) {
    g.append("line")
      .attr("class", "path")
      .attr("x1", path[i].x)
      .attr("y1", path[i].y)
      .attr("x2", path[i + 1].x)
      .attr("y2", path[i + 1].y)
      .attr("stroke", "blue")
      .attr("stroke-width", 2);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
