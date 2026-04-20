import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.interface';
import { isPlatformBrowser } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsService } from '../../core/services/products.service';
import { WhishlistService } from '../../core/services/whishlist.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-shop',
  imports: [CardComponent, RouterLink, NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly whishlistService = inject(WhishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  productList = signal<Product[]>([]);
  categoryName = signal('');

  pageSize = signal<number>(0);
  cp = signal<number>(0);
  total = signal<number>(0);

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('category')) {
        this.getProductsByCategoryData(params.get('category')!);
        this.categoryName.set(params.get('slug')!);
      } else if (params.get('brand')) {
        this.getProductsByBrandData(params.get('brand')!);
        this.categoryName.set(params.get('slug')!);
      } else {
        if (isPlatformBrowser(this.pLATFORM_ID)) {
          this.getWishList();
        }
        this.getProductData();
        this.categoryName.set('');
      }
    });
  }

  getProductData(): void {
    this.productsService.getallProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.cp.set(res.metadata.currentPage);
        this.total.set(res.results);
      },
    });
  }

  getProductsByCategoryData(categoryId: string): void {
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.productList.set(res.data);
      },
    });
  }

  getProductsByBrandData(brandId: string): void {
    this.productsService.getProductsBybrand(brandId).subscribe({
      next: (res) => {
        console.log(res);
        this.productList.set(res.data);
      },
    });
  }

  pageChanged(num: number): void {
    this.productsService.getallProducts(num).subscribe({
      next: (res) => {
        console.log(res);
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.cp.set(res.metadata.currentPage);
        this.total.set(res.results);
      },
    });
  }

  getWishList(): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.whishlistService.refreshWishlist();
    } else {
      const localWish = this.whishlistService.getLocalWishlist();
      const idsOnly = localWish.map((item: any) => item.id || item._id);   
      this.whishlistService.wishlistIds.set(idsOnly);
      this.whishlistService.wishlistItems.set(localWish); 
    }
  }
}