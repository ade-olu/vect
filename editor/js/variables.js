// Canvas and context
export const canvas = document.getElementById("editorCanvas");
export const ctx = canvas.getContext("2d");

// Set canvas dimensions
export function initializeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// Tools (pencil, brush, marker, airbrush, eraser, shapes)
export const tools = {
  pencil: document.getElementById("pencilTool"),
  brush: document.getElementById("brushTool"),
  marker: document.getElementById("markerTool"),
  airbrush: document.getElementById("airbrushTool"),
  eraser: document.getElementById("eraserTool"),
  shapes: document.getElementById("shapesTool"),
};

// Style tools (color picker, stroke size, opacity)
export const styleTools = {
  colorPicker: document.getElementById("colorPickerTool"),
  colorPickerIndicator: document.getElementById("colorPickerIndicator"),
  strokeSize: document.getElementById("strokeSizeTool"),
  opacity: document.getElementById("opacityTool"),
};

// Action tools (undo, redo, clear, save)
export const actionTools = {
  undo: document.getElementById("undoTool"),
  redo: document.getElementById("redoTool"),
  clear: document.getElementById("clearTool"),
  save: document.getElementById("saveTool"),
};

// State management for current tool
export const state = {
  // Current tool
  currentTool: "pencil",

  // Drawing properties
  color: "#7458ed",
  strokeSize: 5,
  opacity: 1,

  // Drawing state
  isDrawing: false,

  // Mouse position
  lastX: 0,
  lastY: 0,

  // History for undo/redo
  history: [],
  historyStep: -1,
  maxHistorySteps: 50,
};

// Tool configurations for default properties of each tool
export const toolConfig = {
  pencil: {
    name: "pencil",
    strokeSize: 1.5,
    opacity: 1,
  },
  brush: {
    name: "brush",
    strokeSize: 10,
    opacity: 0.7,
  },
  marker: {
    name: "marker",
    strokeSize: 15,
    opacity: 0.5,
  },
  airbrush: {
    name: "airbrush",
    strokeSize: 30,
    opacity: 0.3,
  },
  eraser: {
    name: "eraser",
    strokeSize: 20,
    opacity: 1,
  },
};
