import Utils from './Utils.js';
import { canvas, gl } from './index.js'
import { Matrix } from './glmath.js'
// import { positions, texCoords, indicesSize, indices } from './Defines.js'

const positions = [
    -1, 1, 1,
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,

    -1, 1, -1,
    -1, -1, -1,
    1, -1, -1,
    1, 1, -1,
]

const colors = [
    0, 0, 0,
    0, 0, 1.0,
    0, 1.0, 0,
    0, 1.0, 1,

    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1
]

const indices = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    0, 5, 1, 0, 4, 5,
    3, 2, 6, 3, 6, 7,
    0, 3, 4, 4, 3, 7,
    1, 6, 2, 1, 5, 6
]

const ROTATE_SPEED = 3
const TRANSLATE_SPEED = 0.1
class App {
    constructor() {
        this.initDone = false
        Utils.readFile('../data/vs.glsl').then(vs => {
            return { vs: Utils.compileShader(vs, gl.VERTEX_SHADER) }
        }).then(resolve => {
            return Utils.readFile('../data/fs.glsl').then(fs => {
                return { ...resolve, fs: Utils.compileShader(fs, gl.FRAGMENT_SHADER) }
            })
        }).then((resolve) => {
            let program = Utils.linkProgram(resolve.vs, resolve.fs)
            gl.useProgram(program)
            return program
        }).then(program => {
            let position_buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

            var positionLocation = gl.getAttribLocation(program, 'aPosition')
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, positions)
            gl.enableVertexAttribArray(positionLocation)

            let color_buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

            var colorLocation = gl.getAttribLocation(program, 'aColor')
            gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, colors)
            gl.enableVertexAttribArray(colorLocation)

            let indicesBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

            this.modelMatrixLocation = gl.getUniformLocation(program, 'uModelMatrix')
            this.viewMatrixLocation = gl.getUniformLocation(program, 'uViewMatrix')
            this.projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix')

            gl.enable(gl.DEPTH_TEST)

            gl.clearColor(0, 0, 0, 1)

            let h = 1.0;
            let w = h * canvas.width / canvas.height;
            this.projectionMatrix = Matrix.frustum(-w / 2, w / 2, -h / 2, h / 2, 1, 50)
            this.viewMatrix = Matrix.translate(0., 0., -20)
            this.modelMatrix = Matrix.identity()

            gl.viewport(0, 0, canvas.width, canvas.height)
        }).then(() => {
            this.keyHandler = []
            this.initDone = true
        })
    }

    keyEvent(event) {
        switch (event.type) {
            case 'keydown':
                this.onKeyDown(event.key)
                break;
            case 'keyup':
                this.onKeyUp(event.key)
                break;
        }
    }

    onKeyDown(key) {
        if (!this.keyHandler.find(k => { return k === key })) {
            this.keyHandler.push(key)
        }
    }

    onKeyUp(key) {
        let index = this.keyHandler.findIndex(k => { return k === key })
        if (index != -1) {
            this.keyHandler.splice(index, 1)
        }
    }

    onTouchMove(ev) {
        const { movementX, movementY, buttons } = ev
        if (buttons === 1) {
            this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(ROTATE_SPEED, movementX, movementY, 0))
        }
    }

    update() {
        this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(0.5, 1, 1, 0))

        this.keyHandler.forEach(key => {
            switch (key) {
                case 'w':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(ROTATE_SPEED, 1, 0, 0))
                    break
                case 's':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(-ROTATE_SPEED, 1, 0, 0))
                    break
                case 'a':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(ROTATE_SPEED, 0, 1, 0))
                    break
                case 'd':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.rotation(-ROTATE_SPEED, 0, 1, 0))
                    break
                case 'ArrowUp':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.translate(0, TRANSLATE_SPEED, 0))
                    break
                case 'ArrowDown':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.translate(0, -TRANSLATE_SPEED, 0))
                    break
                case 'ArrowLeft':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.translate(-TRANSLATE_SPEED, 0, 0))
                    break
                case 'ArrowRight':
                    this.modelMatrix = this.modelMatrix.multipleTo(Matrix.translate(TRANSLATE_SPEED, 0, 0))
                    break
                case ' ':
                    this.modelMatrix = Matrix.identity()
                    break;
            }
        })
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix.data())
        gl.uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix.data())
        gl.uniformMatrix4fv(this.modelMatrixLocation, false, this.modelMatrix.data())
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    }
}

export default App