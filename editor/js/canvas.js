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
  if (!state.isDrawing) return; // Prevent double-saves

  state.isDrawing = false;
  ctx.closePath();

  // Reset canvas properties to prevent affecting history snapshots
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#000000";

  saveToHistory(); // Save this stroke to history
}

// Save current canvas state to history (like a photo for undo/redo)
export function saveToHistory() {
  // Remove any "future" steps if we drew after undoing
  state.history = state.history.slice(0, state.historyStep + 1);

  // Take a photo of the canvas right now
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  state.history.push(imageData);

  // Move bookmark to the newest photo
  state.historyStep = state.history.length - 1;

  // Don't keep more photos than maxHistorySteps (memory management)
  if (state.history.length > state.maxHistorySteps) {
    state.history.shift(); // Delete the oldest photo
    state.historyStep--;
  }
}

// Go back one step (undo)
export function undo() {
  // Can't undo if we're already at the first step
  if (state.historyStep <= 0) return;

  state.historyStep--;
  const imageData = state.history[state.historyStep];
  ctx.putImageData(imageData, 0, 0); // Paste the old photo
  console.log(`Undo: step ${state.historyStep}`);
}

// Go forward one step (redo)
export function redo() {
  // Can't redo if we're at the end
  if (state.historyStep >= state.history.length - 1) return;

  state.historyStep++;
  const imageData = state.history[state.historyStep];
  ctx.putImageData(imageData, 0, 0); // Paste the photo from the future
  console.log(`Redo: step ${state.historyStep}`);
}

// Initialize canvas dimensions
export function initializeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Save the blank canvas as the first history state so users can undo to it
  saveToHistory();
}

// Clear the entire canvas
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
