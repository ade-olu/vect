import { state, styleTools } from "./variables.js"; // Import state and styleTools

// Color picker elements
const colorPickerPopup = document.getElementById("colorPickerPopup");
const colorSelectionArea = document.querySelector(".color-selection-area");
const colorSelectionCursor = document.getElementById("colorSelectionCursor");
const hueSlider = document.getElementById("hueSlider");
const colorOpacitySlider = document.getElementById("colorOpacitySlider");
const colorOpacityInput = document.getElementById("colorOpacityInput");

// Color input elements
const hexInput = document.getElementById("hexInput");
const rgbRInput = document.getElementById("rgbRInput");
const rgbGInput = document.getElementById("rgbGInput");
const rgbBInput = document.getElementById("rgbBInput");
const hslHInput = document.getElementById("hslHInput");
const hslSInput = document.getElementById("hslSInput");
const hslLInput = document.getElementById("hslLInput");

// Saved colors elements
const savedColorsGrid = document.querySelector(".saved-colors-grid");
const addColorBtn = document.getElementById("addColor");

// Color conversion functions
// Convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Convert HSL to RGB
function hslToRGB(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert HEX to HSL
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert RGB to HSL
function rgbToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSV (0-360, 0-100, 0-100) to HSL (0-360, 0-100, 0-100)
function hsvToHsl(h, s, v) {
  s /= 100;
  v /= 100;
  const l = v * (1 - s / 2);
  const newS = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return {
    h,
    s: Math.round(newS * 100),
    l: Math.round(l * 100),
  };
}

// Internal state for the color picker
// Start with the exact HEX value we want
let currentHex = "#16131d";
const defaultColor = hexToHSL(currentHex);
let currentHue = defaultColor.h; // Hue (0-360)
let currentSaturation = defaultColor.s; // How vivid (0-100)
let currentLightness = defaultColor.l; // How light/dark (0-100)
let currentOpacity = 100; // Opacity (0-100)

// Saved colors array
let savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];

// Main function to setup color picker functionality
export function setupColorPicker() {
  const closeBtn = document.getElementById("closeColorPicker");

  // Toggle color picker popup when clicking the tool
  styleTools.colorPicker.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent immediate close from document listener

    const isCurrentlyOpen = colorPickerPopup.classList.contains("visible");

    if (isCurrentlyOpen) {
      // Close the popup with fade-out animation
      colorPickerPopup.classList.add("closing");
      setTimeout(() => {
        colorPickerPopup.classList.remove("visible");
        colorPickerPopup.classList.remove("closing");
        styleTools.colorPicker.classList.remove("active");
      }, 150); // Match animation duration
    } else {
      // Open the popup
      colorPickerPopup.classList.add("visible");
      styleTools.colorPicker.classList.add("active");

      // Ensure the selection area has layout before positioning the cursor
      requestAnimationFrame(() => {
        positionCursorFromHSL(currentHue, currentSaturation, currentLightness);
      });
    }
  });

  // Close when clicking the X button
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering document click
    colorPickerPopup.classList.add("closing");
    setTimeout(() => {
      colorPickerPopup.classList.remove("visible");
      colorPickerPopup.classList.remove("closing");
      styleTools.colorPicker.classList.remove("active");
    }, 150); // Match animation duration
  });

  // Close when clicking outside the popup
  document.addEventListener("click", (e) => {
    // Check if click is outside both the popup and the tool button
    if (
      !colorPickerPopup.contains(e.target) &&
      !styleTools.colorPicker.contains(e.target)
    ) {
      colorPickerPopup.classList.add("closing");
      setTimeout(() => {
        colorPickerPopup.classList.remove("visible");
        colorPickerPopup.classList.remove("closing");
        styleTools.colorPicker.classList.remove("active");
      }, 150); // Match animation duration
    }
  });

  // Prevent clicks inside the popup from closing it
  colorPickerPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Initialize all color picker features
  setupColorSelectionArea();
  setupHueSlider();
  setupOpacityControls();
  setupColorInputs();
  colorPickerDropdown();
  setupSavedColors();

  // Set initial color with the stored HEX value
  updateColorFromHex(currentHex);

  // Position cursor based on initial color (will run when area has layout)
  requestAnimationFrame(() => {
    positionCursorFromHSL(currentHue, currentSaturation, currentLightness);
  });
}

