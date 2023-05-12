import { type TMathFunction } from './../types';

export const getFunctionValues = (f:TMathFunction, start:number, end:number, step:number):[number[], number[]] => {
  const result1:number[] = [];
  const result2:number[] = [];
  for (let i = start; i < end; i += step) {
    result1.push(f(i));
    result2.push(+i.toFixed(4));
  }
  return [result1, result2];
};