export class Employee {
    id :number=0;
    name:string;
    lastName:string;
    email:string='';
    age:number;
    doj:any;
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


export class Category{
    id:number=0;
    categories:string='';
    subCategories:SubCategory[]=[];
}

export class SubCategory{
    id:number=0;
    categoryId:number=0;
    subCategories:string='';

}







