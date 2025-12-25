// Import the necessary variables from variables.js
import { canvas, ctx, state, toolConfig } from "./variables.js";
import { drawLine } from "./tools/draw-line.js";
import { drawAirbrush } from "./tools/airbrush.js";
import { drawEraser } from "./tools/eraser.js";

// Setup canvas drawing event listeners for all tools
export function setupCanvasDrawing() {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);
}

// Start drawing on mousedown
function startDrawing(e) {
  state.isDrawing = true;
  state.lastX = e.offsetX;
  state.lastY = e.offsetY;

  ctx.beginPath();
  ctx.moveTo(state.lastX, state.lastY);
}

// Draw on mousemove based on current tool
function draw(e) {
  if (!state.isDrawing) return;

  // Set common drawing properties
  ctx.strokeStyle = state.color;
  ctx.lineWidth = state.strokeSize;
  ctx.globalAlpha = state.opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Handle drawing based on selected tool
  switch (state.currentTool) {
    case "pencil":
    case "brush":
    case "marker":
      drawLine(e); // Use line drawing for these tools (pencil, brush, marker)
      break;

    case "airbrush":
      drawAirbrush(e); // Special handling for airbrush
      break;

    case "eraser":
      drawEraser(e); // Erase using compositing
      break;
  }

  // Update last positions
  state.lastX = e.offsetX;
  state.lastY = e.offsetY;
}

// Stop drawing on mouseup or mouseout
function stopDrawing() {
  state.isDrawing = false;
  ctx.closePath();
}

// Initialize canvas dimensions
export function initializeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// Clear the entire canvas
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
