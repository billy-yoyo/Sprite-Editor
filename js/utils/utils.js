
function disableContextMenu(elt) {
    elt.addEventListener('contextmenu', (e) => { e.preventDefault(); });
}

function replaceContextMenu(elt, axis, actionsFactory) {
    elt.addEventListener('contextmenu', (e) => {
        spawnDropdown(null, { x: e.clientX, y: e.clientY }, axis, actionsFactory());

        e.preventDefault();
        e.stopPropagation();
    });
}

function createEmptyColours(width, height) {
    const colours = [];
    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            row.push('');
        }
        colours.push(row);
    }
    return colours;
}

function addHoverListener(elt, hoverTime, handler) {
    let hoverStartTime = 0;

    elt.addEventListener('mouseenter', (e) => {
        const startTime = new Date().getTime();
        hoverStartTime = startTime;

        setTimeout(() => {
            if (hoverStartTime === startTime) {
                handler(e);
            }
        }, hoverTime);
    });

    elt.addEventListener('mouseleave', () => {
        hoverStartTime = 0;
    });
}

function addDragControls(movingElt, controlElt, dependant) {
    let dragAnchor = null;

    controlElt.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) {
            const rect = movingElt.getBoundingClientRect();
            dragAnchor = { x: rect.left - e.clientX, y: rect.top - e.clientY};
        }
    });

    addDependantListener(dependant || controlElt, 'mouseup', (e) => {
        dragAnchor = null;
    });

    addDependantListener(dependant || controlElt, 'mousemove', (e) => {
        if (dragAnchor) {
            let x = dragAnchor.x + e.clientX,
                y = dragAnchor.y + e.clientY,
                rect = movingElt.getBoundingClientRect();

            if (x < 0) {
                x = 0;
            } else if (x + rect.width > window.innerWidth) {
                x = window.innerWidth - rect.width;
            }

            if (y < 0) {
                y = 0;
            } else if (y + rect.height > window.innerHeight) {
                y = window.innerHeight - rect.height;
            }

            movingElt.style.left = `${x}px`;
            movingElt.style.top = `${y}px`;
        }
    });
}

function addDependantListener(elt, listenerType, listener) {
    document.addEventListener(listenerType, (e) => {
        if (elt.alive === false || (elt.alive === undefined && !document.body.contains(elt))) {
            document.removeEventListener(listenerType, listener);
        } else {
            listener(e);
        }
    });
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function readSingleFile(callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        callback(e.target.result);
    };
    
}

function createTextSpan(text, spanId) {
    const elt = document.createElement('span');
    elt.innerText = text;
    if (spanId) {
        elt.id = spanId;
    }
    return elt;
}

function ensureValidFilename(filename) {
    return filename.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "")
}

function moveIndexNextTo(arr, currentIndex, targetIndex) {
    if (currentIndex >= 0 && targetIndex >= 0) {
        if (currentIndex < targetIndex) {
            arr.splice(targetIndex + 1, 0, arr[currentIndex]);
            arr.splice(currentIndex, 1);
        } else {
            arr.splice(targetIndex, 0, arr[currentIndex]);
            arr.splice(currentIndex + 1, 1);
        }
    }
}

function swapIndexes(arr, currentIndex, targetIndex) {
    const currentVal = arr[currentIndex];
    const targetVal = arr[targetIndex];

    arr[currentIndex] = targetVal;
    arr[targetIndex] = currentVal;
}

function iterateStringNumber(objs, str) {
    let name = str;
    if (!objs.some((obj) => obj.name === name)) {
        return name;
    }

    const spl = str.split(' ');
    const copy = i18n('copy');
    if (spl[spl.length - 1] !== copy && (spl.length <= 1 || spl[spl.length - 2] !== copy || isNaN(parseInt(spl[spl.length - 1])))) {
        name += ' ' + copy;
        if (!objs.some((obj) => obj.name === name)) {
            return name;
        }
        spl.push(copy);
    }

    if (spl[spl.length - 1] === copy) {
        spl.push('2');        
    }

    let i = parseInt(spl[spl.length - 1]), curName = spl.join(' ');
    while (objs.some((obj) => obj.name === curName)) {
        i++;
        spl[spl.length - 1] = '' + i;
        curName = spl.join(' ');
    }

    return curName;
}

function findNearestNeighbour(arr, index, condition) {
    let off = 1;
    while (arr[index - off] || arr[index + off]) {
        if (arr[index - off] && condition(arr[index - off])) {
            return arr[index - off];
        } else if (arr[index + off] && condition(arr[index + off])) {
            return arr[index + off];
            break;
        }
        off++;
    }

    return null;
}