import {
  state,
  styleTools,
  strokeSizePopup,
  opacityPopup,
  strokeSizeRange,
  strokeSizeValue,
  opacityRange,
  opacityValue,
} from "./variables.js";

// Open stroke size popup
export function openStrokeSizePopup() {
  if (!strokeSizePopup) return;

  const isOpacityOpen = opacityPopup.classList.contains("visible");
  const isStrokeOpen = strokeSizePopup.classList.contains("visible");

  // Close if stroke size popup is already open
  if (isStrokeOpen) {
    styleTools.strokeSize.classList.remove("active");
    strokeSizePopup.classList.add("closing");
    setTimeout(() => {
      strokeSizePopup.classList.remove("visible");
      strokeSizePopup.classList.remove("closing");
    }, 150); // Match animation duration
    return;
  }

  // Close opacity popup if stroke size popup is to be opened
  if (isOpacityOpen) {
    opacityPopup.classList.add("closing");
    setTimeout(() => {
      opacityPopup.classList.remove("visible");
      opacityPopup.classList.remove("closing");
      styleTools.opacity.classList.remove("active");
    }, 150); // Match animation duration
  }

  // Otherwise, open stroke size popup
  styleTools.strokeSize.classList.add("active");
  strokeSizePopup.classList.remove("closing");
  strokeSizePopup.classList.add("visible");
}

// Open opacity popup
export function openOpacityPopup() {
  if (!opacityPopup) return;

  const isOpacityOpen = opacityPopup.classList.contains("visible");
  const isStrokeOpen = strokeSizePopup.classList.contains("visible");

  // Close if opacity popup is already open
  if (isOpacityOpen) {
    styleTools.opacity.classList.remove("active");
    opacityPopup.classList.add("closing");
    setTimeout(() => {
      opacityPopup.classList.remove("visible");
      opacityPopup.classList.remove("closing");
    }, 150); // Match animation duration
    return;
  }

  // Close stroke size popup if opacity popup is to be opened
  if (isStrokeOpen) {
    strokeSizePopup.classList.add("closing");
    setTimeout(() => {
      strokeSizePopup.classList.remove("visible");
      strokeSizePopup.classList.remove("closing");
      styleTools.strokeSize.classList.remove("active");
    }, 150); // Match animation duration
  }

  // Otherwise, open opacity popup
  styleTools.opacity.classList.add("active");
  opacityPopup.classList.remove("closing");
  opacityPopup.classList.add("visible");
}

// Update stroke size value when slider changes
if (strokeSizeRange && strokeSizeValue) {
  const updateStrokeSize = (value) => {
    const newSize = parseInt(value, 10);
    state.strokeSize = newSize;
    strokeSizeRange.value = newSize;
    strokeSizeValue.value = newSize;
  };

  // Slider input
  strokeSizeRange.addEventListener("input", () => {
    updateStrokeSize(strokeSizeRange.value);
  });

  // Number input
  strokeSizeValue.addEventListener("input", () => {
    updateStrokeSize(strokeSizeValue.value);
  });
}

// Update stroke size when slider or number input changes
if (opacityRange && opacityValue) {
  const updateOpacity = (value) => {
    let newOpacity = parseFloat(value) / 100; // convert 0–100 to 0–1
    if (newOpacity > 1) newOpacity = 1;
    if (newOpacity < 0) newOpacity = 0;
    state.opacity = newOpacity;

    // Update slider/input UI (0–100)
    const displayValue = Math.round(newOpacity * 100);
    opacityRange.value = displayValue;
    opacityValue.value = displayValue;
  };

  // Slider input
  opacityRange.addEventListener("input", () => {
    updateOpacity(opacityRange.value);
  });

  // Number input
  opacityValue.addEventListener("input", () => {
    updateOpacity(opacityValue.value);
  });
}

// Sync stroke size and opacity inputs with the selected tool
export function syncStyleToolValues() {
  if (strokeSizeRange && strokeSizeValue) {
    strokeSizeRange.value = state.strokeSize;
    strokeSizeValue.value = state.strokeSize;
  }

  if (opacityRange && opacityValue) {
    const displayValue = Math.round(state.opacity * 100);
    opacityRange.value = displayValue;
    opacityValue.value = displayValue;
  }
}