// Function to setup color selection area
function setupColorSelectionArea() {
  let isDragging = false;

  // When you click or touch the rainbow square
  colorSelectionArea.addEventListener("mousedown", startSelection);
  colorSelectionArea.addEventListener("touchstart", startSelection);

  function startSelection(e) {
    isDragging = true;
    updateSelectionFromEvent(e);

    // Keep updating while dragging
    document.addEventListener("mousemove", updateSelectionFromEvent);
    document.addEventListener("touchmove", updateSelectionFromEvent);

    // Stop when you let go
    document.addEventListener("mouseup", stopSelection);
    document.addEventListener("touchend", stopSelection);
  }

  function stopSelection() {
    isDragging = false;
    document.removeEventListener("mousemove", updateSelectionFromEvent);
    document.removeEventListener("touchmove", updateSelectionFromEvent);
    document.removeEventListener("mouseup", stopSelection);
    document.removeEventListener("touchend", stopSelection);
  }

  function updateSelectionFromEvent(e) {
    if (e.type.startsWith("touch")) {
      e.preventDefault();
    }
    const rect = colorSelectionArea.getBoundingClientRect();
    const cursorSize = colorSelectionCursor.offsetWidth || 0;
    const maxX = Math.max(0, rect.width - cursorSize * 0.5);
    const maxY = Math.max(0, rect.height - cursorSize * 0.5);
    let x, y;

    if (e.type.startsWith("touch")) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Keep the cursor inside the box with at most 25% overflow (matches translate -25%)
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    // Use HSV-style mapping so top-right is the pure hue, bottom is black
    const hsvSaturation = (x / rect.width) * 100; // 0% left -> 100% right
    const hsvValue = 100 - (y / rect.height) * 100; // 100% top -> 0% bottom

    const { s: hslSaturation, l: hslLightness } = hsvToHsl(
      currentHue,
      hsvSaturation,
      hsvValue
    );

    // Update the color
    currentSaturation = hslSaturation;
    currentLightness = hslLightness;
    updateColorFromHSL(currentHue, currentSaturation, currentLightness);

    // Move the cursor dot
    colorSelectionCursor.style.left = `${x}px`;
    colorSelectionCursor.style.top = `${y}px`;
  }
}

// Function to setup hue slider
function setupHueSlider() {
  hueSlider.addEventListener("input", (e) => {
    currentHue = parseInt(e.target.value);

    // Update the rainbow square's background color
    const hueColor = `hsl(${currentHue}, 100%, 50%)`;
    colorSelectionArea.style.background = `
      linear-gradient(to bottom, transparent, black),
      linear-gradient(to right, white, ${hueColor})
    `;

    // Update the current color
    updateColorFromHSL(currentHue, currentSaturation, currentLightness);
  });
}

// Function to setup opacity controls
function setupOpacityControls() {
  // Sync slider with input box
  colorOpacitySlider.addEventListener("input", (e) => {
    currentOpacity = parseInt(e.target.value);
    colorOpacityInput.value = currentOpacity;
    updateColorFromHSL(currentHue, currentSaturation, currentLightness);
  });

  colorOpacityInput.addEventListener("input", (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 100;
    value = Math.max(0, Math.min(100, value));

    currentOpacity = value;
    colorOpacitySlider.value = value;
    updateColorFromHSL(currentHue, currentSaturation, currentLightness);
  });
}

