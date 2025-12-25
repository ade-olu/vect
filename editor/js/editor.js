import { initializeCanvas, setupCanvasDrawing } from "./canvas.js"; // Import canvas initialization function
import { setupToolListeners } from "./tools.js"; // Import tool setup function

document.addEventListener("DOMContentLoaded", () => {
  initializeCanvas(); // Set initial canvas size
  setupToolListeners(); // Attach tool selection listeners and set default tool
  setupCanvasDrawing(); // Activate canvas drawing event listeners
});
