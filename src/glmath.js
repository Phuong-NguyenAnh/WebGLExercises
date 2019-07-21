export class Vector {
    v = []
    constructor(x, y, z, w) {
        this.v[0] = x
        this.v[1] = y
        this.v[2] = z
        this.v[3] = w
    }
    static create(p) {
        let result = new Vector()
        for (let i = 0; i < 4; ++i) result.v[i] = p[i]
        return result
    }
}

export class Matrix {
    m = []
    constructor() {
        for (let i = 0; i < 16; i++) {
            this.m[i] = 0.0;
        }
    }
    static createWith(p) {
        let result = new Matrix()
        for (let i = 0; i < 4; ++i)
            for (let j = 0; j < 4; ++j)
                result.m[i * 4 + j] = p[j * 4 + i]
        return result
    }
    get(row, col) {
        return this.m[col * 4 + row]
    }
    set(row, col, val) {
        this.m[col * 4 + row] = val
    }
    data() {
        return this.m
    }
    multipleTo(otherMatrix) {
        let result = new Matrix()
        for (let row = 0; row < 4; ++row)
            for (let col = 0; col < 4; ++col) {
                let sum = 0.0;
                for (let k = 0; k < 4; ++k)
                    sum += this.get(row, k) * otherMatrix.get(k, col);
                result.set(row, col, sum);
            }
        return result;
    }
    static identity() {
        let a = Matrix();
        for (let row = 0; row < 4; ++row)
            for (let col = 0; col < 4; ++col) {
                let value = row == col ? 1.0 : 0.0;
                a.set(row, col, value);
            }
        return a;
    }
    static translate(a, b, c) {
        let p =
            [
                1.0, 0.0, 0.0, a,
                0.0, 1.0, 0.0, b,
                0.0, 0.0, 1.0, c,
                0.0, 0.0, 0.0, 1.0,
            ]
        return Matrix.createWith(p);
    }

    static scale(a, b, c) {
        let p =
            [
                a, 0.0, 0.0, 0.0,
                0.0, b, 0.0, 0.0,
                0.0, 0.0, c, 0.0,
                0.0, 0.0, 0.0, 1.0,
            ]
        return Matrix.createWith(p);
    }

    // CCW
    static rotation(angle, x, y, z) {
        let mag = Math.sqrt(x * x + y * y + z * z);
        if (mag > 0.0) {
            let sinAngle = Math.sin(angle * Math.PI / 180.0);
            let cosAngle = Math.cos(angle * Math.PI / 180.0);

            x /= mag;
            y /= mag;
            z /= mag;

            let xx = x * x;
            let yy = y * y;
            let zz = z * z;
            let xy = x * y;
            let yz = y * z;
            let zx = z * x;
            let xs = x * sinAngle;
            let ys = y * sinAngle;
            let zs = z * sinAngle;
            let oneMinusCos = 1.0 - cosAngle;

            let p =
                [
                    oneMinusCos * xx + cosAngle, oneMinusCos * xy - zs, oneMinusCos * zx + ys, 0.0,
                    oneMinusCos * xy + zs, oneMinusCos * yy + cosAngle, oneMinusCos * yz - xs, 0.0,
                    oneMinusCos * zx - ys, oneMinusCos * yz + xs, oneMinusCos * zz + cosAngle, 0.0,
                    0.0, 0.0, 0.0, 1.0
                ]
            return Matrix.createWith(p);
        }
        else {
            return Matrix.identity();
        }
    }

    static frustum(l, r, b, t, n, f) {
        let p =
            [
                2 * n / (r - l), 0.0, (r + l) / (r - l), 0.0,
                0.0, 2 * n / (t - b), (t + b) / (t - b), 0.0,
                0.0, 0.0, -(f + n) / (f - n), -2 * f * n / (f - n),
                0.0, 0.0, -1.0, 0.0
            ]
        return Matrix.createWith(p);
    }

    static ortho(l, r, b, t, n, f) {
        let p =
            [
                2 / (r - l), 0.0, 0.0, -(r + l) / (r - l),
                0.0, 2 / (t - b), 0.0, -(t + b) / (t - b),
                0.0, 0.0, - 2 / (f - n), -(f + n) / (f - n),
                0.0, 0.0, 0.0, 1.0
            ]
        return Matrix.createWith(p);
    }
}