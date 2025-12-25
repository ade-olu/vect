// ============================================
// PROPERTIES - STROKE SIZE & OPACITY
// ============================================
// Handles stroke size and opacity controls

import { state, styleTools } from "./variables.js";

// ============================================
// CHANGE STROKE SIZE
// ============================================
export function changeStrokeSize(size) {
  state.strokeSize = size;
  console.log(`Stroke size changed to: ${size}`);
}

// ============================================
// CHANGE OPACITY
// ============================================
export function changeOpacity(opacity) {
  state.opacity = opacity;
  console.log(`Opacity changed to: ${opacity}`);
}

// ============================================
// SETUP STROKE SIZE LISTENER
// ============================================
export function setupStrokeSizeListener() {
  styleTools.strokeSize.addEventListener("click", openStrokeSizeMenu);
}

function openStrokeSizeMenu() {
  // TODO: Create and display stroke size menu/slider
  console.log("Stroke size menu opened");
}

// ============================================
// SETUP OPACITY LISTENER
// ============================================
export function setupOpacityListener() {
  styleTools.opacity.addEventListener("click", openOpacityMenu);
}

function openOpacityMenu() {
  // TODO: Create and display opacity menu/slider
  console.log("Opacity menu opened");
}

// TODO: Add slider UI for stroke size
// TODO: Add slider UI for opacity
// TODO: Add visual feedback for current values
