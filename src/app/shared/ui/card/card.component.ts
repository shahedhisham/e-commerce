import { Component, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../core/models/product.interface';
import { CartService } from '../../../core/services/cart.service';
import { WhishlistService } from '../../../core/services/whishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly whishlistService = inject(WhishlistService);

  product = input.required<Product>();

  // Computed signal to check if product is in wishlist
  isInWishlist = computed(() => 
    this.whishlistService.wishlistIds().includes(this.product()._id)
  );

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
          this.cartService.cartCount.set(res.numOfCartItems);
          this.toastrService.success(res.message || 'Added to cart', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        }
      },
    });
  }

  toggleWishlist(id: string): void {
    if (!localStorage.getItem('freshToken')) {
      this.toastrService.warning('Please login first', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
      return;
    }
    

    if (this.isInWishlist()) {
      // Remove from wishlist
      this.whishlistService.deleteProductWhishlist(id).subscribe({
        next: () => {
          this.whishlistService.refreshWishlist(); // Important: refresh the list
          this.toastrService.success('Removed from wishlist', 'FreshCart');
        },
      });
    } else {
      // Add to wishlist
      this.whishlistService.addProductToWhishlist(id).subscribe({
        next: () => {
          this.whishlistService.refreshWishlist(); // Refresh after adding
          this.toastrService.success('Added to wishlist', 'FreshCart');
        },
      });
    }
  }
  
}