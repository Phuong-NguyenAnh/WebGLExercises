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
}