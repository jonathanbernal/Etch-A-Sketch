const gridSlider = document.querySelector("#grid-slider");
const gridValue = document.querySelector(".grid-value");
const gridContainer = document.querySelector(".grid-container");

// Color picker input
const colorPickerLabel = document.querySelector("#color-picker-label");
const colorPicker = document.querySelector("#color-picker");

// Background color picker input
const backgroundColorPickerLabel = document.querySelector(
  "#background-picker-label"
);
const backgroundColorPicker = document.querySelector("#background-picker");

// Mode buttons
const colorModeButton = document.querySelector("#color-button");
const rainbowModeButton = document.querySelector("#rainbow-button");
const toggleGridButton = document.querySelector("#toggle-grid-button");
const clearButton = document.querySelector("#clear-button");
const eraseButton = document.querySelector("#eraser-button");
// Get a reference to all the buttons to manage their state through the active class
const modeButtons = document.querySelectorAll(".mode-btn");

const DEFAULT_GRID_SIZE = 16; // This creates a default 16 x 16 grid
const DEFAULT_CELL_COLOR = "#000000";
const DEFAULT_BACKGROUND_COLOR = "#eeeeee";
const DEFAULT_GRID_CELL_BORDER = "1px solid #bbb";

let currentCellColor = ""; // this keeps track of the current color
let currentGridSize = 0;
let currentBackgroundColor = "";
let currentGridCellBorder = "";

// this abort controller is used to add/remove event listeners for drawing/erasing
// This is done by removing the event listeners attached to the grid container every
// time one of the function buttons is clicked.
let abortController = new AbortController();

/**
 * This function gets rid of all the children that are attached to a grid
 * when calling renderGrid(). It is used to update the grid when the grid
 * size changes.
 */
function wipeGrid() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

/**
 *  This function renders a grid on the main page. It resizes itself
 *  based on the number of rows and columns.
 *
 *  We're always creating a NxN grid, hence the number of columns will be the
 *  same as that of rows.
 *
 * @param {Integer} rows the number of rows to generate
 * @param {Integer} cols the number of columns to generate
 */
function renderGrid(rows, cols) {
  // Calculate the dimensions of the container and cells based on different screen sizes
  const containerWidth = gridContainer.clientWidth;
  const containerHeight = gridContainer.clientHeight;
  const rowSize = containerHeight / rows;
  const columnSize = containerWidth / cols;

  // we need to wipe the previous grid first or else every time we render
  // a new grid, it will just add up right next to the previous one.
  wipeGrid();

  for (let row = 0; row < rows; row += 1) {
    const gridRow = document.createElement("div");

    for (let col = 0; col < cols; col += 1) {
      const gridCol = document.createElement("div");
      gridCol.classList.add("grid-cell");
      gridCol.style.width = `${columnSize}px`;
      gridCol.style.height = `${rowSize}px`;
      gridCol.style.border = currentGridCellBorder;
      gridCol.style.backgroundColor = currentBackgroundColor;
      gridCol.setAttribute("hovered", false);
      gridRow.appendChild(gridCol);
    }
    gridContainer.appendChild(gridRow);
  }
}

/**
 * This function generates a random color in hex format following the 6-digit notation only.
 * @returns {String} A string representing a color in 6-digit hex notation.
 */
function generateRandomHexColor() {
  const values = "0123456789abcdef"; // our values will always fall in this range
  let resultColor = "#"; // all colors in hex notation start with #

  // we will always be generating 6 values, as that is what the color picker
  // input will always expect. The color picker input does support neither 3-digit
  // values nor color names, such as 'red' or 'blue'.
  for (let curr = 0; curr < 6; curr += 1) {
    const randomValue = values[Math.floor(Math.random() * 16)];
    resultColor += randomValue;
  }

  return resultColor;
}

/**
 * This function draws on the grid with the color selected on the color picker element.
 * @param {*} event The event that is triggered by the grid when hovering on a grid cell.
 */
function drawSolidColor(event) {
  // Change the background color of the specified cell. We no longer have
  // to keep track of when the eraser is on or off, as the behavior is now decoupled.
  event.target.style.backgroundColor = currentCellColor;
  event.target.setAttribute("hovered", true);
}

/**
 * This function generates a random color and uses it to paint on the grid,
 * as opposed to the current color.
 * @param {Event} event The event that is triggered by the grid when hovering on a grid cell.
 */
function drawRainbowColor(event) {
  // paint the cell with the color specified by the user unless the eraser is on
  // If so, the current background color is used to change the cell color to that
  // of the background.
  event.target.style.backgroundColor = generateRandomHexColor();
  event.target.setAttribute("hovered", true);
}

/**
 * This function erases the color of a cell
 * @param {Event} event The event that is triggered by the grid when hovering on a grid cell.
 */
function eraseColor(event) {
  event.target.style.backgroundColor = currentBackgroundColor;
  event.target.setAttribute("hovered", false);
}

/**
 * This event listener grabs a reference to all the buttons that have
 * a mode -- color, rainbow, and eraser. It then manages their state
 * through the active class.
 *
 * The reason this event listener was included was because managing
 * the references to each of the buttons was becoming more difficult,
 * and this is the only workaround to not have rainbow mode and eraser mode
 * conflict with one another.
 */
modeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const current = document.querySelector(".active");
    if (current) {
      current.classList.remove("active");
      this.classList.add("active");
    } else {
      // This handles the initial case when none of the mode buttons is active.
      this.classList.add("active");
    }
  });
});

/**
 * This event listener grabs the value from the grid slider
 * and renders a new grid with the specified size when it changes.
 */
gridSlider.addEventListener("input", (evt) => {
  currentGridSize = evt.target.value;
  gridValue.textContent = currentGridSize;

  renderGrid(currentGridSize, currentGridSize);
});

/**
 * This color picker label event listener is responsible for capturing the user's
 * click and sending it to the input element that is hidden.
 */
colorPickerLabel.addEventListener("click", () => {
  // Because we had to hide the color picker input to override its normal
  // appearance, we need to emulate the click when clicking on the container
  // label.
  colorPicker.click();
});

/**
 * This event listener is responsible for setting the painting color.
 */
colorPicker.addEventListener("input", (evt) => {
  // set the color to the value specified on the button.
  const selectedColor = evt.target.value;
  colorPickerLabel.style.backgroundColor = selectedColor;
  currentCellColor = selectedColor;
});

/**
 * This event listener simulates the clicking of the background color
 * picker input.
 */
backgroundColorPickerLabel.addEventListener("click", () => {
  backgroundColorPicker.click();
});

/**
 * This event listener is responsible for changing the background color of the
 * grid to the color specified by the user.
 */
backgroundColorPicker.addEventListener("input", () => {
  const selectedColor = backgroundColorPicker.value;

  currentBackgroundColor = selectedColor;
  // Since we hid away the color input picker, we now have to change
  // the color of the label container
  backgroundColorPickerLabel.style.backgroundColor = selectedColor;

  // Update the color of all cells that have not been hovered over
  const gridCells = gridContainer.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    // We must check against the contents of the value rather than the value itself
    // or the logic check is not evaluated.
    if (cell.getAttribute("hovered") === "false") {
      cell.style.backgroundColor = selectedColor;
    }
  });
});

/**
 * This event listener enables the color mode when the Color Mode button is clicked.
 */
colorModeButton.addEventListener("click", function () {
  abortController.abort();
  abortController = new AbortController();
  const abortEvent = new Event("abort");
  this.dispatchEvent(abortEvent);
});

/**
 * This event listener is triggered after the color mode button triggers the abort event.
 */
colorModeButton.addEventListener("abort", () => {
  gridContainer.addEventListener("mouseover", drawSolidColor, {
    signal: abortController.signal,
  });
});

/**
 * This event listener is triggered when Rainbow Mode is clicked on.
 */
rainbowModeButton.addEventListener("click", function () {
  abortController.abort();
  abortController = new AbortController();
  const abortEvent = new Event("abort");
  this.dispatchEvent(abortEvent);
});

/**
 * This event listener is triggered after the abort event is issued by RainbowModeButton
 */
rainbowModeButton.addEventListener("abort", () => {
  gridContainer.addEventListener("mouseover", drawRainbowColor, {
    signal: abortController.signal,
  });
});

/**
 * This event listener handles Erase Mode when clicked on.
 */
eraseButton.addEventListener("click", function () {
  abortController.abort();
  abortController = new AbortController();
  const abortEvent = new Event("abort");
  this.dispatchEvent(abortEvent);
});

/**
 * This event listener is triggered as a response to the abort event dispatched by Erase Mode.
 */
eraseButton.addEventListener("abort", () => {
  gridContainer.addEventListener("mouseover", eraseColor, {
    signal: abortController.signal,
  });
});

/**
 * This event listener is responsible for clearing out the grid when the
 * clear button is pressed.
 */
clearButton.addEventListener("click", () => {
  // restore default values for the background
  backgroundColorPicker.value = DEFAULT_BACKGROUND_COLOR;
  currentBackgroundColor = DEFAULT_BACKGROUND_COLOR;
  renderGrid(currentGridSize, currentGridSize);
});

/**
 * This event listener toggles the lines on the grid on and off.
 */
toggleGridButton.addEventListener("click", function () {
  const gridCells = gridContainer.querySelectorAll(".grid-cell");

  // We still want to keep track of the value of this button
  // to know when the grid lines are on or off
  if (this.value === "on") {
    this.value = "off";
    currentGridCellBorder = "none";
  } else {
    this.value = "on";
    currentGridCellBorder = DEFAULT_GRID_CELL_BORDER;
  }
  // once the current style is determined, grab the current cells and change their border style.
  gridCells.forEach((item) => {
    item.style.border = currentGridCellBorder;
  });
});

/**
 * This function initializes the contents of the Web page on loadup.
 * Another alternative to this function could be to load all the initial
 * values on window.load
 */
function initWebPage() {
  // Call out renderGrid() to initiate the grid on page load.
  currentGridSize = DEFAULT_GRID_SIZE;
  currentCellColor = DEFAULT_CELL_COLOR;
  currentBackgroundColor = DEFAULT_BACKGROUND_COLOR;
  currentGridCellBorder = "none";
  gridValue.textContent = DEFAULT_GRID_SIZE;
  renderGrid(currentGridSize, currentGridSize);
}

initWebPage();

/*
 TODO: find out how to delete children of a node without referencing them directly.
 Can we create a single child node for the grid container and just delete it to
 render a new grid?
*/
