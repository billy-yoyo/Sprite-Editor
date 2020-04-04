

function changeFrameDimensions(width, height) {
    const sprite = getSprite();

    if (sprite) {
        sprite.width = width;
        sprite.height = height;

        sprite.frames.forEach((frame) => {
            if (frame.colours.length > height) {
                frame.colours.splice(height);
            } else {
                while (frame.colours.length < height) {
                    frame.colours.push(new Array(width).fill(0).map(() => ''));
                }
            }

            frame.colours.forEach((row) => {
                if (row.length > width) {
                    row.splice(width);
                } else {
                    while (row.length < width) {
                        row.push('');
                    }
                }
            });
        });

        createPixelDisplay();
        saveSpritesToStorage();
    }
}

function askChangeFrameDimensions() {
    spawnFormDialog({
        title: i18n('change_frame_dimensions_title'),
        button: i18n('change_frame_dimensions_button'),
        rows: [ [ { label: i18n('change_frame_dimensions_width'), type: 'number', id: 'width', autofocus: true },
                  { label: i18n('change_frame_dimensions_height'), type: 'number', id: 'height' } ] ],
        onsubmit: (data) => {
            if (!isNaN(data.width) && data.width > 0 && !isNaN(data.height) && data.height > 0) {
                changeFrameDimensions(data.width, data.height);
            } else {
                return ['width', 'height'].filter((name) => isNaN(data[name]) || data[name] <= 0);
            }
        }
    })
}

function createFrameTab() {
    createToolbarTab(i18n('frame_tab'), [
        { text: i18n('frame_tab_change_dimensions'), action: askChangeFrameDimensions },
    ]);
}