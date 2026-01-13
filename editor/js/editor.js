// Import necessary functions from canvas.js, tools.js, and color-picker.js
import {
  initializeCanvas,
  setupCanvasDrawing,
  saveToHistory,
} from "./canvas.js";
import {
  setupToolListeners,
  setupActionListeners,
  setupStyleToolListeners,
} from "./tools.js";
import { colorPickerDropdown } from "./color-picker.js";

let currentDPR = window.devicePixelRatio; // Track current device pixel ratio

// Handle canvas resizing on window resize or orientation change
function handleCanvasResize() {
  const newDPR = window.devicePixelRatio;

  if (newDPR !== currentDPR) {
    currentDPR = newDPR;
    initializeCanvas(); // Reinitialize canvas size; content will be restored automatically from localStorage
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCanvas(); // Set initial canvas size
  saveToHistory(); // Save the initial blank state to history (only once)
  setupToolListeners(); // Attach tool selection listeners and set default tool
  setupActionListeners(); // Attach action button listeners (undo, redo, clear, save)
  setupStyleToolListeners(); // Attach style tool listeners (color picker, stroke size, opacity)
  setupCanvasDrawing(); // Activate canvas drawing event listeners
  colorPickerDropdown(); // Initialize color picker dropdown functionality

  // Listen for window resize and orientation change events
  window.addEventListener("resize", handleCanvasResize);
  window.addEventListener("orientationchange", handleCanvasResize);

  // Listen for changes in device pixel ratio
  window
    .matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    .addEventListener("change", handleCanvasResize);
});
