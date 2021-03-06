import { gl } from './index.js'

export default class Utils {
    static compileShader(src, type) {
        let shader = gl.createShader(type)
        gl.shaderSource(shader, src)
        gl.compileShader(shader)
        return shader;
    }

    static linkProgram(vs, fs) {
        let program = gl.createProgram()
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        return program
    }

    static rotationMatrix(x, y, z, a) {
        let c = Math.cos(a)
        let s = Math.sin(a)
        let mat4 = [
            x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0,
            x * y * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0,
            x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0,
            0, 0, 0, 1
        ]
        return mat4
    }

    static readFile(fileName) {
        return fetch(fileName).then(resolve => {
            return resolve.text()
        })
    }
}