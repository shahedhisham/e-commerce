import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BrandsService } from './../../core/services/brands.service';
import { Brands } from './models/brands.interface';

@Component({
  selector: 'app-brands',
  standalone: true,           // ← Add this (recommended)
  imports: [RouterLink],      // ← You need CommonModule for @for
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {

  private readonly brandsService = inject(BrandsService);

  // This is a signal
  brands = signal<Brands[]>([]);

  ngOnInit(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brands.set(res.data);
        console.log('Brands loaded:', res.data);
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      }
    });
  }
}