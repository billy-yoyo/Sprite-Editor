
function createPixelDisplay(checkScroll) {
    if (checkScroll) {
        const coords = getGridCoordinatesFromMouse(State.ViewState.lastMouse.x, State.ViewState.lastMouse.y);

        const rect = State.elts.pixelCanvas.getBoundingClientRect()
        const scaleX = State.elts.pixelCanvas.width / rect.width;
        const scaleY = State.elts.pixelCanvas.height / rect.height;
        const pixelSize = getPixelSize();
        
        const dx = (State.ViewState.lastGridCoords.x - coords.x) * pixelSize / scaleX;
        const dy = (State.ViewState.lastGridCoords.y - coords.y) * pixelSize / scaleY;

        State.elts.canvasContainer.scrollBy(dx, dy);

    }

    renderGrid(State.ViewState.ctx, getFrameWidth(), getFrameHeight(), getPixelSize());
    if (State.ViewState.lastMouse) {
        const pixel = getPixelFromMouse(State.ViewState.lastMouse.x, State.ViewState.lastMouse.y);
        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, getPixelSize());
    }
}

function getGridCoordinatesFromMouse(mouseX, mouseY) {
    const rect = State.elts.pixelCanvas.getBoundingClientRect()
    const scaleX = State.elts.pixelCanvas.width / rect.width;
    const scaleY = State.elts.pixelCanvas.height / rect.height;
    const pixelSize = getPixelSize();

    return { x: (mouseX - rect.left) * scaleX / pixelSize, 
             y: (mouseY - rect.top) * scaleY / pixelSize };
}

function getPixelFromMouse(mouseX, mouseY) {
    const coords = getGridCoordinatesFromMouse(mouseX, mouseY);
    return { x: Math.floor(coords.x), y: Math.floor(coords.y) };
}

function clickPixel(x, y) {
    const frame = getFrame();

    if ((frame.visible || frame.id == getFrame().id) && !animationIsPlaying(frame)) {
        setFramePixel(x, y, getColour());
        renderPixel(State.ViewState.ctx, x, y, getPixelSize());
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

            setPixelSize(Math.max(Math.min(getPixelSize() + (diff * 3), 300), 7));
            createPixelDisplay(true);
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    });

    let lastPixel;

    State.elts.pixelCanvas.addEventListener('mousemove', (e) => {
        const pixel = getPixelFromMouse(e.clientX, e.clientY);
        
        State.ViewState.lastMouse.x = e.clientX;
        State.ViewState.lastMouse.y = e.clientY;

        if (lastPixel) {
            renderPixel(State.ViewState.ctx, lastPixel.x, lastPixel.y, getPixelSize());
        }

        if (e.buttons === 1) {
            clickPixel(pixel.x, pixel.y);
        }

        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, getPixelSize());
        lastPixel = pixel;
    });

    State.elts.pixelCanvas.addEventListener('mousedown', (e) => {
        const pixel = getPixelFromMouse(e.clientX, e.clientY);
        clickPixel(pixel.x, pixel.y);
        hoverPixel(State.ViewState.ctx, pixel.x, pixel.y, getPixelSize());
    });
}
