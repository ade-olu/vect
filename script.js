// Auto update the year in the footer section
const yearSpan = document.getElementById("currentYear");
const currentYear = new Date().getFullYear();
yearSpan.textContent = currentYear;
