import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  addToCart(id: string, amount: number) {
    const storageCheck = localStorage.getItem(id.toString());
    if (storageCheck === null) {
      localStorage.setItem(id.toString(), '1');
    } else if (storageCheck !== null && amount > 0) {
      const currentCount = localStorage.getItem(id.toString());
      if (currentCount !== null) {
        const newCount = parseInt(currentCount) + 1;
        localStorage.setItem(id.toString(), newCount.toString());
      }
    } else if (storageCheck !== null && amount < 0) {
      const currentCount = localStorage.getItem(id.toString());
      if (currentCount !== null) {
        const newCount = parseInt(currentCount) - 1;
        localStorage.setItem(id.toString(), newCount.toString());
      }
    }
  }

  localStorageChecker(id: string): number {
    const storageCheck = localStorage.getItem(id.toString());
    return storageCheck === null ? 0 : parseInt(storageCheck);
  }
}
