 import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class WhishlistService {
  private readonly httpClient = inject(HttpClient);
    wishlistItems = signal<Product[]>([]);
    wishlistIds = signal<string[]>([]);

  addProductToWhishlist(prodId:string):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist` , {productId: prodId} ,);
  }

  getProductToWhishslist():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }

  deleteProductWhishlist(id:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${id}`);
  }

  refreshWishlist(): void {
    this.getProductToWhishslist().subscribe({
      next: (res) => {
      this.wishlistItems.set(res.data || []);
      this.wishlistIds.set((res.data || []).map((item: Product) => item._id));
    }
   });
  }

  getLocalWishlist(): any[] {
    const list = localStorage.getItem('guestWishlist');
    return list ? JSON.parse(list) : [];
  }

    saveWishlistLocally(data: any): void {
    localStorage.setItem('guestWishlist', JSON.stringify(data));
  }




}