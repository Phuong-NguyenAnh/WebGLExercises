import Utils from './Utils.js';
import { canvas, gl } from '../index.js'
import { Matrix } from '../glmath.js'

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

class App {
    constructor() {
        var vsSource =
            'uniform mat4 uModelMatrix;' +
            'uniform mat4 uViewMatrix;' +
            'uniform mat4 uProjectionMatrix;' +
            'attribute vec3 aPosition;' +
            'attribute vec3 aColor;' +
            'varying vec3 vColor;' +
            'void main()' +
            '{' +
            '    vColor = aColor;' +
            '    gl_Position = uModelMatrix * vec4(aPosition, 1.0);' +
            '}'
        var vs = Utils.compileShader(vsSource, gl.VERTEX_SHADER)

        var fsSource =
            'precision mediump float;' +
            'varying vec3 vColor;' +
            'void main()' +
            '{' +
            '   gl_FragColor = vec4(vColor, 1.0);' +
            '}'
        var fs = Utils.compileShader(fsSource, gl.FRAGMENT_SHADER)

        var program = Utils.linkProgram(vs, fs)

        gl.useProgram(program)

        this.position_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        var positionLocation = gl.getAttribLocation(program, 'aPosition')
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, positions)
        gl.enableVertexAttribArray(positionLocation)

        this.color_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

        var colorLocation = gl.getAttribLocation(program, 'aColor')
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, colors)
        gl.enableVertexAttribArray(colorLocation)

        this.indicesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        this.modelMatrixLocation = gl.getUniformLocation(program, 'uModelMatrix')
        this.viewMatrixLocation = gl.getUniformLocation(program, 'uViewMatrix')
        this.projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix')

        gl.enable(gl.DEPTH_TEST)

        gl.clearColor(0, 0, 0, 1)

        this.angle = 0
    }

    update() {
        this.angle += 1;
        (this.angle >= 360) && (this.angle -= 360)

        let h = 1.0;
        let w = h * canvas.width / canvas.height;
        let projectionMatrix = Matrix.frustum(-w / 2, w / 2, -h / 2, h / 2, 1, 50)
        let translateMatrix = Matrix.translate(0., 0., -4.)
        let modelMatrix = projectionMatrix.multipleTo(translateMatrix)
        modelMatrix = modelMatrix.multipleTo(Matrix.rotation(this.angle, 1, 1, 0))
        gl.uniformMatrix4fv(this.modelMatrixLocation, false, modelMatrix.data())
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    }
}

export default App