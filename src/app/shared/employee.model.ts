export class Employee {
    id :number=0;
    name:string;
    lastName:string;
    email:string='';
    age:number;
    doj:any;
    isMarried:boolean=false;
    gender:string='';
    designationID:number;
    designation:Designation;
    hobbies: string='';
    password:string='';
    image:{id:number; url:string}[]=[];
    role:string='';
}

export class Designation {
   id:number=0;
   designation:string='';
}


export class Hobbies{
    hobbyId:number=0;
    hobbyName:string='';
    isSelected: boolean = false;
}


export class Category {
    id: number = 0;
    categories: string = '';  // Category name
    subCategories: SubCategory[] = [];  // Array of SubCategory objects
  }
  
  export class SubCategory {
    id: number = 0;
    categoryId: number = 0;
    subCategories: string = '';  // Name of the subcategory
  }
  


export class Question{
    id:number=0;
    maleQues:string='';
    femaleQues:string='';
}



// export interface Question {
//     id: number;
//     maleQues: string;
//     femaleQues: string;
//   }
  
//   export interface ApiResponse {
//     $id: string;
//     $values: Question[]; // The $values array that contains the questions
//   }
  