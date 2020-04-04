
function createConfirmDialogButton(popup, button) {
    const elt = document.createElement('div');
    elt.classList.add('confirm_dialog_button');
    elt.appendChild(createTextSpan(button.text));

    elt.addEventListener('click', () => {
        if (!button.handler()) {
            closePopup(popup);
        }
    });
    return elt;
}

function spawnConfirmDialog(opts) {
    const elt = document.createElement('div');
    elt.classList.add('confirm_dialog');

    const text = document.createElement('div');
    text.classList.add('confirm_dialog_text');
    text.appendChild(createTextSpan(opts.text));
    elt.appendChild(text);

    const popup = spawnPopup(elt, { title: opts.title })

    const buttons = document.createElement('div');
    buttons.classList.add('confirm_dialog_buttons');
    opts.buttons.forEach((button) => {
        buttons.appendChild(createConfirmDialogButton(popup, button));
    });
    elt.appendChild(buttons);
}