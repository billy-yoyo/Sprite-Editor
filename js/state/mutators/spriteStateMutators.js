
function setSelectedSprite(spriteId) {
    State.SpriteState.sprite = spriteId;
    State.SpriteState.spriteIndex = getSpriteIndexFromId(spriteId);

    const sprite = getSprite();
    if (sprite) {
        State.FrameState.frameIndex = getFrameIndexFromId(sprite.frame);
    }
}

function nextSpriteId() {
    return State.SpriteState.nextId++;
}

function addSprite(sprite) {
    getSprites().push(sprite);
}

function addOpenSprite(spriteId) {
    getOpenSprites().push(spriteId);
}

function moveSpriteNextTo(currentSpriteIndex, targetSpriteIndex) {
    moveIndexNextTo(getSprites(), currentSpriteIndex, targetSpriteIndex);
}

function setSpriteName(sprite, name) {
    sprite.name = name;
}

function removeSpriteTab(sprite) {
    const open = getOpenSprites();
    const tabIndex = open.indexOf(sprite.id);
    if (tabIndex >= 0) {
        open.splice(tabIndex, 1);
    }
}

function removeSprite(sprite) {
    const index = getSpriteIndexFromId(sprite.id);
    if (index >= 0) {
        getSprites().splice(index, 1);
    }

    removeSpriteTab(sprite);
}

function moveSpriteTabNextTo(currentSpriteTabIndex, targetSpriteTabIndex) {
    moveIndexNextTo(getOpenSprites(), currentSpriteTabIndex, targetSpriteTabIndex);
}

function setProjectName(projectName) {
    State.SpriteState.projectName = projectName;
}