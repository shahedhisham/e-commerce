import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/product.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly categoriesService = inject(CategoriesService);
  


  logged = computed(() => this.authService.isLogged());

  count = computed(() => this.cartService.cartCount());

  categoriesList = signal<Category[]>([]);

  constructor(private flowbiteService: FlowbiteService) {}

ngOnInit(): void {
  this.getCartCount();

  if (isPlatformBrowser(this.pLATFORM_ID)) {
    this.getCartCount();

    if (localStorage.getItem('freshToken')) {
      this.authService.isLogged.set(true);
    }
  }

  this.getAllCategoriesData();

  this.flowbiteService.loadFlowbite(() => {
    initFlowbite();
  });
}

  logOut():void{
    this.authService.signOut();
  }

  getCartCount():void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
      this.cartService.cartCount.set(res.numOfCartItems)
      }
    });
  }

   getAllCategoriesData(): void {
    this.categoriesService.getallCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
