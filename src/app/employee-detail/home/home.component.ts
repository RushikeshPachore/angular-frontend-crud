import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Category } from 'src/app/shared/employee.model';
import { EmployeeService } from 'src/app/shared/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public categoryService:EmployeeService, public router :Router){}


 
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
        //this is written , if I want to show subcategories there.
        this.categoryService.listSubCategory=subCategory;
      })
        });
  }


  navigate():void{
    this.router.navigate(['/employee-details']);
  }
}

  