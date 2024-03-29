import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from '@angular/fire/firestore';

import { IProduct } from './product';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  ref = collection(this.firestore, 'products');
  // Mock data, only used if Firestore is empty
  productList = [
    {
      id: 'wGXbXUmKsAAKBrWQtVZP',
      name: 'Piemonte Brachetto',
      manufacturer: 'Rivata',
      description: 'Ett gott rött vin',
      articleType: 'rott',
      price: 299,
      rating: 4.5,
      imageUrl:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.totalwine.com%2Fdynamic%2F490x%2Fmedia%2Fsys_master%2Ftwmmedia%2Fh0a%2Fh05%2F11864980258846.png&f=1&nofb=1&ipt=82b4913e7f95890adcf69a9da3d4557ea8c6cb9cb3777f7ee314e87ab59b4397&ipo=images',
      outOfStock: false,
      slug: 'piemonte-brachetto',
      packaging: 'flaska',
      publishedAt: new Date('2019-03-08'),
    },
    {
      id: 'eLxlb5uHzcKscnkMaW8b',
      name: 'Santa Helena',
      manufacturer: 'Chardonnay',
      description: 'Ett gott vitt vin',
      articleType: 'vitt',
      price: 55,
      rating: 4,
      imageUrl:
        'https://product-cdn.systembolaget.se/productimages/29326165/29326165_800.png',
      outOfStock: false,
      slug: 'santa-helena',
      packaging: 'box',
      publishedAt: new Date('2022-04-18'),
    },
  ];

  constructor(private firestore: Firestore) {}
  // Get products from Firestore
  async getProducts(): Promise<IProduct[]> {
    const q = query(this.ref, limit(8));

    const productsGet = await getDocs(q).catch((error) => {
      console.log('Firestore error: ', error);
    });

    if (productsGet) {
      var product = productsGet.docs.map((doc) => doc.data() as IProduct);
      product = product.map((product) => {
        product.name = product.name.replace(' ', ' ');
        return product;
      });

      return product;
    } else return this.productList;
  }

  async getSingleProduct(id: string): Promise<IProduct | null> {
    const ref = doc(this.firestore, 'products', id);

    const product = await getDoc(ref);
    if (product != null) return product.data() as IProduct;
    else return null;
  }

  async getProductsByType(type: string): Promise<IProduct[]> {
    const q = query(this.ref, limit(8));
    if (type === 'all') return this.getProducts();

    const products = await getDocs(q)
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => doc.data() as IProduct)
          .filter((product) => product.articleTypeSlug === type);
      })
      .catch((error) => {
        console.log('Firestore error: ', error);
      });
    if (products) return products;
    else {
      console.log('No products found, returning default list');
      return this.productList;
    }
  }
}
