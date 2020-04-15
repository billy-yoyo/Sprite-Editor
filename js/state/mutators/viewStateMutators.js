
function setPixelSize(pixelSize) {
    State.ViewState.pixelSize = pixelSize;
    localStorage.setItem('pixelSize', pixelSize);
}