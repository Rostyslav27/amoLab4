import { type TMathFunction } from './../types';

export const newtonMethod = (f: TMathFunction, f1: TMathFunction, a: number, b:number, e: number): [number, number] => {
  if (f(a) * f(b) >= 0) {
    throw new Error('Коренів на даному проміжку не існує');
  }

  let x;
  let iter = 0;

  while (Math.abs(b - a) > e && iter < 1000) {

    x = b - f(b) / f1(b);

    if (Math.abs(x - b) < e) {
      break;
    } else {
      b = x;
    }

    iter++;
  }

  if (iter === 1000) {
    throw new Error('Кількість ітерацій > 1000');
  }

  if (x === undefined) {
    throw new Error('Помилка');
  }
  
  return [x, iter];
}