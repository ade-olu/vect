// Import necessary variables from variables.js
import { state, tools, toolConfig, actionTools } from "./variables.js";
import { undo, redo } from "./canvas.js";

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

  // Update UI by removing active class from all tools
  Object.values(tools).forEach((tool) => {
    if (tool) tool.classList.remove("active");
  });

  // Add active class to selected tool
  const selectedTool = tools[toolName];
  if (selectedTool) {
    selectedTool.classList.add("active");
  }

  console.log(`Tool selected: ${toolName}`);
}

// Setup event listeners for tool selection
export function setupToolListeners() {
  Object.entries(tools).forEach(([toolName, toolElement]) => {
    if (!toolElement) return;

    toolElement.addEventListener("click", () => {
      selectTool(toolName);
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
      console.log("Clear canvas clicked");
    });
  }

  if (actionTools.save) {
    actionTools.save.addEventListener("click", () => {
      console.log("Save clicked");
    });
  }
}

// TODO: Add tool-specific behavior
// TODO: Add tool cursor changes
// TODO: Add tool tooltips/feedback
