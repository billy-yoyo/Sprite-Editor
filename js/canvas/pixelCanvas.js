

const PIXEL_TRANSPARENT_COLOUR_A = '#515151';
const PIXEL_TRANSPARENT_COLOUR_B = '#313131';
const PIXEL_HOVER_COLOUR = 'white';

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

function renderPixel(ctx, x, y, pixelSize) {
    const colour = getPixelColour(x, y);

    if (colour) {
        ctx.fillStyle = colour;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    } else {
        let cx = x * pixelSize,
            cy = y * pixelSize;

        ctx.fillStyle = PIXEL_TRANSPARENT_COLOUR_A;
        ctx.fillRect(cx, cy, pixelSize, pixelSize);

        ctx.fillStyle = PIXEL_TRANSPARENT_COLOUR_B;
        let halfSize = pixelSize * 0.5;

        ctx.fillRect(cx + halfSize, cy, halfSize, halfSize);
        ctx.fillRect(cx, cy + halfSize, halfSize, halfSize);
    }
}

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

function renderGrid(ctx, width, height, pixelSize) {
    ctx.canvas.width = width * pixelSize;
    ctx.canvas.height = height * pixelSize;
    ctx.canvas.style.width = `${width * pixelSize}px`;
    ctx.canvas.style.height = `${height * pixelSize}px`;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            renderPixel(ctx, x, y, pixelSize);
        }
    }
}

function hoverPixel(ctx, x, y, pixelSize) {
    ctx.strokeStyle = PIXEL_HOVER_COLOUR;
    ctx.strokeRect((x * pixelSize) + 1, (y * pixelSize) + 1, pixelSize - 2, pixelSize - 2);
}