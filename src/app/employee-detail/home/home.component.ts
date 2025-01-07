import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, SubCategory } from 'src/app/shared/employee.model'; // Make sure this path is correct
import { EmployeeService } from 'src/app/shared/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(public categoryService: EmployeeService, public router: Router) {}

  ngOnInit(): void {
    // Fetch categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categoryService.listCategory = categories;
      //applying filter to subcategories of categoryId eqauls category id present in subcategory.
      //applying to each category in the list.Use of filter method in there
      this.categoryService.getSubCategories().subscribe(subCategory => {
        this.categoryService.listCategory.forEach(category=>{
          category.subCategories=subCategory.filter(id=>id.categoryId===category.id);
        })
        //this is written , if I want to show all subcategories which exists
        this.categoryService.listSubCategory=subCategory;
      })
        });
      }


  navigate(): void {
    this.router.navigate(['/employee-details']);
  }
}
