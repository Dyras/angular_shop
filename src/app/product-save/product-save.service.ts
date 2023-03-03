import { Injectable } from '@angular/core';
import { IProduct, IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  updateCart(product: IProduct, amount: number) {
    console.log(product, amount);
    if (product.id !== '0') {
      let storageArray: IProductSaved[];
      storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
      let idPlacement = null;
      for (let i = 0; i < storageArray.length; i++) {
        if (storageArray[i].id === product.id) {
          idPlacement = i;
        }
      }

      if (idPlacement == null) {
        storageArray.push({ ...product, amount: amount });
        console.log(storageArray);
        localStorage.setItem('cart', JSON.stringify(storageArray));
      } else if (idPlacement !== null && amount < 0) {
        storageArray.splice(idPlacement, 1);
        localStorage.setItem('cart', JSON.stringify(storageArray));
      } else if (idPlacement !== null && amount > 0) {
        storageArray[idPlacement].amount = amount;
        localStorage.setItem('cart', JSON.stringify(storageArray));
      }
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
