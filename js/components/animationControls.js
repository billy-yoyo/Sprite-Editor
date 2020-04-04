

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
        currentFrame: frame.id
    };

    const loop = () => {
        setTimeout(() => {
            if (controller.alive) {
                if (controller.playing) {
                    controller.currentFrame = getNextAnimationFrame(frame, controller.currentFrame);

                    frame.selectedChildId = controller.currentFrame;
                    createFrames();
                    createPixelDisplay();
                }

                loop();
            }
        }, controller.interval);
    };
    loop();

    return controller;
}


function getAnimationController(frame) {
    if (!State.AnimationState.controllers[frame.id]) {
        State.AnimationState.controllers[frame.id] = createAnimationController(frame);
    }
    return State.AnimationState.controllers[frame.id];
}

function animationIsPlaying(frame) {
    let controller;
    if (frame.parentId === -1) {
        controller = State.AnimationState.controllers[frame.id];
    } else {
        controller = State.AnimationState.controllers[frame.parentId];
    }
    return controller && controller.playing;
}

function createAnimationPlayButton(controller) {
    const playButton = document.createElement('div');
    playButton.classList.add('animation_controls_button');
    playButton.appendChild(createTextSpan(i18n(controller.playing ? 'animation_controls_pause_button' : 'animation_controls_play_button')));

    playButton.addEventListener('click', () => {
        controller.playing = !controller.playing;

        playButton.innerHTML = '';
        playButton.appendChild(createTextSpan(i18n(controller.playing ? 'animation_controls_pause_button' : 'animation_controls_play_button')));
    });

    return playButton;
}


function createAnimationIntervalInput(controller) {
    const elt = document.createElement('div');
    elt.classList.add('animation_controls_interval');

    const label = document.createElement('div');
    elt.classList.add('animation_controls_interval_label');
    label.appendChild(createTextSpan(i18n('animation_controls_interval_label')));
    elt.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    input.classList.add('animation_controls_interval_input');
    input.min = 10;
    input.max = 1000;
    input.value = controller.interval;
    elt.appendChild(input);

    input.addEventListener('change', () => {
        if (input.checkValidity()) {
            controller.interval = input.value;
        }
    });

    return elt;
}

function getCurrentAnimationController() {
    let frame = getFrame();
    if (frame) {
        if (frame.parentId !== -1) {
            frame = getFrameById(frame.parentId);
        }

        return getAnimationController(frame);
    }
}

function createAnimationControls() {
    const elt = document.createElement('div');
    elt.classList.add('animation_controls');

    const controller = getCurrentAnimationController();
    if (controller) {
        elt.appendChild(createAnimationPlayButton(controller));
        elt.appendChild(createAnimationIntervalInput(controller));
    }

    return elt;
}

function openAnimationControls() {
    if (State.AnimationState.controlsPopup) {
        closePopup(State.AnimationState.controlsPopup);
    }

    const controls = createAnimationControls();
    State.AnimationState.controlsPopup = spawnPopup(controls, { title: i18n('animation_controls_title') });
}

function closeAnimationControls() {
    if (State.AnimationState.controlsPopup) {
        closePopup(State.AnimationState.controlsPopup);
    }
}

function updateAnimationControls() {
    if (!State.AnimationState.controlsPopup) {
        openAnimationControls();
    } else {
        updatePopupInnerElt(State.AnimationState.controlsPopup, createAnimationControls());
    }
}