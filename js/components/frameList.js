
function copyFrame(frame, newName, newId) {
    let name = newName || iterateStringNumber(getFrames(), frame.name); // TODO: iterate copy number
    let frameId = newId === undefined ? nextFrameId() : newId;

    return {
        name: name,
        id: frameId,
        parentId: frame.parentId,
        selectedChildId: -1,
        visible: frame.visible,
        colours: frame.colours.map(row => row.map(colour => colour))
    };
}

function createEmptyFrame(name, id, width, height) {
    const frameId = id === undefined ? nextFrameId() : id;

    name = name || `${i18n('default_frame_name')} ${frameId + 1}`;

    return {
        name: name,
        id: frameId,
        parentId: -1,
        selectedChildId: -1,
        visible: true,
        colours: createEmptyColours(width === undefined ? getFrameWidth() : width, height === undefined ? getFrameHeight() : height)
    };
}

function duplicateFrameBelow(frame) {
    const frames = getFrames();
    const newFrame = copyFrame(frame);

    frames.splice(getFrameIndexFromId(frame.id) + 1, 0, newFrame);
    setSelectedFrame(newFrame.id);

    createFrameDisplay();
    saveSpritesToStorage();
}

function newFrameChild(frame) {
    const frames = getFrames();
    const newFrame = copyFrame(frame);

    newFrame.parentId = frame.id;
    newFrame.name = frame.name + ` (${getChildFrames(frame.id).length + 1})`;
    newFrame.visible = false;

    frames.push(newFrame);

    createFrameDisplay();
    saveSpritesToStorage();
}

function newFrame() {
    const frames = getFrames();
    const newFrame = createEmptyFrame();

    frames.push(newFrame);
    setSelectedFrame(newFrame.id)

    createFrameDisplay();
    saveSpritesToStorage();
}

function deleteFrame(frame) {
    const frames = getFrames();
    const frameIndex = getFrameIndexFromId(frame.id);
    const children = getChildFrames(frame.id);

    let neighbourId;

    if (frameIndex == State.FrameState.frameIndex) {
        if (frame.parentId === -1) {
            const neighbour = findNearestNeighbour(frames, frameIndex, (frame) => frame.parentId === -1);
            if (neighbour) {
                neighbourId = neighbour.id;
            }
        } else {
            const siblings = getChildFrames(frame.parentId);
            if (siblings.length === 1) {
                neighbourId = frame.parentId;
            } else {
                const childIndex = getFrameIndexFromId(frame.id, siblings);
                neighbour = findNearestNeighbour(siblings, childIndex, () => true);
                if (neighbour) {
                    neighbourId = neighbour.id;
                }
            }
        }
    }

    frames.splice(frameIndex, 1);

    children.forEach((child) => {
        const childIndex = getFrameIndexFromId(child.id);
        frames.splice(childIndex, 1);
    });

    if (frameIndex == State.FrameState.frameIndex && neighbourId !== undefined) {
        setSelectedFrame(neighbourId);
    }

    createFrameDisplay();
    saveSpritesToStorage();
}

function askDeleteFrame(frame) {
    spawnConfirmDialog({
        title: i18n('delete_frame_title'),
        text: i18n('delete_frame_warning', { name: frame.name }),
        buttons: [
            { text: i18n('delete_frame_yes_button'), handler: () => deleteFrame(frame) },
            { text: i18n('delete_frame_no_button'), handler: () => {} }
        ]
    });
}

function renameFrame(frame) {
    spawnFormDialog({
        title: i18n('rename_frame_title'),
        buttonText: i18n('rename_frame_button'),
        rows: [ [ { label: i18n('rename_frame_new_name'), type: 'text', id: 'name', autofocus: true } ] ],
        onsubmit: (data) => {
            if (data.name && !data.name.contains('\\')) {
                frame.name = data.name;

                const frameText = document.getElementById('frame_' + frame.id + '_text');
                if (frameText) {
                    frameText.innerText = data.name;
                }

                saveSpritesToStorage();
            } else {
                return ['name'];
            }
        },
        mutate: (form) => { form.style.minWidth = '300px' }
    });
}

function createFrameDropdownActions(frame, toggle) {
    return [
        { text: frame.visible ? i18n('frame_dropdown_hide'): i18n('frame_dropdown_show'), 
            action: () => toggleFrameVisibility(frame, toggle),
            condition: () => !!toggle },
        { text: i18n('frame_dropdown_rename'), action: () => renameFrame(frame) },
        { text: i18n('frame_dropdown_duplicate'), action: () => duplicateFrameBelow(frame) },
        { text: i18n('frame_dropdown_child_frame'), action: () => newFrameChild(frame), condition: () => frame.parentId === -1 },
        { text: i18n('frame_dropdown_delete'), action: () => askDeleteFrame(frame) }
    ];
}

function toggleFrameVisibility(frame, toggle) {
    frame.visible = !frame.visible;
    if (frame.visible) {
        toggle.classList.add('on');
    } else {
        toggle.classList.remove('on');
    }
    createPixelDisplay();
    saveSpritesToStorage();
}

