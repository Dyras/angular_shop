import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  localStorageWriter(id: number, amount: number) {
    const storageCheck = localStorage.getItem(id.toString());
    if (storageCheck === null) {
      localStorage.setItem(id.toString(), '1');
    } else if (storageCheck !== null && amount > 0) {
      const currentCount = localStorage.getItem(id.toString());
      const newCount = parseInt(currentCount) + 1;
      localStorage.setItem(id.toString(), newCount.toString());
    } else if (storageCheck !== null && amount < 0) {
      const currentCount = localStorage.getItem(id.toString());
      const newCount = parseInt(currentCount) - 1;
      localStorage.setItem(id.toString(), newCount.toString());
    }
  }

  localStorageChecker(id: number) {
    const storageCheck = localStorage.getItem(id.toString());
    if (storageCheck === null) {
      return 0;
    } else {
      return parseInt(storageCheck);
    }
  }
}
