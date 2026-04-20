
import { Component, inject, OnInit, signal } from '@angular/core';
import { Categorie } from '../../../../core/models/categorie.interface';
import { CategoriesService } from '../../../../core/services/categories.service';

@Component({
  selector: 'app-category-home',
  imports: [],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit{
  private readonly CategoriesService = inject(CategoriesService);

  categoriesList = signal<Categorie[]>([])
  ngOnInit(): void {
    this.getCategoriesData();
  }

  getCategoriesData(): void {
    this.CategoriesService.getallCategories().subscribe({
      next: (res) => {
        console.log(res.data , "cat");

        this.categoriesList.set(res.data)
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
}
