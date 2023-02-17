import { Injectable } from '@angular/core';
import { IProduct, IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  addToCart(product: IProduct, amount: number) {
    let storageArray: IProductSaved[];
    storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    let idPlacement = null;
    for (let i = 0; i < storageArray.length; i++) {
      if (storageArray[i].id === product.id) {
        idPlacement = i;
      }
    }

    if (idPlacement == null) {
      storageArray.push({ ...product, amount: amount + 1 });
      console.log(storageArray);
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount == 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount + 1;
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount >= 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount + 1;
      localStorage.setItem('cart', JSON.stringify(storageArray));
    } else if (idPlacement !== null && amount < 0) {
      storageArray[idPlacement].amount = storageArray[idPlacement].amount - 1;

      if (storageArray[idPlacement].amount == 0) {
        storageArray.splice(idPlacement, 1);
        localStorage.setItem('cart', JSON.stringify(storageArray));
      } else localStorage.setItem('cart', JSON.stringify(storageArray));
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
