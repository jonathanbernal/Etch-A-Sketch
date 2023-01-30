const sliderValue = document.querySelector('.slider-value');
const gridSlider = document.querySelector('#grid-slider');
const gridValue = document.querySelector('.grid-value');
const gridContainer = document.querySelector('.grid-container');
const gridCell = document.querySelectorAll('.grid-cell');
const colorPicker = document.querySelector('#color-picker');
const backgroundColorPicker = document.querySelector('#background-picker');

const colorModeButton = document.querySelector('#color-button');
const rainbowModeButton = document.querySelector('#rainbow-button');
const toggleGridButton = document.querySelector('#toggle-grid-button');
const clearButton = document.querySelector('#clear-button');
const eraseButton = document.querySelector('#eraser-button');
// get a reference to all the buttons to manage their state through the active class
const buttons = document.querySelectorAll('.mode-btn');

const DEFAULT_GRID_SIZE = 16; // This creates a default 16 x 16 grid
const DEFAULT_CELL_COLOR = '#000000';
const DEFAULT_BACKGROUND_COLOR = '#eeeeee';
const DEFAULT_GRID_CELL_BORDER = '1px solid black';

let currentCellColor = ''; // this keeps track of the current color
let previousCellColor = ''; // this variable is used to return to the previous color when the user uses the eraser feature
let currentGridSize = 0;
let currentBackgroundColor = '';
let currentGridCellBorder = '';

// this abort controller is used to add/remove event listeners for drawing/erasing
// This is done by removing the event listeners attached to the grid container.
let abortController = new AbortController();

/**
 * This function gets rid of all the children that are attached to a grid
 * when calling renderGrid(). It is used to update the grid when the grid
 * size changes.
 */
function wipeGrid() {
    while(gridContainer.firstChild){
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
function renderGrid(rows, cols){

    // Calculate the dimensions of the container and cells based on different screen sizes
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    const rowSize = containerHeight / rows;
    const columnSize = containerWidth / cols;

    // we need to wipe the previous grid first or else every time we render
    // a new grid, it will just add up right next to the previous one.
    wipeGrid();

    for (let row = 0; row < rows; row++){
        let gridRow = document.createElement('div');

        for (let col = 0; col < cols; col++) {
            let gridCol = document.createElement('div');
            gridCol.classList.add('grid-cell');
            gridCol.style.width = `${columnSize}px`;
            gridCol.style.height = `${rowSize}px`;
            gridCol.style.border = currentGridCellBorder;
            gridCol.style.backgroundColor = currentBackgroundColor;
            gridCol.setAttribute('hovered', false);
            gridRow.appendChild(gridCol);
        }
        gridContainer.appendChild(gridRow);
    }
}

/**
 * This function generates a random color in hex format following the 6-digit notation only.
 * @returns {String} A string representing a color in 6-digit hex notation.
 */
function generateRandomHexColor(){
    const values = '0123456789abcdef'; // our values will always fall in this range
    let resultColor = '#'; // all colors in hex notation start with #

    // we will always be generating 6 values, as that is what the color picker
    // input will always expect. The color picker input does support neither 3-digit
    // values nor color names, such as red and blue.
    for (let curr = 0; curr < 6; curr++){
        let randomValue = values[Math.floor(Math.random() * 16)];
        resultColor += randomValue;
    }

    return resultColor;
}

function drawSolidColor(event){
    // This helps us keep track of the cells the user has painted on (hovered).
    // and the ones that are to be erased. This way, we can easily update
    // the background color whenever needed.
    if (eraseButton.value === 'on'){
        event.target.setAttribute('hovered', false); // because a cell gets erased, it is no longer painted on
    }
    else {
        event.target.setAttribute('hovered', true);
    }
    // paint the cell with the color specified by the user unless the eraser is on
    // If so, the current background color is used to change the cell color to that 
    // of the background.
    event.target.style.backgroundColor = currentCellColor;
}

function drawRainbowColor(event){
    if (eraseButton.value === 'on'){
        event.target.setAttribute('hovered', false);
    }
    else {
        event.target.setAttribute('hovered', true);
    }
    // paint the cell with the color specified by the user unless the eraser is on
    // If so, the current background color is used to change the cell color to that 
    // of the background.
    event.target.style.backgroundColor = generateRandomHexColor();
}

/**
 * This function erases the color of a cell
 */
function eraseColor(event){
        event.target.style.backgroundColor = currentBackgroundColor;
        event.target.setAttribute('hovered', 'false');
}

/**
 * This event listener grabs a reference to all the buttons that have
 * a mode -- color, rainbow, and eraser. It then manages their state
 * through the active class.
 * 
 * The reason this event listener was included was because managing
 * the references to each of the buttons was becoming more difficult,
 * and this is the only workaround to not have rainbow mode conflict with
 * the eraser.
 */
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const current = document.querySelector('.active');
        current.classList.remove('active');
        this.classList.add('active');
    });
});

