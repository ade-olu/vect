import { initializeCanvas, setupCanvasDrawing } from "./canvas.js"; // Import canvas initialization function
import { setupToolListeners, setupActionListeners } from "./tools.js"; // Import tool setup functions

document.addEventListener("DOMContentLoaded", () => {
  initializeCanvas(); // Set initial canvas size
  setupToolListeners(); // Attach tool selection listeners and set default tool
  setupActionListeners(); // Attach action button listeners (undo, redo, clear, save)
  setupCanvasDrawing(); // Activate canvas drawing event listeners
});
