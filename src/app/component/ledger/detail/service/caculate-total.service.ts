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

  analysisClass(array:any): any {
    const className = ['食','衣','住','行','育','樂','收益']; 
    let Class = [0,0,0,0,0,0,0];
    for(let item of array) {
      for(let i = 0; i < 7;i++) {
        if(item.class === className[i]) Class[i] += Number(item.price);
      }
    }
    return Class;
  }
}
