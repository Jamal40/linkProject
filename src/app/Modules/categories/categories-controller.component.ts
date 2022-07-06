import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AuthService } from '../auth/auth.service';
import { CategoryReadDto, CategoryWriteDto, ParentCategoryReadDto } from '../home/Components/Models/category.models';
import { ProductsService } from '../home/Components/ProductService/Products.service';

@Component({
  selector: 'app-categories-controller',
  templateUrl: './categories-controller.component.html',
  styleUrls: ['./categories-controller.component.css']
})
export class CategoriesControllerComponent implements OnInit {
  CategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[A-Za-z ]+$/
      ),
    ]),
    parentCategory: new FormControl('', [
      Validators.required,
    ]),
  });
  categoriesReadDto: CategoryReadDto[] = [];
  categoryToEdit:CategoryReadDto|null=null;
  categoryUpdateDto:CategoryReadDto|null=null;
  parentCategoryReadDto:ParentCategoryReadDto[]=[];

  categoryWriteDto:CategoryWriteDto|null=null;

  constructor(    private productService: ProductsService,
    private router: Router,
    private auth: AuthService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit(): void {
    this.GetCategories();
    this.GetParentCategories();
  }
  openCategoryCreation(){
    this.CategoryForm.reset();
    this.ngxSmartModalService.getModal('openCategoryCreationModal').open();
    
  }

  GetCategories(){
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoriesReadDto=categories;
      },
      error: (err) => {
        alert(err.error);
        console.log(err);
      },
    });
  }



  editCategory(event:any,category:CategoryReadDto){
    event.stopPropagation();   
    this.categoryToEdit=category;    
    this.CategoryForm.patchValue({
      name:category.name,
      parentCategory:category.parentCategory.name   
    })
    this.ngxSmartModalService.getModal('openCategoryCreationModal').open();
  }

  deleteCategory(event:any,id:string){
    event.stopPropagation();

      this.productService.deleteCategory(id).subscribe({
        next: (category) => {
          this.categoriesReadDto = this.categoriesReadDto.filter((c) => c.id !== id);
        },
        error: (err) => {
          
          alert(err.error);
        },
      });


    



  }

  AddOrEditCategory(){
  
    const { value, valid, dirty } = this.CategoryForm;
   
    if (!valid || !dirty) return;
    if(!this.categoryToEdit){
      this.categoryWriteDto={...this.CategoryForm.value,
        parentCategoryId:this.CategoryForm.value.parentCategory
      };
      this.productService.AddCategory(this.categoryWriteDto!).subscribe({
        next: (category) => {
          alert("Category Added Sucecss");
          this.categoriesReadDto.push(category);
          this.CategoryForm.reset();
          this.ngxSmartModalService.getModal('openCategoryCreationModal').close();
        },
        error: (err) => {
          
          alert(err.error);
        },
      });
    }
    else {
      this.categoryUpdateDto?.name!=this.categoryToEdit.id;

    //  this.categoryUpdateDto?.name!=this.CategoryForm.value.name;
     // this.categoryUpdateDto?.parentCategory.id!=this.CategoryForm.value.parentCategory;
this.categoryUpdateDto={
  ...this.CategoryForm.value,
  parentCategoryId:this.CategoryForm.value.parentCategory
}
      
      this.productService
        .editCategory(this.categoryToEdit.id!, this.categoryUpdateDto!)
        .subscribe({
          next: (category) => {
              const indexToEdit = this.categoriesReadDto.findIndex(
                (c) => c.id === category.id)
              this.categoriesReadDto.splice(indexToEdit, 1, category);

              this.categoryToEdit = null;
              this.CategoryForm.reset();
              this.ngxSmartModalService.getModal('openCategoryCreationModal').close();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }

    

  }


  
  GetParentCategories(){
    this.productService.getAllParentCategories().subscribe({
      next: (ParentCategories) => {
        this.parentCategoryReadDto=ParentCategories;
      },
      error: (err) => {
        alert(err.error);
        console.log(err);
      },
    });
  }



}