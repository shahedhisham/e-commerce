import { Component } from '@angular/core';
import { SliderComponent } from './components/slider/slider.component';
import { CategoryHomeComponent } from './components/category-home/category-home.component';
import { ProductComponent } from './components/product/product.component';

@Component({
  selector: 'app-home',
  imports: [SliderComponent, CategoryHomeComponent, ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
