

/**
 * @typedef DragAndDropCategory
 * @type {object}
 * @property {string} name - the category name
 * @property {any} targetData - the current target data
 */

/**
 * @param {string} name
 * @returns {DragAndDropCategory} 
 */
function createDragAndDropCategory(name) {
    return {
        name: name,
        targetData: null
    }
}

/**
 * @typedef DragAndDropOptions
 * @type {object}
 * @property {DragAndDropCategory} category - category this element should belong to
 * @property {HTMLElement} elt - the element to add drag and drop functionality to
 * @property {any} data - the data to associate with this element
 * @property {(dragData: any) => void} [ondrop] - called when an element is dropped on to this one
 * @property {() => void} [ondrag] - called when this element is first dragged
 */

/**
 * 
 * @param {DragAndDropOptions} opts 
 */
function enableDragAndDrop(opts) {
    opts.elt.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('category', opts.category.name);
        opts.category.targetData = opts.data;

        if (opts.ondrag) {
            opts.ondrag();
        }
    });

    opts.elt.addEventListener('dragover', (e) => { 
        if (e.dataTransfer.getData('category') === opts.category.name) {
            e.preventDefault(); 
        }
    });

    opts.elt.addEventListener('drop', () => {
        if (opts.ondrop) {
            opts.ondrop(opts.category.targetData);
        }
    });

    opts.elt.draggable = true;
}