function createFrameListEntry(frame) {
    const elt = document.createElement('div');
    elt.classList.add('list_item');

    if (frame.parentId >= 0) {
        elt.classList.add('child');
    }

    elt.id = 'frame_' + frame.id;

    elt.appendChild(createTextSpan(frame.name, 'frame_' + frame.id + '_text'));

    let toggle = null;
    if (frame.parentId === -1) {
        toggle = document.createElement('div');
        toggle.classList.add('list_item_toggle');

        if (frame.visible) {
            toggle.classList.add('on');
        }

        toggle.addEventListener('click', () => {
            toggleFrameVisibility(frame, toggle);
        });

        elt.appendChild(toggle);
    }

    if (frame.id === getFrame().id || frame.id === getFrame().parentId) {
        elt.classList.add('selected');
        State.FrameState.elts.push(elt);
    }

    if (frame.parentId !== -1 && getFrameById(frame.parentId).selectedChildId === frame.id) {
        elt.classList.add('selected_child');
    }

    elt.addEventListener('click', () => {
        setSelectedFrame(frame.id);

        createFrameDisplay();
        saveSpritesToStorage();
    });

    replaceContextMenu(elt, 'horizontal', () => createFrameDropdownActions(frame, toggle));

    enableDragAndDrop({
        category: State.DragAndDrop.frameList,
        elt: elt,
        data: frame,
        ondrop: (dragFrame) => {
            if (dragFrame.id !== frame.id) {
                const currentOpenIndex = getFrameIndexFromId(dragFrame.id)
                const targetOpenIndex = getFrameIndexFromId(frame.id);

                if (dragFrame.parentId === -1 && frame.parentId !== -1) {
                    if (dragFrame.id === frame.parentId) {
                        getChildFrames(dragFrame.id).forEach((child) => { child.parentId = frame.id; });
                        frame.parentId = -1;
                        frame.visible = dragFrame.visible;
                        dragFrame.parentId = frame.id;
                        dragFrame.visible = false;

                        swapIndexes(getFrames(), currentOpenIndex, targetOpenIndex);
                    } else {
                        dragFrame.parentId = frame.parentId;
                        dragFrame.visible = false;
                        moveIndexNextTo(getFrames(), currentOpenIndex, targetOpenIndex);
                    }
                } else if (dragFrame.parentId !== -1 && frame.parentId === -1) {
                    if (dragFrame.parentId === frame.id) {
                        getChildFrames(frame.id).forEach((child) => { child.parentId = dragFrame.id; });
                        dragFrame.parentId = -1;
                        dragFrame.visible = frame.visible;
                        frame.parentId = dragFrame.id;
                        frame.visible = false;

                        swapIndexes(getFrames(), currentOpenIndex, targetOpenIndex);
                    } else {
                        dragFrame.parentId = -1;
                        moveIndexNextTo(getFrames(), currentOpenIndex, targetOpenIndex);
                    }
                } else if (dragFrame.parentId !== -1 && frame.parentId !== -1 && dragFrame.parentId !== frame.parentId) {
                    dragFrame.parentId = frame.parentId;
                    moveIndexNextTo(getFrames(), currentOpenIndex, targetOpenIndex);
                } else {
                    moveIndexNextTo(getFrames(), currentOpenIndex, targetOpenIndex);
                }

                setSelectedFrame(dragFrame.id);
                saveSpritesToStorage();
                createFrameDisplay();
            }
        }
    });

    State.elts.frameList.appendChild(elt);
}

function getChildFrames(parentId) {
    return getFrames().filter((frame) => frame.parentId === parentId);
}

function createFrames() {
    State.elts.frameList.innerHTML = '';
    State.FrameState.elts = [];

    getFrames().forEach((frame) => {
        if (frame.parentId === -1) {
            createFrameListEntry(frame);

            const children = getChildFrames(frame.id);
            children.forEach(createFrameListEntry);
        } 
    });
}

function createFrameDisplay() {
    createFrames();
    createPixelDisplay();
    updateAnimationControls();
}

function setAllFrameVisiblityTo(visible) {
    getFrames().forEach((frame) => {
        frame.visible = visible;
    });

    createFrameDisplay();
}

function getFrameListActions() {
    return [
        { text: i18n('frame_list_new_frame'), action: newFrame },
        { text: i18n('frame_list_change_dimensions'), action: askChangeFrameDimensions },
        { text: i18n('frame_list_show_all'), action: () => setAllFrameVisiblityTo(true) },
        { text: i18n('frame_list_hide_all'), action: () => setAllFrameVisiblityTo(false) },
    ];
}

function initFrameList() {
    State.elts.frameListTitle.appendChild(createTextSpan(i18n('frame_list_title')));

    replaceContextMenu(State.elts.frameListTitle, 'horizontal', getFrameListActions);
    replaceContextMenu(State.elts.frameList, 'horizontal', getFrameListActions);
}