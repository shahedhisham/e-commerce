import { Component, inject, OnInit, signal } from '@angular/core';
import { WhishlistService } from '../../core/services/whishlist.service';
import { Product } from '../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-whishlist',
  imports: [RouterLink],
  templateUrl: './whishlist.component.html',
  styleUrl: './whishlist.component.css',
})
export class WhishlistComponent implements OnInit {
  private readonly whishlistService = inject(WhishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);

  wishlistItems  = signal<Product[]>([]);
  cartIds = signal<string[]>([]);

ngOnInit(): void {
  this.getWhishlistData();
  this.getCartData(); 
}

  getWhishlistData():void{
    this.whishlistService.getProductToWhishslist().subscribe({
      next:(res)=>{
        console.log(res.data);
        this.wishlistItems.set(res.data);
      },
    });
  }

deleteItem(id: string): void {
  this.whishlistService.deleteProductWhishlist(id).subscribe({
    next: () => {
      this.wishlistItems.update(items => items.filter(p => p._id !== id));
    }
  });
}

addToCart(id: string): void {
  if (!localStorage.getItem('freshToken')) {
    this.toastrService.warning('Please login first', 'FreshCart', {
      progressBar: true,
      closeButton: true,
    });
    return;
  }

  this.cartService.addProductToCart(id).subscribe({
    next: (res) => {
      if (res.status === 'success') {


        this.cartIds.update(ids => [...ids, id]);

        this.cartService.cartCount.set(res.numOfCartItems);

        this.toastrService.success(res.message || 'Added to cart', 'FreshCart', {
          progressBar: true,
          closeButton: true,
        });
      }
    },
  });
}

  getCartData(): void {
  this.cartService.getLoggedUserCart().subscribe({
    next: (res) => {
      const ids = res.data.products.map((item: any) => item.product._id);
      this.cartIds.set(ids);
    },
  });
}
isInCart(id: string): boolean {
  return this.cartIds().includes(id);
}
}
