
function getNextAnimationFrame(parentFrame, currentFrameId) {
    const children = getChildFrames(parentFrame.id);
    if (children.length) {
        if (currentFrameId === parentFrame.id) {
            return children[0].id;
        } else {
            const childIndex = getFrameIndexFromId(currentFrameId, children);

            if (childIndex === children.length - 1) {
                return parentFrame.id;
            } else {
                return children[childIndex + 1].id;
            }
        }
    } else {
        return parentFrame.id;
    }
}

function createAnimationController(frame) {
    const controller = {
        interval: 250,
        playing: false,
        alive: true,
        currentFrame: frame.id,
        parentFrame: frame.id
    };

    const loop = () => {
        setTimeout(() => {
            if (controller.alive) {
                if (controller.playing) {
                    controller.currentFrame = getNextAnimationFrame(frame, controller.currentFrame);

                    frame.selectedChildId = controller.currentFrame;
                    createFrameDisplay();
                }

                loop();
            }
        }, controller.interval);
    };
    loop();

    return controller;
}

function animationIsPlaying(frame) {
    let controller = getAnimationController(frame);
    return controller && controller.playing;
}

function getCurrentAnimationController() {
    let frame = getFrame();
    if (frame) {
        if (frame.parentId !== -1) {
            frame = getFrameById(frame.parentId);
        }

        return getOrCreateAnimationController(frame);
    }
}

function playAnimation(controller) {
    controller.playing = true;
}

function pauseAnimation(controller) {
    controller.playing = false;

    const frame = getFrame();
    if (frame.id === controller.parentFrame) {
        frame.selectedChildId = -1;
        saveSpritesToStorage();
    } else if (frame.parentId === controller.parentFrame) {
        getFrameById(frame.parentId).selectedChildId = frame.id;
        saveSpritesToStorage();
    }

    

    createFrameDisplay();
}

function togglePlayingAnimation(controller) {
    if (controller.playing) {
        pauseAnimation(controller);
    } else {
        playAnimation(controller);
    }
}