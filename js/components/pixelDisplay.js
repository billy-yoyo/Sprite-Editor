

function createPixel(pixelRow, x, y) {
    const elt = document.createElement('span');
    elt.classList.add('pixel');
    
    elt.style.width = `${State.ViewState.pixelSize}px`;
    elt.style.height = `${State.ViewState.pixelSize}px`;

    updatePixelColour(elt, x, y);

    function clickPixel() {
        
    }

    elt.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) {
            clickPixel();
        }
        e.preventDefault();
    });
    elt.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) {
            clickPixel();
        }
    });
    disableContextMenu(elt);

    pixelRow.appendChild(elt);
}

function createPixelDisplay(checkScroll) {
    if (checkScroll) {
        const coords = getGridCoordinatesFromMouse(State.ViewState.lastMouse.x, State.ViewState.lastMouse.y);

        const rect = State.elts.pixelCanvas.getBoundingClientRect()
        const scaleX = State.elts.pixelCanvas.width / rect.width;
        const scaleY = State.elts.pixelCanvas.height / rect.height;
        
        const dx = (State.ViewState.lastGridCoords.x - coords.x) * State.ViewState.pixelSize / scaleX;
        const dy = (State.ViewState.lastGridCoords.y - coords.y) * State.ViewState.pixelSize / scaleY;

        State.elts.canvasContainer.scrollBy(dx, dy);

    }

    renderGrid(State.ViewState.ctx, getFrameWidth(), getFrameHeight(), State.ViewState.pixelSize);
    if (State.ViewState.lastMouse) {
        const pixel = getPixelFromMouse(State.ViewState.lastMouse.x, State.ViewState.lastMouse.y);
        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, State.ViewState.pixelSize);
    }
}

function getGridCoordinatesFromMouse(mouseX, mouseY) {
    const rect = State.elts.pixelCanvas.getBoundingClientRect()
    const scaleX = State.elts.pixelCanvas.width / rect.width;
    const scaleY = State.elts.pixelCanvas.height / rect.height;

    return { x: (mouseX - rect.left) * scaleX / State.ViewState.pixelSize, 
             y: (mouseY - rect.top) * scaleY / State.ViewState.pixelSize };
}

function getPixelFromMouse(mouseX, mouseY) {
    const coords = getGridCoordinatesFromMouse(mouseX, mouseY);
    return { x: Math.floor(coords.x), y: Math.floor(coords.y) };
}

function clickPixel(x, y) {
    const frame = getFrame();

    if ((frame.visible || frame.id == getFrame().id) && !animationIsPlaying(frame)) {
        getFrame().colours[y][x] = State.ColourState.colour;
        renderPixel(State.ViewState.ctx, x, y, State.ViewState.pixelSize);
        saveSpritesToStorage();
    }
}

function initPixelDisplay() {
    State.ViewState.ctx = State.elts.pixelCanvas.getContext('2d');

    disableContextMenu(State.elts.pixelCanvas);

    addMultipleListeners([State.elts.pixelCanvas, State.elts.canvasContainer], 'wheel', (e) => {
        
        if (e.ctrlKey) {
            const diff = e.deltaY > 0 ? -1 : 1;

            State.ViewState.lastMouse.x = e.clientX;
            State.ViewState.lastMouse.y = e.clientY;
            State.ViewState.lastGridCoords = getGridCoordinatesFromMouse(e.clientX, e.clientY);

            setPixelSize(Math.max(Math.min(State.ViewState.pixelSize + (diff * 3), 300), 7));
            createPixelDisplay(true);
        }
        e.stopImmediatePropagation();
        e.preventDefault();
    });

    let lastPixel;

    State.elts.pixelCanvas.addEventListener('mousemove', (e) => {
        const pixel = getPixelFromMouse(e.clientX, e.clientY);
        
        State.ViewState.lastMouse.x = e.clientX;
        State.ViewState.lastMouse.y = e.clientY;

        if (lastPixel) {
            renderPixel(State.ViewState.ctx, lastPixel.x, lastPixel.y, State.ViewState.pixelSize);
        }

        if (e.buttons === 1) {
            clickPixel(pixel.x, pixel.y);
        }

        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, State.ViewState.pixelSize);
        lastPixel = pixel;
    });

    State.elts.pixelCanvas.addEventListener('mousedown', (e) => {
        const pixel = getPixelFromMouse(e.clientX, e.clientY);
        clickPixel(pixel.x, pixel.y);
        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, State.ViewState.pixelSize);
    });
}
