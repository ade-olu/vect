import { ctx, state } from "../variables.js"; // Import canvas context and state

// Eraser: removes pixels instead of coloring them
export function drawEraser(e) {
  // Temporarily switch to 'erase' mode
  ctx.save();
  ctx.globalCompositeOperation = "destination-out"; // Makes strokes erase

  // Set eraser properties
  ctx.lineWidth = state.strokeSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Erase along the path as the mouse moves
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  // Go back to normal drawing mode
  ctx.restore();
}
