
function createDropdownActionElement(dropdown, action) {
    const elt = document.createElement('div');
    elt.classList.add('dropdown_action');
    
    const text = document.createElement('span');
    text.innerText = action.text;

    elt.appendChild(text);

    // subactions
    if (action.action.length) {
        const arrow = document.createElement('span');

        arrow.style.fontSize = '1.3rem';
        arrow.style.marginBottom = '3px';
        arrow.innerText = '›';

        elt.addEventListener('click', () => {
            closeDropdownChildren(dropdown);
            spawnDropdown(dropdown, elt, 'horizontal', action.action);
        });

        addHoverListener(elt, 250, () => {
            closeDropdownChildren(dropdown);
            spawnDropdown(dropdown, elt, 'horizontal', action.action);
        });

        elt.appendChild(arrow);
    } else {
        elt.addEventListener('click', () => {
            closeDropdownTree(dropdown);

            action.action();
        });

        addHoverListener(elt, 250, () => {
            closeDropdownChildren(dropdown);
        });
    }

    return elt;
}

function createDropdownElement(parent, actions) {
    const elt = document.createElement('div');
    const dropdown = { elt: elt, parent: parent, children: [], alive: true }
    elt.classList.add('dropdown');

    if (parent) {
        parent.children.push(dropdown);
    }

    actions.forEach((action) => {
        if (!action.condition || action.condition()) {
            elt.appendChild(createDropdownActionElement(dropdown, action));
        }
    });

    return dropdown;
}

function spawnDropdown(parent, anchor, axis, actions, keepOtherDropdowns) {
    if (!parent && !keepOtherDropdowns) {
        closeAllDropdowns();
    }

    const dropdown = createDropdownElement(parent, actions);

    State.elts.root.appendChild(dropdown.elt);

    let rect;

    if (anchor instanceof HTMLElement) {
        rect = anchor.getBoundingClientRect();
    } else if (anchor.left !== undefined && anchor.right !== undefined 
            && anchor.top !== undefined && anchor.bottom !== undefined) {
        rect = anchor;
    } else if (anchor.left !== undefined && anchor.top !== undefined) {
        rect = { left: anchor.left, top: anchor.top, right: anchor.left, bottom: anchor.top };
    } else if (anchor.x !== undefined && anchor.y !== undefined) {
        rect = { left: anchor.x, top: anchor.y, right: anchor.x, bottom: anchor.y }
    } else {
        rect = anchor;
    }
    const dropdownRect = dropdown.elt.getBoundingClientRect();

    if (axis === 'vertical') {
        // more space above
        if (rect.top > window.innerHeight - rect.left) {
            x = rect.left;
            y = rect.top - dropdownRect.height;
        } else {
            x = rect.left;
            y = rect.bottom;
        }
    } else {
        // more space to left
        if (rect.left > window.innerWidth - rect.right) {
            x = rect.left - dropdownRect.width;
            y = rect.top;
        } else {
            x = rect.right;
            y = rect.top;
        }
    }

    console.log(rect);

    if (x < 0) {
        x = 0;
    } else if (x + dropdownRect.width > window.innerWidth) {
        x = window.innerWidth - dropdownRect.width;
    }

    if (y < 0) {
        y = 0;
    } else if (y + dropdownRect.height > window.innerHeight) {
        y = window.innerHeight - dropdownRect.height;
    }

    console.log(`x=${x}, y=${y}`);

    dropdown.elt.style.left = '' + x + 'px';
    dropdown.elt.style.top = '' + y + 'px';

    State.DropdownState.dropdowns.push(dropdown);

    return dropdown;
}

function closeDropdownChildren(dropdown) {
    dropdown.children.forEach((child) => {
        closeDropdown(child);
    });
}

function closeDropdown(dropdown) {
    dropdown.elt.remove();
    dropdown.alive = false;
    closeDropdownChildren(dropdown);
}

function closeDropdownTree(dropdown) {
    let root = dropdown;
    while (root.parent) {
        root = root.parent;
    }

    closeDropdown(root);
}

function closeAllDropdowns() {
    State.DropdownState.dropdowns.forEach(closeDropdown);

    State.DropdownState.dropdowns = [];
}

function createGlobalCloseDropdownListener() {
    document.addEventListener('mousedown', (e) => {
        if (e.buttons <= 3 && !e.target.closest('.dropdown, .tab, .frame')) {
            closeAllDropdowns()
        }
    });
}

function createToolbarTab(text, actions) {
    const elt = document.createElement('div');
    elt.classList.add('tab');
    elt.innerText = text;

    let lastDropdown = null;

    elt.addEventListener('click', () => {
        if (lastDropdown && lastDropdown.alive) {
            closeDropdown(lastDropdown);
        } else {
            lastDropdown = spawnDropdown(null, elt, 'vertical', actions);
        }
    });

    disableContextMenu(elt);

    State.elts.toolbar.appendChild(elt);
}