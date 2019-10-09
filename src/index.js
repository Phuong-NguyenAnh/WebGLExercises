import _ from 'lodash'

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

window.addEventListener('keydown', (event)=>{app.keyEvent(event)})
window.addEventListener('keyup', (event)=>{app.keyEvent(event)})

document.addEventListener("pointermove", (ev)=>{app.onTouchMove(ev)})
document.addEventListener("touchmove", (ev)=>{app.onTouchMove(ev)})

document.getElementsByTagName("body")[0].onresize = app.onResize;

function renderLoop() {
    if (app.initDone) {
        app.render()
        app.update()
    } else {
        // show loading
    }
    window.setTimeout(renderLoop, 1000 / 60)
}

renderLoop()

export { canvas, gl }