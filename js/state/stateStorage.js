

const FRAME_ESCAPE_CHAR = '\\';
const FRAME_ESCAPE_CHAR_CODE = FRAME_ESCAPE_CHAR.charCodeAt(0);

function getFramesData(frames) {
    let data = '';

    frames.forEach((frame) => {
        data += frame.name + FRAME_ESCAPE_CHAR;
        data += '' + frame.id + FRAME_ESCAPE_CHAR;
        data += '' + frame.parentId + FRAME_ESCAPE_CHAR;
        data += '' + frame.selectedChildId + FRAME_ESCAPE_CHAR;
        data += String.fromCharCode(frame.visible);
        frame.colours.forEach((row) => {
            row.forEach((colour) => {
                let index = State.ColourState.colours.indexOf(colour);
                data += String.fromCharCode(Math.max(0, index));
            });
        });
    });

    return btoa(data);
}

function getSpriteData(sprite) {
    return {
        name: sprite.name,
        id: sprite.id,
        width: sprite.width,
        height: sprite.height,
        frame: sprite.frame,
        frames: getFramesData(sprite.frames),
        nextFrameId: sprite.nextFrameId
    }
}

function loadSprite(spriteData) {
    const data = atob(spriteData.frames);
    
    let index = 0;
    function next() {
        return data.charCodeAt(index++);
    }

    function readDataEntry() {
        let entry = '';
        let char = next();
        while (char !== FRAME_ESCAPE_CHAR_CODE && index < data.length) {
            entry += String.fromCharCode(char);
            char = next();
        } 
        return entry;
    }

    const frames = [];
    while (index < data.length) {   
        let name = readDataEntry();
        let id = parseInt(readDataEntry());
        let parentId = parseInt(readDataEntry());
        let selectedChildId = parseInt(readDataEntry());
        let visible = next() == 1;

        let colours = new Array(spriteData.height).fill().map(() => 
            new Array(spriteData.width).fill().map(() => State.ColourState.colours[next()] || '')
        );

        frames.push({
            name: name,
            id: id,
            parentId: parentId,
            selectedChildId: selectedChildId,
            visible: visible,
            colours: colours
        });
    }

    return {
        name: spriteData.name,
        id: spriteData.id,
        width: spriteData.width,
        height: spriteData.height,
        frame: spriteData.frame,
        frames: frames,
        nextFrameId: spriteData.nextFrameId
    };
}

function getSpritesData() {
    return {
        sprite: State.SpriteState.sprite,
        nextId: State.SpriteState.nextId,
        sprites: State.SpriteState.sprites.map(getSpriteData),
        open: State.SpriteState.open,
        projectName: State.SpriteState.projectName
    };
}

function loadSpritesData(spritesData) {
    State.SpriteState.sprites = spritesData.sprites.map(loadSprite);
    State.SpriteState.nextId = spritesData.nextId;
    State.SpriteState.open = spritesData.open || [];
    State.SpriteState.projectName = spritesData.projectName || null;
    setSelectedSprite(spritesData.sprite);

    createSpriteDisplay();
}

function saveSpritesToStorage() {
    localStorage.setItem('sprites', JSON.stringify(getSpritesData()));
}

function loadSpritesFromStorage() {
    const spritesData = localStorage.getItem('sprites');

    if (spritesData) {
        loadSpritesData(JSON.parse(spritesData));
    }
}

function exportSpritesToFile() {
    let filename = i18n('default_filename');

    if (State.SpriteState.projectName) {
        filename = ensureValidFilename(State.SpriteState.projectName) + '.json';
    }

    download(filename, JSON.stringify(getSpritesData()));
}

function openSpritesFromFile() {
    State.elts.fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsText(file);
        reader.onload = (e) => {
            loadSpritesData(JSON.parse(e.target.result));
        };
    };

    State.elts.fileInput.click();
}