import { ctx, state } from "../variables.js"; // Import necessary variables

// Draw airbrush tool implementation
export function drawAirbrush(e) {
  // Simulate airbrush effect by drawing multiple small dots
  for (let i = 0; i < 50; i++) {
    // Randomize position around cursor for spray effect
    const offsetX = e.offsetX + (Math.random() - 0.5) * state.strokeSize;
    const offsetY = e.offsetY + (Math.random() - 0.5) * state.strokeSize;

    ctx.beginPath(); // Start a new path for each dot
    ctx.arc(offsetX, offsetY, 1, 0, Math.PI * 2); // Draw small circle
    ctx.fillStyle = state.color; // Set fill color
    ctx.fill(); // Fill the circle
  }
}
