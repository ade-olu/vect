import { ctx, state } from "../variables.js";

// Draw shape tool implementation for line, rectangle, circle, triangle
export function drawShape(e, shapeType) {
  const startX = state.lastX;
  const startY = state.lastY;
  const endX = e.offsetX;
  const endY = e.offsetY;
  ctx.strokeStyle = state.color;
  ctx.lineWidth = state.strokeSize;
  ctx.globalAlpha = state.opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  // Function for line shape
  function drawLineShape() {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }

  // Function for rectangle shape
  function drawRectShape() {
    ctx.rect(startX, startY, endX - startX, endY - startY);
  }

  // Function for circle shape
  function drawCircleShape() {
    const radius = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  }

  // Function for triangle shape
  function drawTriangleShape() {
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(startX * 2 - endX, endY);
    ctx.closePath();
  }

  // Draw the selected shape
  switch (shapeType) {
    case "line":
      drawLineShape();
      break;
    case "rectangle":
      drawRectShape();
      break;
    case "circle":
      drawCircleShape();
      break;
    case "triangle":
      drawTriangleShape();
      break;
    default:
      return;
  }
  ctx.stroke();
  ctx.closePath();
}
