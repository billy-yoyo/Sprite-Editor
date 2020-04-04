
function changePixelSize() {
    spawnFormDialog({
        title: i18n('change_pixel_size_title'),
        button: i18n('change_pixel_size_button'),
        rows: [ [ { label: i18n('change_pixel_size_label'), type: 'number', label: 'size', autofocus: true } ] ],
        onsubmit: (data) => {
            if (!isNaN(data.size) && data.size >= 7 && data.size <= 300) {
                setPixelSize(data.size);
                createPixelDisplay();
            } else {
                return ['size'];
            }
        },
        mutate: (form) => { form.style.minWidth = '200px'; }
    })
}

function createViewTab() {
    createToolbarTab(i18n('view_tab'), [
        { text: i18n('view_tab_change_pixel_size'), action: changePixelSize },
        { text: i18n('view_tab_animation_controls'), action: openAnimationControls }
    ]);
}