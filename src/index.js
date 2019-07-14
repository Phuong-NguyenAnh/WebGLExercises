import App from './webgl/App'


function createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.id = 'glCanvas'
    canvas.width = 640
    canvas.height = 480
    canvas.style = "border: 1px solid red;"
    return canvas;
}

document.body.appendChild(createCanvas());

global.canvas = document.getElementById('glCanvas')
global.gl = canvas.getContext('experimental-webgl')

var app = new App()
app.render()