export class Employee {
    id :number=0;
    name:string;
    lastName:string;
    email:string='';
    age:number;
    doj:any;
    gender:string='male';
    designationID:number;
    designation:Designation;
    hobbies: string='';
    password:string='';
    image:string='';
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





