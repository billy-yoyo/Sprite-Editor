

function getAnimationControllers() {
    return State.AnimationState.controllers;
}

function getAnimationController(frame) {
    if (frame.parentId === -1) {
        return getAnimationControllers()[frame.id];
    } else {
        return getAnimationControllers()[frame.parentId];
    }
}

