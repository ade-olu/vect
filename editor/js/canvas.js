// Import the necessary variables from variables.js
import { canvas, ctx, state, toolConfig } from "./variables.js";
import { drawLine } from "./tools/draw-line.js";
import { drawAirbrush } from "./tools/airbrush.js";
import { drawEraser } from "./tools/eraser.js";

// Get touch coordinates relative to the canvas
function getTouchPos(touchEvent) {
  const rect = canvas.getBoundingClientRect();
  const touch = touchEvent.touches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

// Setup canvas drawing event listeners for all tools
export function setupCanvasDrawing() {
  // Mouse events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  // Touch events
  canvas.addEventListener("touchstart", startTouchDrawing, { passive: false });
  canvas.addEventListener("touchmove", drawTouch, { passive: false });
  canvas.addEventListener("touchend", stopDrawing);
  canvas.addEventListener("touchcancel", stopDrawing);
}

// Mouse drawing handlers
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

// Touch drawing handlers
// Start drawing on touchstart
function startTouchDrawing(e) {
  e.preventDefault(); // prevent scrolling
  const pos = getTouchPos(e);

  state.isDrawing = true;
  state.lastX = pos.x;
  state.lastY = pos.y;

  ctx.beginPath();
  ctx.moveTo(state.lastX, state.lastY);
}

// Draw on touchmove based on current tool
function drawTouch(e) {
  if (!state.isDrawing) return;
  e.preventDefault(); // prevent scrolling

  const pos = getTouchPos(e);

  ctx.strokeStyle = state.color;
  ctx.lineWidth = state.strokeSize;
  ctx.globalAlpha = state.opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (state.currentTool) {
    case "pencil":
    case "brush":
    case "marker":
      drawLine({ offsetX: pos.x, offsetY: pos.y }); // Reuse existing function
      break;
    case "airbrush":
      drawAirbrush({ offsetX: pos.x, offsetY: pos.y });
      break;
    case "eraser":
      drawEraser({ offsetX: pos.x, offsetY: pos.y });
      break;
  }

  state.lastX = pos.x;
  state.lastY = pos.y;
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

// Save the current canvas as an image file
export function saveCanvas() {
  // Ensure the last stroke is saved
  if (state.isDrawing) {
    state.isDrawing = false;
    ctx.closePath();
  }

  const tempCanvas = document.createElement("canvas"); // Temporary canvas
  // Set sizes to match main canvas
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d"); // Get context

  // Fill white background
  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.drawImage(canvas, 0, 0); // Draw the current canvas on top

  const dataURL = tempCanvas.toDataURL("image/png"); // Convert to PNG

  // Download
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "drawing.png";
  link.click();
}
