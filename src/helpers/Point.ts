import Matrix from './Matrix';

class Point {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  matrixTransform(matrix: Matrix) {
    const x = this.x;
    const y = this.y;

    this.x = x * matrix.a + y * matrix.c + matrix.e;
    this.y = x * matrix.b + y * matrix.d + matrix.f;
  }
}

export default Point;
