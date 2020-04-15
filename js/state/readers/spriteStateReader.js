
function getSpriteId() {
    return State.SpriteState.sprite;
}

function getSpriteIndex() {
    return State.SpriteState.spriteIndex;
}

function getSprites() {
    return State.SpriteState.sprites;
}

function getSprite() {
    return getSprites()[getSpriteIndex()];
}

function getSpriteById(spriteId) {
    for (let sprite of getSprites()) {
        if (sprite.id === spriteId) {
            return sprite;
        }
    }
    return null;
}

function getSpriteIndexFromId(spriteId) {
    const sprites = getSprites();
    for (let i = 0; i < sprites.length; i++) {
        if (sprites[i].id === spriteId) {
            return i;
        }
    }
    return null;
}

function getOpenSprites() {
    return State.SpriteState.open;
}

function getProjectName() {
    return State.SpriteState.projectName;
}