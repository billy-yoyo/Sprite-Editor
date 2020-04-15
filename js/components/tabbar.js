function closeTab(sprite) {
    const open = getOpenSprites();
    removeSpriteTab(sprite);

    setSelectedSprite(open[Math.min(open.length - 1, index)]);
    createSpriteDisplay();
    saveSpritesToStorage();
}

function createSpriteTabActions(sprite) {
    const tabActions = [
        { text: i18n('sprite_tab_close'), action: () => closeTab(sprite) }
    ];

    const spriteActions = createSpriteActions(sprite);

    return tabActions.concat(spriteActions);
}

function setSelectedSpriteTab(sprite) {
    if (State.SpriteState.tabElt) {
        State.SpriteState.tabElt.classList.remove('selected');
    }

    const elt = document.getElementById('tab_sprite_' + sprite.id);
    if (elt) {
        elt.classList.add('selected');
    }
    State.SpriteState.tabElt = elt;
}

function createSpriteTab(sprite) {
    const elt = document.createElement('div');
    elt.classList.add('tab');
    elt.id = 'tab_sprite_' + sprite.id;

    if (getSpriteId() === sprite.id) {
        elt.classList.add('selected');
        State.SpriteState.tabElt = elt;
    }

    elt.appendChild(createTextSpan(sprite.name, 'tab_sprite_' + sprite.id + '_text'));

    const closeButton = document.createElement('div');
    closeButton.classList.add('tab_close_button');
    closeButton.append(createTextSpan('x'));

    closeButton.addEventListener('click', (e) => {
        closeTab(sprite);

        e.stopImmediatePropagation();
    });

    elt.appendChild(closeButton);

    elt.addEventListener('click', () => {
        if (getSpriteId() !== sprite.id) {
            setSelectedSprite(sprite.id);
            saveSpritesToStorage();

            createSpriteDisplay();
        }
    });

    replaceContextMenu(elt, 'horizontal', () => createSpriteTabActions(sprite))

    State.elts.tabbar.appendChild(elt);

    enableDragAndDrop({
        category: State.DragAndDrop.spriteTab,
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
                const currentOpenIndex = getOpenSprites().indexOf(dragSprite.id);
                const targetOpenIndex = getOpenSprites().indexOf(sprite.id);
    
                moveSpriteTabNextTo(currentOpenIndex, targetOpenIndex);
                setSelectedSprite(dragSprite.id);
                createSpriteTabs();
                saveSpritesToStorage();
            }
        }
    });
}

function createSpriteTabs() {
    State.elts.tabbar.innerHTML = '';

    getOpenSprites().forEach((spriteId) => {
        const sprite = getSpriteById(spriteId);
        if (sprite) {
            createSpriteTab(sprite);
        }
    });
}

function updateDocumentTitle() {
    document.title = i18n('page_title', { projectName: getProjectName() });
}

function createSpriteDisplay() {
    updateDocumentTitle();
    createFrameDisplay();
    createSpriteTabs();
    createSpriteList();
}