// Import necessary variables from variables.js
import {
  state,
  tools,
  toolConfig,
  actionTools,
  shapeTools,
  shapesPopup,
  styleTools,
} from "./variables.js";
import {
  undo,
  redo,
  clearCanvas,
  saveCanvas,
  saveToHistory,
} from "./canvas.js";
import {
  openStrokeSizePopup,
  openOpacityPopup,
  syncStyleToolValues,
} from "./properties.js";

// Set the active tool button in the UI
function setActiveToolButton(toolName) {
  Object.values(tools).forEach((tool) => {
    if (tool) tool.classList.remove("active");
  });

  const selectedTool = tools[toolName];
  if (selectedTool) {
    selectedTool.classList.add("active");
  }
}

// Show or hide the shapes popup
function toggleShapesPopup(shouldShow) {
  if (!shapesPopup) return;
  shapesPopup.classList.toggle("visible", shouldShow);
}

// Select a shape tool and update state/UI
function selectShapeTool(shapeName) {
  const shapeElement = shapeTools[shapeName];
  if (!shapeElement) {
    console.warn(`Shape tool "${shapeName}" not found`);
    return;
  }

  Object.values(shapeTools).forEach((shapeTool) => {
    if (shapeTool) shapeTool.classList.remove("active");
  });

  shapeElement.classList.add("active");
  state.currentShape = shapeName;
  state.currentTool = shapeName;
  setActiveToolButton("shapes");
}

// Sync shape selection in the UI with state
function syncShapeSelection() {
  let desiredShape;

  if (state.currentShape && shapeTools[state.currentShape]) {
    desiredShape = state.currentShape;
  } else {
    desiredShape = "line";
  }

  Object.values(shapeTools).forEach((shapeTool) => {
    if (shapeTool) shapeTool.classList.remove("active");
  });

  const activeShape = shapeTools[desiredShape];
  if (activeShape) {
    activeShape.classList.add("active");
  }

  state.currentShape = desiredShape;
}

// Select a tool and update state/UI
export function selectTool(toolName) {
  // Validate tool exists
  if (!toolConfig[toolName]) {
    console.warn(`Tool "${toolName}" not found`);
    return;
  }

  // Apply tool settings to state
  state.currentTool = toolName;
  state.strokeSize = toolConfig[toolName].strokeSize;
  state.opacity = toolConfig[toolName].opacity;

  // Sync style tool UI values
  syncStyleToolValues();

  // Update UI by removing active class from all tools
  setActiveToolButton(toolName);

  console.log(`Tool selected: ${toolName}`);
}

// Setup event listeners for tool selection
export function setupToolListeners() {
  Object.entries(tools).forEach(([toolName, toolElement]) => {
    if (!toolElement) return;

    toolElement.addEventListener("click", () => {
      if (toolName === "shapes") {
        const willShowPopup = shapesPopup
          ? !shapesPopup.classList.contains("visible")
          : true;

        toggleShapesPopup(willShowPopup);
        if (willShowPopup) {
          syncShapeSelection();
          state.currentTool = state.currentShape;
          setActiveToolButton("shapes");
        }
        return;
      }

      toggleShapesPopup(false);
      selectTool(toolName);
    });
  });

  Object.entries(shapeTools).forEach(([shapeName, shapeElement]) => {
    if (!shapeElement) return;

    shapeElement.addEventListener("click", () => {
      selectShapeTool(shapeName);
      toggleShapesPopup(true); // Keep popup open while picking shapes
    });
  });

  selectTool("pencil"); // Select pencil by default
}

// Setup event listeners for action tools (undo, redo, clear, save)
export function setupActionListeners() {
  if (actionTools.undo) {
    actionTools.undo.addEventListener("click", () => {
      undo();
    });
  }

  if (actionTools.redo) {
    actionTools.redo.addEventListener("click", () => {
      redo();
    });
  }

  if (actionTools.clear) {
    actionTools.clear.addEventListener("click", () => {
      clearCanvas();
      saveToHistory(); // So undo can bring it back
    });
  }

  if (actionTools.save) {
    actionTools.save.addEventListener("click", () => {
      saveCanvas();
    });
  }
}

// Add listeners for style tools (stroke size, opacity)
export function setupStyleToolListeners() {
  styleTools.strokeSize.addEventListener("click", () => {
    openStrokeSizePopup();
  });

  styleTools.opacity.addEventListener("click", () => {
    openOpacityPopup();
  });
}
