import App from './App.js'


function createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.id = 'glCanvas'
    canvas.width = 640
    canvas.height = 480
    canvas.style = "border: 1px solid red;"
    return canvas;
}

document.body.appendChild(createCanvas());

var canvas = document.getElementById('glCanvas')
var gl = canvas.getContext('experimental-webgl')

var app = new App()

window.addEventListener('keydown', app.keyEvent, false)
window.addEventListener('keyup', app.keyEvent, false)

function renderLoop() {
    app.render()
    app.update()
    window.setTimeout(renderLoop, 1000 / 60)
}

renderLoop()

export { canvas, gl }