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





