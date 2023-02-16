import { Injectable } from '@angular/core';
import { IProductSave } from './product-save';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  addToCart(id: string, amount: number) {
    let storageArray: IProductSave[];
    storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    let idPlacement = null;
    for (let i = 0; i < storageArray.length; i++) {
      if (storageArray[i].id === id) {
        idPlacement = i;
      }
    }

    if (idPlacement == null) {
      storageArray.push({ id: id, amount: amount + 1 });
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount == 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount + 1;
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount >= 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount + 1;
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount < 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount - 1;
      localStorage.setItem('cart', JSON.stringify(storageArray));
    }
  }

  localStorageChecker(id: string): number {
    const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    for (let i = 0; i < storageArray.length; i++) {
      if (storageArray[i].id === id) {
        return storageArray[i].amount;
      }
    }
    return 0;
  }
}
