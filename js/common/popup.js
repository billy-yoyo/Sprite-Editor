


function createPopup(innerElt, opts) {
    const elt = document.createElement('div');
    const popup = { elt: elt, alive: true }
    opts = opts || {};

    elt.classList.add('popup');

    if (!opts.disableToolbar) {
        const toolbar = document.createElement('div');
        toolbar.classList.add('popup_toolbar');

        if (opts.title) {
            const title = document.createElement('div');
            title.classList.add('popup_title');

            title.appendChild(createTextSpan(opts.title));

            toolbar.appendChild(title);
        }

        if (!opts.disableToolbar) {
            const closeButton = document.createElement('div');
            closeButton.classList.add('close_button');

            closeButton.appendChild(createTextSpan('x'));

            closeButton.addEventListener('click', () => {
                closePopup(popup);
            });

            toolbar.appendChild(closeButton);
        }

        addDragControls(elt, toolbar, popup);

        elt.appendChild(toolbar);
    }
    
    const container = document.createElement('div');
    container.classList.add('popup_container');
    container.appendChild(innerElt);

    elt.appendChild(container);
    return popup;
}

function spawnPopup(innerElt, opts) {
    const popup = createPopup(innerElt, opts);

    State.elts.root.appendChild(popup.elt);

    return popup;
}

function closePopup(popup) {
    popup.elt.remove();
    popup.alive = false;
}

function updatePopupInnerElt(popup, innerElt) {
    const elts = popup.elt.getElementsByClassName('popup_container');

    if (elts.length) {
        const container = elts[0];
        container.innerHTML = '';
        container.appendChild(innerElt);
    }
}