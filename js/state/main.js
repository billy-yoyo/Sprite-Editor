

function main() {
    initSpriteState();
    initFrameState();

    State.elts.colourList = document.getElementById('colour_list');
    State.elts.frameList = document.getElementById('frame_list');
    State.elts.pixelCanvas = document.getElementById('pixel_canvas');
    State.elts.toolbar = document.getElementById('toolbar');
    State.elts.root = document.getElementById('root');
    State.elts.fileInput = document.getElementById('file_input');
    State.elts.tabbar = document.getElementById('tabbar');
    State.elts.spriteList = document.getElementById('sprite_list');
    State.elts.spriteListTitle = document.getElementById('sprite_list_title');
    State.elts.frameListTitle = document.getElementById('frame_list_title');
    State.elts.frameView = document.getElementById('frame_view');
    State.elts.canvasContainer = document.getElementById('canvas_container');
    State.elts.frameList = document.getElementById('frame_list');
    State.elts.animationControls = document.getElementById('animation_controls');
    State.elts.animationRowNames = document.getElementById('animation_row_names');
    State.elts.animationRowFrames = document.getElementById('animation_row_frames');
    State.elts.animationView = document.getElementById('animation_view');

    State.DragAndDrop.spriteList = createDragAndDropCategory('sprite_list');
    State.DragAndDrop.spriteTab = createDragAndDropCategory('sprite_tab');
    State.DragAndDrop.frameList = createDragAndDropCategory('frame_list');
    State.DragAndDrop.animationView = createDragAndDropCategory('animation_view');
    State.DragAndDrop.animationNodes = createDragAndDropCategory('animation_nodes');

    State.ViewState.pixelSize = parseInt(localStorage.getItem('pixelSize') || 30);

    initPixelDisplay();
    initSpriteList();
    initFrameList();
    createGlobalCloseDropdownListener();

    createFileTab();
    createViewTab();
    createFrameTab();

    createColours(['#be4a2f', '#d77643', '#ead4aa', '#e4a672', '#b86f50', '#733e39', '#3e2731', '#a22633', '#e43b44', '#f77622',
        '#feae34', '#fee761', '#63c74d', '#3e8948', '#265c42', '#193c3e', '#124e89', '#0099db', '#2ce8f5', '#ffffff', '#c0cbdc',
        '#8b9bb4', '#5a6988', '#3a4466', '#262b44', '#181425', '#ff0044', '#68386c', '#b55088', '#f6757a', '#e8b796', '#c28569']);

    loadSpritesFromStorage();
    saveSpritesToStorage();
}