
function getFrames() {
    const sprite = getSprite();

    if (sprite) {
        return sprite.frames;
    }

    return [];
}

function getFrameIndex() {
    return State.FrameState.frameIndex;
}

function getFrame() {
    return getFrames()[getFrameIndex()] || { colours: [] };
}

function getFrameIndexFromId(frameId, customFrames) {
    const frames = customFrames || getFrames();
    for (let i = 0; i < frames.length; i++) {
        let frame = frames[i];
        if (frame.id === frameId) {
            return i;
        }
    }
    return null;
}

function getFrameById(frameId) {
    for (let frame of getFrames()) {
        if (frame.id === frameId) {
            return frame;
        }
    }
    return null;
}

function getFrameWidth() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.width;
    }
    return 0;
}

function getFrameHeight() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.height;
    }
    return 0;
}

function getChildFrames(parentId) {
    return getFrames().filter((frame) => frame.parentId === parentId);
}