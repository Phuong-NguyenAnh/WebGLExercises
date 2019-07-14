import Utils from './Utils';

class App {
    constructor() {
        var vsSource =
            'uniform mat4 u_transform;' +
            'attribute vec2 a_position;' +
            'attribute vec4 a_color;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '    v_color = a_color;' +
            '    gl_Position = u_transform * vec4(a_position, 0.0, 1.0);' +
            '}'
        var vs = Utils.compileShader(vsSource, gl.VERTEX_SHADER)

        var fsSource =
            'precision mediump float;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '   gl_FragColor = v_color;' +
            '}'
        var fs = Utils.compileShader(fsSource, gl.FRAGMENT_SHADER)

        var program = Utils.linkProgram(vs, fs)

        gl.useProgram(program)

        var positions = [
            0., .5,
            -.5, -.5,
            .5, -.5
        ]
        this.position_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        var positionLocation = gl.getAttribLocation(program, 'a_position')
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, positions)
        gl.enableVertexAttribArray(positionLocation)

        var colors = [
            1., 0., 0., 1.,
            0., 1., 0., 1.,
            0., 0., 1., 1.,
        ]
        this.color_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

        var colorLocation = gl.getAttribLocation(program, 'a_color')
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, colors)
        gl.enableVertexAttribArray(colorLocation)

        this.transformLocation = gl.getUniformLocation(program, 'u_transform')

        this.alpha = 0

        gl.clearColor(0, 0, 0, 1)
    }

    update() {
        this.alpha += Math.PI / 180;
        (this.alpha >= Math.PI * 2) && (this.alpha -= Math.PI * 2);
        var rotateMat = Utils.rotationMatrix(0, 0, 1, this.alpha)
        gl.uniformMatrix4fv(this.transformLocation, false, rotateMat)

    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
}

export default App