
function createColourPicker(colour, isEmptyColour) {
    const elt = document.createElement('div');
    elt.classList.add('colour');
    elt.style.backgroundColor = colour;

    if (isEmptyColour) {
        elt.classList.add('crossed');

        // empty colour is selected by default
        elt.classList.add('selected');
        State.ColourState.elt = elt;
    }

    elt.addEventListener('click', () => {
        setColour(colour);

        if (State.ColourState.elt) {
            State.ColourState.elt.classList.remove('selected');
        }
        State.ColourState.elt = elt;
        elt.classList.add('selected');
    });

    State.elts.colourList.appendChild(elt);

    addColour(colour);
}

function createColours(colours) {
    setColours([]);
    State.elts.colourList.innerHTML = '';
    createColourPicker('', true);
    colours.forEach(colour => createColourPicker(colour));
}