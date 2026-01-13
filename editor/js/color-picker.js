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
