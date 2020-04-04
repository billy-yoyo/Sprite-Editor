const State = {
    ColourState: {
        colour: '',
        elt: null,
        colours: []
    },
    FrameState: {},
    SpriteState: {},
    DropdownState: {
        dropdowns: []
    },
    AnimationState: {
        controlsPopup: null,
        controllers: {}
    },
    DragAndDrop: {
        spriteList: null,
        frameList: null,
        spriteTab: null
    },
    ViewState: {
        pixelSize: 1
    },
    elts: {
        colourList: null,
        frameList: null,
        pixelTable: null,
        toolbar: null,
        root: null,
        fileInput: null,
        tabbar: null,
        spriteList: null,
        spriteListTitle: null,
        frameListTitle: null,
        frameList: null,
        canvasContainer: null
    }
};

function initSpriteState() {
    State.SpriteState = {
        tabElt: null,
        listElt: null,
        nextId: 0,
        sprite: null,
        spriteIndex: null,
        sprites: [],
        open: [],
        projectName: null
    };
}

function initFrameState() {
    State.FrameState = {
        elts: [],
        frameIndex: null
    };
}

function setSelectedSprite(spriteId) {
    State.SpriteState.sprite = spriteId;
    State.SpriteState.spriteIndex = getSpriteIndexFromId(spriteId);

    const sprite = getSprite();
    if (sprite) {
        State.FrameState.frameIndex = getFrameIndexFromId(sprite.frame);
    }
}

function getSprite() {
    return State.SpriteState.sprites[State.SpriteState.spriteIndex];
}

function getSpriteById(spriteId) {
    for (let sprite of State.SpriteState.sprites) {
        if (sprite.id === spriteId) {
            return sprite;
        }
    }
    return null;
}

function nextSpriteId() {
    return State.SpriteState.nextId++;
}

function getSpriteIndexFromId(spriteId) {
    for (let i = 0; i < State.SpriteState.sprites.length; i++) {
        if (State.SpriteState.sprites[i].id === spriteId) {
            return i;
        }
    }
    return null;
}

function getFrames() {
    const sprite = getSprite();

    if (sprite) {
        return sprite.frames;
    }

    return [];
}

function setFrames(frames) {
    const sprite = getSprite();
    if (sprite) {
        sprite.frames = frames;
    }
}

function getFrame() {
    return getFrames()[getFrameIndex()] || { colours: [] };
}

function nextFrameId() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.nextFrameId++;
    }
    return 0;
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

function getFrameIndex() {
    return State.FrameState.frameIndex;
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

function getFrameWidth() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.width;
    }
    return 0;
}

function setFrameWidth(width) {
    const sprite = getSprite();
    if (sprite) {
        sprite.width = width;
    }
}

function getFrameHeight() {
    const sprite = getSprite();
    if (sprite) {
        return sprite.height;
    }
    return 0;
}

function setFrameHeight(height) {
    const sprite = getSprite();
    if (sprite) {
        sprite.height = height;
    }
}

function setPixelSize(pixelSize) {
    State.ViewState.pixelSize = pixelSize;
    localStorage.setItem('pixelSize', pixelSize);
}

function main() {
    initSpriteState();
    initFrameState();

    State.elts.colourList = document.getElementById('colour_list');
    State.elts.frameList = document.getElementById('frame_list');
    State.elts.pixelTable = document.getElementById('pixel_table');
    State.elts.toolbar = document.getElementById('toolbar');
    State.elts.root = document.getElementById('root');
    State.elts.fileInput = document.getElementById('file_input');
    State.elts.tabbar = document.getElementById('tabbar');
    State.elts.spriteList = document.getElementById('sprite_list');
    State.elts.spriteListTitle = document.getElementById('sprite_list_title');
    State.elts.frameListTitle = document.getElementById('frame_list_title');
    State.elts.canvasContainer = document.getElementById('canvas_container');
    State.elts.frameList = document.getElementById('frame_list');

    State.DragAndDrop.spriteList = createDragAndDropCategory('sprite_list');
    State.DragAndDrop.spriteTab = createDragAndDropCategory('sprite_tab');
    State.DragAndDrop.frameList = createDragAndDropCategory('frame_list');

    State.ViewState.pixelSize = parseInt(localStorage.getItem('pixelSize') || 30);

    disableContextMenu(State.elts.pixelTable);

    initSpriteList();
    initFrameList();
    initPixelDisplay();
    createGlobalCloseDropdownListener();

    createFileTab();
    createViewTab();
    createFrameTab();

    createColours(['#be4a2f', '#d77643', '#ead4aa', '#e4a672', '#b86f50', '#733e39', '#3e2731', '#a22633', '#e43b44', '#f77622',
        '#feae34', '#fee761', '#63c74d', '#3e8948', '#265c42', '#193c3e', '#124e89', '#0099db', '#2ce8f5', '#ffffff', '#c0cbdc',
        '#8b9bb4', '#5a6988', '#3a4466', '#262b44', '#181425', '#ff0044', '#68386c', '#b55088', '#f6757a', '#e8b796', '#c28569']);

    loadSpritesFromStorage();
    saveSpritesToStorage();

    spawnAnimationControls();
}