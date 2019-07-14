export default class Utils {
    static compileShader(src, type) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src)
        gl.compileShader(shader)
        return shader;
    }

    static linkProgram(vs, fs) {
        var program = gl.createProgram()
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        return program
    }

    static rotateXMatrix(alpha) {
        return [
            1, 0, 0, 0,
            0, Math.cos(alpha), Math.sin(alpha), 0,
            0, -Math.sin(alpha), Math.cos(alpha), 0,
            0, 0, 0, 1
        ]
    }

    static rotateZMatrix(a) {
        var cos = Math.cos(a)
        var sin = Math.sin(a)
        return [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    }

    static rotationMatrix(x, y, z) {
        var mat4 = []
        return mat4
    }
}