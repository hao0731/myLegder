import { Injectable } from '@angular/core';
import { CaculateTotalInterface } from '../interface/caculate-total';

@Injectable()
export class CaculateTotalService implements CaculateTotalInterface {
  constructor() { }
  calcDesposit(array:any):number {
    let total: number = 0;
    for(let item of array) {
      (item.class !== '收益')?total -= Number(item.price):total += Number(item.price);
    }
    return total;
  }
  calcCost(array:any): number {
    let total: number = 0;
    for(let item of array) {
      if(item.class !== '收益') total += Number(item.price);
    }
    return total;
  }
  calcIncome(array:any): number {
    let total: number = 0;
    for(let item of array) {
      if(item.class === '收益') total += Number(item.price);
    }
    return total;
  }
}
