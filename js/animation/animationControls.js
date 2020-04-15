

function createAnimationPlayButton(controller) {
    const playButton = document.createElement('div');
    playButton.classList.add('animation_controls_button');
    playButton.appendChild(createTextSpan(i18n(controller.playing ? 'animation_controls_pause_button' : 'animation_controls_play_button')));

    playButton.addEventListener('click', () => {
        togglePlayingAnimation(controller);

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

function createAnimationControls() {
    const controller = getCurrentAnimationController();
    if (controller) {
        State.elts.animationControls.innerHTML = '';
        State.elts.animationControls.appendChild(createAnimationPlayButton(controller));
        State.elts.animationControls.appendChild(createAnimationIntervalInput(controller));
    }
}

function createAnimationNodeDropdownActions(frame) {
    return [
        
        { text: i18n('frame_dropdown_duplicate'), action: () => duplicateFrameBelow(frame) },
        { text: i18n('frame_dropdown_delete'), action: () => askDeleteFrame(frame) }
    ]
}

function createAnimationNode(parentFrame, frame, index) {
    const frameNode = document.createElement('div');
    frameNode.classList.add('animation_frame_node');
    frameNode.id = `animation_node_frame_${frame.id}`;
    frameNode.appendChild(createTextSpan(''+index));

    if (parentFrame.selectedChildId === frame.id || (parentFrame.selectedChildId === -1 && parentFrame.id === frame.id)) {
        frameNode.classList.add('selected');
        if (getOrCreateAnimationController(parentFrame).playing) {
            frameNode.classList.add('playing');
        }
    } else if (getFrame().id === frame.id) {
        frameNode.classList.add('selected');
    }

    frameNode.addEventListener('click', () => {
        setSelectedFrame(frame.id);

        createFrameDisplay();
        saveSpritesToStorage();
    });

    enableDragAndDrop({
        category: State.DragAndDrop.animationNodes,
        elt: frameNode,
        data: frame,
        ondrop: (dragFrame) => {
            dragAndDropFrame(dragFrame, frame);
        }
    });

    replaceContextMenu(frameNode, 'horizontal', () => createAnimationNodeDropdownActions(frame));

    return frameNode;
}

function createAnimationRow(frame) {
    const children = getChildFrames(frame.id);

    const frameName = document.createElement('div');
    frameName.classList.add('animation_frame_name');
    frameName.id = `animation_frame_${frame.id}_text`;
    frameName.appendChild(createTextSpan(frame.name));
    State.elts.animationRowNames.appendChild(frameName);

    if (getFrame().id === frame.id || getFrame().parentId === frame.id) {
        frameName.classList.add('selected');
    }

    frameName.addEventListener('click', () => {
        setSelectedFrame(frame.selectedChildId === -1 ? frame.id : frame.selectedChildId);

        createFrameDisplay();
        saveSpritesToStorage();
    });

    const frameNodes = document.createElement('div');
    frameNodes.classList.add('animation_frame_nodes');
    frameNodes.appendChild(createAnimationNode(frame, frame, 1));

    children.forEach((child, i) => {
        frameNodes.appendChild(createAnimationNode(frame, child, i + 2));
    });

    State.elts.animationRowFrames.appendChild(frameNodes);

    enableDragAndDrop({
        category: State.DragAndDrop.animationView,
        elt: frameName,
        data: frame,
        ondrop: (dragFrame) => {
            dragAndDropFrame(dragFrame, frame);
        }
    });

    replaceContextMenu(frameName, 'horizontal', () => createFrameDropdownActions(frame, true));
}

function createAnimationRows() {
    State.elts.animationRowNames.innerHTML = '';
    State.elts.animationRowFrames.innerHTML = '';

    getFrames().forEach((frame) => {
        if (frame.parentId === -1) {
            createAnimationRow(frame);
        }
    });
}

function createAnimationView() {
    createAnimationControls();
    createAnimationRows();
}

function openAnimationControls() {
    State.elts.animationView.classList.remove('hidden');
    State.elts.frameView.classList.add('full');
}

function closeAnimationControls() {
    State.elts.animationView.classList.add('hidden');
    State.elts.frameView.classList.remove('full');
}