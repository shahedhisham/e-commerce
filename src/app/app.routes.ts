import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Home Page'
  },

  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then(m => m.ShopComponent),
    title: 'Shop Page'
  },

  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'Categories Page'
  },

  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then(m => m.BrandsComponent),
    title: 'Brands Page'
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Cart Page',
    canActivate:[authGuard],
  },

  {
    path: 'checkout/:id',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Checkout Page',
    canActivate:[authGuard],
  },

  {
    path: 'details/:id/:slug',
    loadComponent: () =>
      import('./features/details/details.component').then(m => m.DetailsComponent),
    title: 'Details Page'
  },

  {
    path: 'forget',
    loadComponent: () =>
      import('./features/forget/forget.component').then(m => m.ForgetComponent),
    title: 'Forget Password Page'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'Login Page'
  },

  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then(m => m.OrdersComponent),
    title: 'Orders Page',
    canActivate:[authGuard],
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then(m => m.RegisterComponent),
    title: 'Register Page'
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/whishlist/whishlist.component').then(m => m.WhishlistComponent),
    title: 'Wishlist Page',
    canActivate:[authGuard],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then(m => m.NotfoundComponent),
    title: 'Not Found Page'
  }

];