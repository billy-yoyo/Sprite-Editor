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
        spriteTab: null,
        animationView: null,
        animationNodes: null
    },
    ViewState: {
        ctx: null,
        pixelSize: 1,
        lastMouse: { x: 0, y: 0 },
        lastGridCoords: { x: 0, y: 0}
    },
    elts: {
        colourList: null,
        frameList: null,
        pixelCanvas: null,
        toolbar: null,
        root: null,
        fileInput: null,
        tabbar: null,
        spriteList: null,
        spriteListTitle: null,
        frameListTitle: null,
        frameList: null,
        frameView: null,
        canvasContainer: null,
        animationRowNames: null,
        animationRowFrames: null,
        animationControls: null,
        animationView: null,
    }
};

function initFrameState() {
    State.FrameState = {
        elts: [],
        frameIndex: null
    };
}

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

