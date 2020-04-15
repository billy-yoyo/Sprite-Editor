


function newSprite() {
    spawnFormDialog({
        title: i18n('create_sprite_title'),
        buttonText: i18n('create_sprite_button'),
        rows: [
            [{ type: 'text', label: i18n('create_sprite_name'), id: 'name', autofocus: true }],
            [{ type: 'number', label: i18n('create_sprite_width'), id: 'width', default: 4 }, 
             { type: 'number', label: i18n('create_sprite_height'), id: 'height', default: 4 }, 
             { type: 'number', label: i18n('create_sprite_frames'), id: 'frames', default: 1 }]
        ],
        onsubmit: (data) => {
            if (!isNaN(data.width) && !isNaN(data.height) && !isNaN(data.frames)) {
                const id = nextSpriteId();
                const name = data.name || i18n('default_sprite_name', { index: id + 1 });
                const sprite = {
                    name: name,
                    id: id,
                    width: data.width,
                    height: data.height,
                    frame: 0,
                    frames: new Array(data.frames).fill(0).map((_, i) => createEmptyFrame(null, i, data.width, data.height)),
                    nextFrameId: data.frames
                };

                addSprite(sprite);
                addOpenSprite(sprite.id);
                createSpriteTab(sprite);
                setSelectedSprite(sprite.id);

                createSpriteDisplay();
                saveSpritesToStorage();
            } else {
                return ['width', 'height', 'frames'].filter((name) => isNaN(data[name]));
            }
        }
    });
}

function newProject() {
    spawnFormDialog({
        title: i18n('create_project_title'),
        buttonText: i18n('create_project_button'),
        rows: [
            [{ type: 'text', label: i18n('create_project_name'), id: 'name', autofocus: true }],
            [{ text: i18n('create_project_warning') }]
        ],
        onsubmit: (data) => {
            const name = data.name;
            if (name) {
                initSpriteState();
                initFrameState();

                setProjectName(name);

                createSpriteDisplay();
                saveSpritesToStorage();
            } else {
                return ['name'];
            }
        },
        mutate: (form) => { form.style.maxWidth = '500px'; }
    });
}

function renameProject() {
    spawnFormDialog({
        title: i18n('rename_project_title'),
        buttonText: i18n('rename_project_button'),
        rows: [ [ { label: i18n('rename_project_new_name'), type: 'text', id: 'name', autofocus: true } ] ],
        onsubmit: (data) => {
            const name = data.name;
            if (name) {
                setProjectName(name);

                updateDocumentTitle();
                saveSpritesToStorage();
            } else {
                return ['name'];
            }
        },
        mutate: (form) => { form.style.minWidth = '300px'; }
    })
}

function createFileTab() {
    createToolbarTab(i18n('file_tab'), [
        { text: i18n('file_tab_rename_project'), action: renameProject },
        { text: i18n('file_tab_new_sprite'), action: newSprite },
        { text: i18n('file_tab_new_project'), action: newProject },
        { text: i18n('file_tab_open_project'), action: openSpritesFromFile },
        { text: i18n('file_tab_save_project'), action: saveSpritesToStorage },
        { text: i18n('file_tab_export_project'), action: exportSpritesToFile },
    ]);
}