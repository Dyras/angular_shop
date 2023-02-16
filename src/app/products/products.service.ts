import { Injectable } from '@angular/core';
import {
  getDocs,
  Firestore,
  collection,
  limit,
  query,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { where } from 'firebase/firestore';
import { IProduct } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  ref = collection(this.firestore, 'products');
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
      publishedAt: new Date('2022-04-18'),
    },
  ];

  constructor(private firestore: Firestore) {}
  // Create getProducts() method
  async getProducts(): Promise<IProduct[]> {
    const q = query(this.ref, limit(8));

    const products = await getDocs(q)
      .then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data() as IProduct);
      })
      .catch((error) => {
        console.log('Firestore error: ', error);
      });
    if (products) return products;
    else return this.productList;
  }

  async getSingleProduct(id: string): Promise<IProduct | null> {
    const ref = doc(this.firestore, 'products', id);

    const product = await getDoc(ref);
    console.log(product.data() as IProduct);
    if (product != null) return product.data() as IProduct;
    else return null;
  }
}