// Function to setup color input fields
function setupColorInputs() {
  // HEX input
  hexInput.addEventListener("input", (e) => {
    let hex = e.target.value.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      currentHex = hex; // Store the exact HEX
      const { h, s, l } = hexToHSL(hex);
      currentHue = h;
      currentSaturation = s;
      currentLightness = l;
      updateColorFromHex(hex);
    }
  });

  // RGB inputs
  const updateFromRGB = () => {
    const r = parseInt(rgbRInput.value) || 0;
    const g = parseInt(rgbGInput.value) || 0;
    const b = parseInt(rgbBInput.value) || 0;

    const { h, s, l } = rgbToHSL(r, g, b);
    currentHue = h;
    currentSaturation = s;
    currentLightness = l;
    updateColorFromHSL(h, s, l);
  };

  rgbRInput.addEventListener("input", updateFromRGB);
  rgbGInput.addEventListener("input", updateFromRGB);
  rgbBInput.addEventListener("input", updateFromRGB);

  // HSL inputs
  const updateFromHSL = () => {
    const h = parseInt(hslHInput.value) || 0;
    const s = parseInt(hslSInput.value) || 0;
    const l = parseInt(hslLInput.value) || 0;

    currentHue = h;
    currentSaturation = s;
    currentLightness = l;
    updateColorFromHSL(h, s, l);
  };

  hslHInput.addEventListener("input", updateFromHSL);
  hslSInput.addEventListener("input", updateFromHSL);
  hslLInput.addEventListener("input", updateFromHSL);
}

// Function to handle color picker dropdown behavior
export function colorPickerDropdown() {
  const colorFormat = document.querySelector(".color-format");
  const toggleBtn = document.getElementById("colorFormatToggle");
  const options = document.querySelectorAll(".color-format-options li");
  const selectedLabel = document.getElementById("selectedColorFormat");

  // Add click event listener to toggle button
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent immediate close when toggling
    const isOpen = colorFormat.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
    toggleBtn.querySelector("img").classList.toggle("rotated", isOpen);
  });

  // Close if clicked outside
  document.addEventListener("click", (event) => {
    if (!colorFormat.contains(event.target)) {
      colorFormat.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.querySelector("img").classList.remove("rotated");
    }
  });

  // Show only the selected option
  const formatInputs = document.querySelectorAll(".format-inputs");

  // Function to show only the selected format
  function showFormat(format) {
    formatInputs.forEach((input) => {
      // Remove any existing visible class
      input.classList.remove("visible");

      // Add visible class only to selected format
      if (input.dataset.format === format) {
        input.classList.add("visible");
      }
    });
  }

  // For each option, add click event listener
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedFormat = option.dataset.format; // Get selected format
      selectedLabel.textContent = option.textContent; // Update displayed label
      showFormat(selectedFormat); // Show relevant input fields

      // Close dropdown after selection
      colorFormat.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.querySelector("img").classList.remove("rotated");
    });
  });

  // Initialize default: HEX
  showFormat("HEX");
  selectedLabel.textContent = "HEX";
}

// Function to setup saved colors functionality
function setupSavedColors() {
  // Load saved colors from localStorage
  renderSavedColors();

  // Add current color to saved colors
  addColorBtn.addEventListener("click", () => {
    const colorHex = currentHex; // Use the stored HEX value

    // Don't add duplicates
    if (!savedColors.includes(colorHex)) {
      savedColors.push(colorHex);
      localStorage.setItem("savedColors", JSON.stringify(savedColors));
      renderSavedColors();
    }
  });
}

// Function to render saved colors grid
function renderSavedColors() {
  savedColorsGrid.innerHTML = "";

  savedColors.forEach((color, index) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "saved-color-swatch";
    colorSwatch.style.backgroundColor = color;
    colorSwatch.title = color;

    // Click to use this color
    colorSwatch.addEventListener("click", () => {
      currentHex = color; // Store the exact HEX
      const { h, s, l } = hexToHSL(color);
      currentHue = h;
      currentSaturation = s;
      currentLightness = l;
      updateColorFromHex(color);
      positionCursorFromHSL(h, s, l); // ADD THIS LINE
    });

    savedColorsGrid.appendChild(colorSwatch);
  });
}

