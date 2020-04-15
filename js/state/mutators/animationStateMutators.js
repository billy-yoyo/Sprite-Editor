function getOrCreateAnimationController(frame) {
    let controller = getAnimationController(frame);

    if (!controller) {
        const rootFrame = frame.parentId === -1 ? frame : getFrameById(frame.parentId);
        controller = createAnimationController(rootFrame);
        getAnimationControllers()[rootFrame.id] = controller;
    }

    return controller;
}