/**
 * This event listener grabs the value from the grid slider
 * and renders a new grid with the specified size when it changes.
 */
gridSlider.addEventListener('input', (evt) => {
    currentGridSize = evt.target.value;
    gridValue.textContent = currentGridSize;

    renderGrid(currentGridSize, currentGridSize);
});

/**
 * This event listener is responsible for setting the painting color.
 */
colorPicker.addEventListener('input', (evt) => {
    // this makes sure that if the eraser is activated and the user picks up
    // a new color, the eraser is turned off and the current color updated
    if (eraseButton.value === 'on'){
        eraseButton.value = 'off';
    }
    // set the color to the value specified on the button.
    currentCellColor = evt.target.value;
});

/**
 * This event listener is responsible for changing the background color of the
 * grid to the color specified by the user.
 */
backgroundColorPicker.addEventListener('input', ()=>{
    currentBackgroundColor = backgroundColorPicker.value;
    let gridCells = gridContainer.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        if(cell.getAttribute('hovered') === 'false')
            cell.style.backgroundColor = backgroundColorPicker.value;
    });
});

colorModeButton.addEventListener('click', function(){
    abortController.abort();
    abortController = new AbortController();
    const abortEvent = new Event('abort');
    this.dispatchEvent(abortEvent);
});

colorModeButton.addEventListener('abort', ()=>{
    console.log('Color Mode activated');
    gridContainer.addEventListener('mouseover', drawSolidColor, { signal: abortController.signal });
});

rainbowModeButton.addEventListener('click', function(){
    abortController.abort();
    abortController = new AbortController();
    const abortEvent = new Event('abort');
    this.dispatchEvent(abortEvent);
});

rainbowModeButton.addEventListener('abort', ()=>{
    gridContainer.addEventListener('mouseover', drawRainbowColor, { signal: abortController.signal });
});

eraseButton.addEventListener('click', function(){
    abortController.abort();
    abortController = new AbortController();
    const abortEvent = new Event('abort');
    this.dispatchEvent(abortEvent);
});

eraseButton.addEventListener('abort', ()=>{
    gridContainer.addEventListener('mouseover', eraseColor, { signal: abortController.signal });
});

/** 
 * This event listener is responsible for clearing out the grid when the
 * clear button is pressed.
*/
clearButton.addEventListener('click', () => {
    // restore default values for the background
    backgroundColorPicker.value = DEFAULT_BACKGROUND_COLOR;
    currentBackgroundColor = DEFAULT_BACKGROUND_COLOR;

    renderGrid(currentGridSize, currentGridSize); 
});

/**
 * This event listener toggles the lines on the grid on and off.
 */
toggleGridButton.addEventListener('click', function(){
    let gridCells = gridContainer.querySelectorAll('.grid-cell');

    if( this.value === 'on'){
        this.value = 'off';
        currentGridCellBorder = 'none';
    }
    else {
        this.value = 'on';
        currentGridCellBorder = DEFAULT_GRID_CELL_BORDER;
    }
    // once the current style is determined, re-render the grid
    gridCells.forEach(item => {item.style.border = currentGridCellBorder});
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
    currentGridCellBorder = DEFAULT_GRID_CELL_BORDER;
    gridValue.textContent = DEFAULT_GRID_SIZE;
    renderGrid(currentGridSize, currentGridSize);
}

initWebPage();

/*
 TODO: find out how to delete children of a node without referencing them directly.
 Can we create a single child node for the grid container and just delete it to 
 render a new grid?
*/