// Function to position cursor based on HSL values
function positionCursorFromHSL(h, s, l, attempt = 0) {
  const rect = colorSelectionArea.getBoundingClientRect();
  const cursorSize = colorSelectionCursor.offsetWidth || 0;
  const maxX = Math.max(0, rect.width - cursorSize * 0.5);
  const maxY = Math.max(0, rect.height - cursorSize * 0.5);

  // If the popup is hidden, the selection area can be 0x0; retry a few times
  if ((!rect.width || !rect.height) && attempt < 5) {
    requestAnimationFrame(() => positionCursorFromHSL(h, s, l, attempt + 1));
    return;
  }

  if (!rect.width || !rect.height) return; // Give up if still no layout

  // Calculate position based on saturation and lightness
  const x = Math.max(0, Math.min((s / 100) * rect.width, maxX)); // 0% left, 100% right (clamped)
  const y = Math.max(0, Math.min(((100 - l) / 100) * rect.height, maxY)); // 100% top, 0% bottom (clamped)

  colorSelectionCursor.style.left = `${x}px`;
  colorSelectionCursor.style.top = `${y}px`;
}

// Function to update color from HEX (Preserves exact HEX value)
function updateColorFromHex(hex) {
  currentHex = hex; // Store exact HEX
  const { h, s, l } = hexToHSL(hex);
  const rgb = hslToRGB(h, s, l);

  // Update all input fields
  hexInput.value = hex; // Use stored HEX
  rgbRInput.value = rgb.r;
  rgbGInput.value = rgb.g;
  rgbBInput.value = rgb.b;
  hslHInput.value = Math.round(h);
  hslSInput.value = Math.round(s);
  hslLInput.value = Math.round(l);

  // Update hue slider
  hueSlider.value = h;

  // Update the rainbow square background
  const hueColor = `hsl(${h}, 100%, 50%)`;
  colorSelectionArea.style.background = `
    linear-gradient(to bottom, transparent, black),
    linear-gradient(to right, white, ${hueColor})
  `;

  // Update the color indicator (The circle that shows current color)
  const opacityDecimal = currentOpacity / 100;
  const finalColor = `hsla(${h}, ${s}%, ${l}%, ${opacityDecimal})`;
  styleTools.colorPickerIndicator.style.backgroundColor = finalColor;
  hueSlider.style.setProperty("--hue-thumb-color", finalColor);
  colorOpacitySlider.style.setProperty("--opacity-thumb-color", finalColor);

  // Update the cursor color to match selected color
  colorSelectionCursor.style.backgroundColor = hex;

  // Update the opacity slider background with checkered pattern
  colorOpacitySlider.style.backgroundImage = `
    linear-gradient(to right, rgba(255, 255, 255, 0), ${hex}),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)`;

  // Position cursor correctly
  positionCursorFromHSL(h, s, l);

  // Update the drawing state
  state.color = hex; // Use stored HEX
  state.opacity = opacityDecimal;
}

// Function to update color based on HSL values
function updateColorFromHSL(h, s, l) {
  // Convert to different formats
  const hex = hslToHex(h, s, l);
  currentHex = hex; // Update stored HEX
  const rgb = hslToRGB(h, s, l);

  // Update all input fields
  hexInput.value = hex;
  rgbRInput.value = rgb.r;
  rgbGInput.value = rgb.g;
  rgbBInput.value = rgb.b;
  hslHInput.value = Math.round(h);
  hslSInput.value = Math.round(s);
  hslLInput.value = Math.round(l);

  // Update hue slider
  hueSlider.value = h;

  // Update the rainbow square background
  const hueColor = `hsl(${h}, 100%, 50%)`;
  colorSelectionArea.style.background = `
    linear-gradient(to bottom, transparent, black),
    linear-gradient(to right, white, ${hueColor})
  `;

  // Update the color indicator (The circle that shows current color)
  const opacityDecimal = currentOpacity / 100;
  const finalColor = `hsla(${h}, ${s}%, ${l}%, ${opacityDecimal})`;
  styleTools.colorPickerIndicator.style.backgroundColor = finalColor;
  hueSlider.style.setProperty("--hue-thumb-color", finalColor);
  colorOpacitySlider.style.setProperty("--opacity-thumb-color", finalColor);

  // Update the cursor color to match selected color
  colorSelectionCursor.style.backgroundColor = hex;

  // Update the opacity slider background with checkered pattern
  colorOpacitySlider.style.backgroundImage = `
    linear-gradient(to right, rgba(255, 255, 255, 0), ${hex}),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)`;

  // Update the drawing state
  state.color = hex;
  state.opacity = opacityDecimal;
}
