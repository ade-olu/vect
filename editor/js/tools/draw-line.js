import { ctx, state } from "../variables.js"; // Import necessary variables

// Draw a line based on the current tool
export function drawLine(e) {
  let x = e.offsetX;
  let y = e.offsetY;

  switch (state.currentTool) {
    case "pencil":
      // Pencil: thin, hard-edged line with subtle jitter
      // Jitter simulates graphite texture
      const jitterX = x + (Math.random() - 0.5) * 1.5; // Small horizontal noise
      const jitterY = y + (Math.random() - 0.5) * 1.5; // Small vertical noise
      ctx.lineTo(jitterX, jitterY);
      ctx.stroke();
      break;

    case "brush":
      // Brush: thicker, semi-transparent, slight jitter
      for (let i = 0; i < 2; i++) {
        const brushJitterX = x + (Math.random() - 0.5) * 2;
        const brushJitterY = y + (Math.random() - 0.5) * 2;
        ctx.lineTo(brushJitterX, brushJitterY);
        ctx.stroke();
      }
      break;

    case "marker":
      // Marker: broad, semi-transparent, slightly more jitter
      for (let i = 0; i < 3; i++) {
        const markerJitterX = x + (Math.random() - 0.5) * 4;
        const markerJitterY = y + (Math.random() - 0.5) * 4;
        ctx.lineTo(markerJitterX, markerJitterY);
        ctx.stroke();
      }
      break;
  }
}
