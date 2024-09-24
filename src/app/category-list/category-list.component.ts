import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  searchQuery: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories: any[]) => {
      console.log('Fetched categories:', categories); // Add this line
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  filterCategories() {
    this.filteredCategories = this.categories.filter((category) =>
      category.categoryName
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  resetFilter() {
    this.searchQuery = '';
    this.filteredCategories = this.categories;
  }

  navigateToQuiz(categoryId: string) {
    this.router.navigate(['/quiz', categoryId]);
  }
}
