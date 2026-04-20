import {Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './../../core/models/product.interface';
import { ProductsService } from './../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WhishlistService } from '../../core/services/whishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WhishlistService);
  private readonly platformId = inject(PLATFORM_ID);
  

  // Signals
  product = signal<Product>({} as Product);
  currentQuantity = signal<number>(1);    
  activeTab = signal<number>(0);    
  wishListProd = computed(() => this.wishlistService.wishlistIds());
  

  // Swiper config (optional)
  swiperConfig = {
    spaceBetween: 10,
    navigation: false,
    pagination: { clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
    },
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getWishList();
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.getProductDetails(id);
    });
  }

  getProductDetails(id: string): void {
    this.productsService.getspecialProducts(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.currentQuantity.set(1);        // reset quantity when product changes
      },
      error: (err) => console.error(err),
    });
  }

  
  @ViewChild('swiperMain') swiperMain!: ElementRef;

  slideTo(index: number) {
    this.swiperMain.nativeElement.swiper.slideTo(index);
  }


  // ====================== Quantity Controls ======================
  increaseQuantity(): void {
    this.currentQuantity.update(q => q + 1);
  }

  decreaseQuantity(): void {
    this.currentQuantity.update(q => Math.max(1, q - 1));   // prevent going below 1
  }

  // ====================== Add to Cart ======================
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


  // ====================== Wishlist ======================
  addToWish(prodId: string): void {
    if (!localStorage.getItem('freshToken')) {
      console.log('Please login first');
      return;
    }

    if (this.wishListProd().includes(prodId)) {
      this.wishlistService.deleteProductWhishlist(prodId).subscribe({
        next: (res) => {
          this.wishlistService.wishlistIds.set(res.data);
        }
      });
    } else {
      this.wishlistService.addProductToWhishlist(prodId).subscribe({
        next: (res) => {
          this.wishlistService.wishlistIds.set(res.data);
        }
      });
    }
  }

  getWishList(): void {
    this.wishlistService.getProductToWhishslist().subscribe({
      next: (res) => {
        const idsOnly = res.data.map((item: any) => item._id || item.id);
        this.wishlistService.wishlistIds.set(idsOnly);
      }
    });
  }
}