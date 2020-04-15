
function deleteSprite(sprite) {
    removeSprite(sprite);

    const tab = document.getElementById('tab_sprite_' + sprite.id);
    if (tab) {
        const open = getOpenSprites();
        setSelectedSprite(open[Math.min(open.length - 1, tabIndex)]);
    }

    createSpriteDisplay();
    saveSpritesToStorage();
}

function askRenameSprite(sprite) {
    spawnFormDialog({
        title: i18n('rename_sprite_title'),
        buttonText: i18n('rename_sprite_button'),
        rows: [ [ { label: i18n('rename_sprite_new_name'), type: 'text', id: 'name', autofocus: true } ] ],
        onsubmit: (data) => {
            if (data.name) {
                setSpriteName(sprite, data.name);

                const tabText = document.getElementById('tab_sprite_' + sprite.id + '_text');
                if (tabText) {
                    tabText.innerText = data.name;
                }

                const spriteText = document.getElementById('sprite_' + sprite.id + '_text');
                if (spriteText) {
                    spriteText.innerText = data.name;
                }

                saveSpritesToStorage();
                closePopup(popup);
            } else {
                return ['name'];
            }
        },
        mutate: (form) => { form.style.minWidth = '300px'; }
    });
}

function askDeleteSprite(sprite) {
    spawnConfirmDialog({
        title: i18n('delete_sprite_title'),
        text: i18n('delete_sprite_warning', { name: sprite.name }),
        buttons: [
            { text: i18n('delete_sprite_yes_button'), handler: () => deleteSpriteAction(sprite)  },
            { text: i18n('delete_sprite_no_button'), handler: () => {} }
        ]
    });
}

function duplicateSprite(sprite) {
    const clone = {
        name: iterateStringNumber(getSprites(), sprite.name), // todo: iterator copy number
        id: nextSpriteId(),
        width: sprite.width,
        height: sprite.height,
        frame: 0,
        frames: sprite.frames.map((frame, i) => copyFrame(frame, frame.name, i)),
        nextFrameId: sprite.frames.length
    };

    addSprite(clone);
    addOpenSprite(clone.id);
    createSpriteTab(clone);
    setSelectedSprite(clone.id);

    createSpriteDisplay();
    saveSpritesToStorage();
}

function createSpriteActions(sprite) {
    return [
        { text: i18n('sprite_dropdown_rename'), action: () => askRenameSprite(sprite) },
        { text: i18n('sprite_dropdown_duplicate'), action: () => duplicateSprite(sprite) },
        { text: i18n('sprite_dropdown_delete'), action: () => askDeleteSprite(sprite) }
    ];
}

function setSelectedSpriteListEntry(sprite) {
    if (State.SpriteState.listElt) {
        State.SpriteState.listElt.classList.remove('selected');
    }

    const elt = document.getElementById('sprite_' + sprite.id);
    if (elt) {
        elt.classList.add('selected');
    }
    State.SpriteState.listElt = elt;
}

function createSpriteListEntry(sprite) {
    const elt = document.createElement('div');
    elt.classList.add('list_item');
    elt.id = 'sprite_' + sprite.id;

    if (getSpriteId() === sprite.id) {
        elt.classList.add('selected');
        State.SpriteState.listElt = elt;
    }

    elt.appendChild(createTextSpan(sprite.name, 'sprite_' + sprite.id + '_text'));

    elt.addEventListener('click', () => {
        const tab = document.getElementById('tab_sprite_' + sprite.id);
        if (!tab) {
            addOpenSprite(sprite.id);
            createSpriteTab(sprite);
        }
        setSelectedSprite(sprite.id);
        
        createSpriteDisplay();
        saveSpritesToStorage();
    });

    State.elts.spriteList.appendChild(elt);

    replaceContextMenu(elt, 'horizontal', () => createSpriteActions(sprite));

    enableDragAndDrop({
        category: State.DragAndDrop.spriteList,
        elt: elt,
        data: sprite,
        ondrag: () => {
            if (getSpriteId() !== sprite.id) {
                setSelectedSprite(sprite.id);
                setSelectedSpriteTab(sprite);
                setSelectedSpriteListEntry(sprite);
                createFrameDisplay();
                saveSpritesToStorage();
            }
        },
        ondrop: (dragSprite) => {
            if (dragSprite.id !== sprite.id) {
                const currentOpenIndex = getSpriteIndexFromId(dragSprite.id)
                const targetOpenIndex = getSpriteIndexFromId(sprite.id);
                
                moveSpriteNextTo(currentOpenIndex, targetOpenIndex);
                setSelectedSprite(dragSprite.id);
                saveSpritesToStorage();
                createSpriteList();
            }
        }
    })
}

function createSpriteList() {
    State.elts.spriteList.innerHTML = '';

    getSprites().forEach((sprite) => {
        createSpriteListEntry(sprite);
    });
}

function getSpriteListActions() {
    return [
        { text: i18n('sprite_list_new_sprite'), action: () => newSprite() }
    ];
}

function initSpriteList() {
    State.elts.spriteListTitle.appendChild(createTextSpan(i18n('sprite_list_title')));

    replaceContextMenu(State.elts.spriteListTitle, 'horizontal', getSpriteListActions);
    replaceContextMenu(State.elts.spriteList, 'horizontal', getSpriteListActions);
}