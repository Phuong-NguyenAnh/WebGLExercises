function component() {
    const element = document.createElement('canvas')
    element.id = 'glCanvas'
    element.width = 640
    element.height = 480
    return element;
}

document.body.appendChild(component());