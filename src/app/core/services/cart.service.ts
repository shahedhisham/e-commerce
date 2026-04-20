import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  cartCount  = signal<number>(0);

  addProductToCart(prodId:string):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart` ,   { productId: prodId}, );
  }

  getLoggedUserCart():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`);
  }

  getCartData():Observable<any>{
    return this.httpClient.get(environment.baseUrl + `api/v2/cart`);
  }

  removeProductItem(id:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${id}`);
  }

  updateCartCount(id:string, count:number):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${id}`, {count: count ,});
  }

  clearCart():Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`);
  }

  createCashOrder(cartId:string , data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}` , data );
  }

  createVisaOrder(cartId:string , data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}?url=${environment.url}` , data);
  }

    getLocalCart(): any {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : { products: [], totalCartPrice: 0 };
  }

  saveCartLocally(data: any): void {
    localStorage.setItem('guestCart', JSON.stringify(data));
  }

  syncCartToServer() {
    const localCart = this.getLocalCart();
    if (localCart.products.length > 0) {
      this.cartCount.set(localCart.products.length);
      localCart.products.forEach((item: any) => {
        this.addProductToCart(item.product._id).subscribe();
      });
      localStorage.removeItem('guestCart');
    }
  }

}
