

function setFrames(frames) {
    const sprite = getSprite();
    if (sprite) {
        sprite.frames = frames;
    }
}

function nextFrameId() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.nextFrameId++;
    }
    return 0;
}

function setSelectedFrame(frameId) {
    const sprite = getSprite();
    if (sprite) {
        sprite.frame = frameId;
        State.FrameState.frameIndex = getFrameIndexFromId(frameId);

        const frame = getFrame();
        if (frame.parentId === -1) {
            frame.selectedChildId = -1;
        } else {
            const parentFrame = getFrameById(frame.parentId);
            parentFrame.selectedChildId = frame.id;
        }
    }
}

function setFrameWidth(width) {
    const sprite = getSprite();
    if (sprite) {
        sprite.width = width;
    }
}

function setFrameHeight(height) {
    const sprite = getSprite();
    if (sprite) {
        sprite.height = height;
    }
}

function setFramePixel(x, y, colour) {
    const frame = getFrame();
    if (frame) {
        frame.colours[y][x] = colour;
    }
}

function insertFrame(frame, index) {
    getFrames().splice(index, 0, frame);
}

function addFrame(frame) {
    getFrames().push(frame);
}

function removeFrame(frame) {
    const frames = getFrames();
    frames.splice(getFrameIndexFromId(frame.id), 1);

    getChildFrames(frame.id).forEach((child) => {
        frames.splice(getFrameIndexFromId(child.id), 1);
    });
}

function renameFrame(frame, name) {
    frame.name = name;
}

function setFrameVisibility(frame, visibility) {
    frame.visibility = visibility;
}

function setFrameParent(frame, parentId) {
    frame.parentId = parentId;
}

function setFrameSelectedChildId(frame, selectedChildId) {
    frame.selectedChildId = selectedChildId;
}

function swapFramePositions(currentFrameIndex, targetFrameIndex) {
    swapIndexes(getFrames(), currentFrameIndex, targetFrameIndex);
}

function moveFrameNextTo(currentFrameIndex, targetFrameIndex) {
    moveIndexNextTo(getFrames(), currentFrameIndex, targetFrameIndex);
}