

function getFrameColour(frame, x, y) {
    if (frame.selectedChildId === -1) {
        return frame.colours[y][x];
    } else {
        const childFrame = getFrameById(frame.selectedChildId);
        if (childFrame && childFrame.colours && childFrame.colours[y]) {
            return childFrame.colours[y][x];
        }
    }
    return '';
}

function getPixelColour(x, y) {
    const frames = getFrames();
    for (let frame of frames) {
        if (frame.visible && frame.parentId === -1) {
            const colour = getFrameColour(frame, x, y);
            if (colour) {
                return colour;
            }
        }
    }
    return '';
}

function updatePixelColour(elt, x, y) {
    const colour = getPixelColour(x, y);
    elt.innerHTML = '';
    if (colour) {
        elt.style.backgroundColor = colour;
        elt.classList.remove('empty');
    } else {
        const padding = Math.ceil(State.ViewState.pixelSize / 4);
        elt.style.backgroundColor = '';
        elt.style.padding = `${padding}px`;
        elt.classList.add('empty');

        elt.appendChild(document.createElement('div'));
    }
}

function createPixel(pixelRow, x, y) {
    const elt = document.createElement('span');
    elt.classList.add('pixel');
    
    elt.style.width = `${State.ViewState.pixelSize}px`;
    elt.style.height = `${State.ViewState.pixelSize}px`;

    updatePixelColour(elt, x, y);

    function clickPixel() {
        const frame = getFrame();

        if ((frame.visible || frame.id == getFrame().id) && !animationIsPlaying(frame)) {
            getFrame().colours[y][x] = State.ColourState.colour;
            updatePixelColour(elt, x, y);
            saveSpritesToStorage();
        }
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

function createPixelDisplay() {

    State.elts.pixelTable.innerHTML = '';
    getFrame().colours.forEach((row, y) => { 
        let pixelRow = document.createElement('div');
        pixelRow.classList.add('pixel_row');

        row.forEach((colour, x) => {
            createPixel(pixelRow, x, y);
        });

        State.elts.pixelTable.appendChild(pixelRow);
        disableContextMenu(pixelRow);
    });
}

function initPixelDisplay() {
    State.elts.canvasContainer.addEventListener('wheel', (e) => {
        if (e.shiftKey) {
            const diff = e.deltaY > 0 ? -1 : 1;
            setPixelSize(Math.max(Math.min(State.ViewState.pixelSize + (diff * 3), 300), 7));
            createPixelDisplay();
        }
    });
}
