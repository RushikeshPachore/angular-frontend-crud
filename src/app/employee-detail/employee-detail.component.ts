import { Component,Input,ViewChild } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent {

  isEditing=false;

isDeleteEnabled=false;
updateCheckboxState(isChecked: boolean) {
  this.isDeleteEnabled = isChecked; // Enable delete only if checkbox is checked
}
  @ViewChild('myform') myform: NgForm;

  availableHobbies: any[] = [];
  imageShow:{id:number; url:string} []=[];
  constructor(public empService:EmployeeService, public datepipe:DatePipe){
  }

  ngOnInit(){
    this.empService.getEmployee().subscribe((data)=>{   
      this.empService.listEmployee=data;     
      console.log('Employee Data:',  this.empService.listEmployee); 
      //all the data is stored in 'data' variable using subscribe first then we passs that data variable to listEmployee created in service.
      //after that list is rendered in employee-detail.html using ngFor  //subscribe to retrive data
      // Fetch available hobbies from the service or backend
            
      this.empService.listEmployee.forEach(employee => {
        if (employee.id > 0) { // Ensure valid employee ID
          this.empService.getImages(employee.id).subscribe(
            (images) => {
              // Prefix the URL if it's a relative path
              employee.image = images.map(img => ({
                ...img,
                url: img.url.startsWith('http://localhost:5213') ? img.url : `http://localhost:5213${img.url}`
              }));
              
              console.log("Fetched images for employee:", employee.id, employee.image);
            },
            (error) => {
              console.error(`Error fetching images for employee ${employee.id}:`, error);
              employee.image = []; // Default to empty array in case of error
            }
          );
        } else {
          console.warn(`Invalid employee ID: ${employee.id}`);
        }
      });
      




    this.empService.getHobbies().subscribe(hobbies => {
      this.availableHobbies = hobbies;
      console.log('Available Hobbies:', hobbies); 
    });

  });


    
  }


  //this.empService.employeeData is assigned a shallow copy of selectedEmployee.
  //The syntax { ...selectedEmployee } uses the spread operator to create a new object with the same properties as selectedEmployee.
  edit(selectedEmployee: Employee) 
  { 
    this.isEditing=true;
    this.empService.employeeData = {...selectedEmployee} 
    console.log("empdata:",this.empService.employeeData)

// Parse hobbies if they exist (hobbies will be a string of names, so we need to convert it to IDs)
  if (selectedEmployee.hobbies) {
  // Convert the comma-separated hobby names into their corresponding hobby IDs
  const hobbyNames = selectedEmployee.hobbies.split(',');
  const hobbyIds = hobbyNames.map(name => {
    const hobby = this.empService.listHobbies.find(h => h.hobbyName === name.trim());
    return hobby ? hobby.hobbyId : null;
  }).filter(id => id !== null); // Filter out any null values (in case any hobby is not found)

  // Assign the hobby IDs to employeeData.hobbies
  this.empService.employeeData.hobbies = hobbyIds.join(',');
} else {
  this.empService.employeeData.hobbies = ''; // Set to empty string if no hobbies exist
}
console.log("Hobbies for editing (as IDs):", this.empService.employeeData.hobbies);
  
    let df = this.datepipe.transform(selectedEmployee.doj, 'yyyy-MM-dd');
    this.empService.employeeData.doj = df;   
    this.empService.employeeData.password ='';
   

    // this.empService.getImages(this.empService.employeeData.id).subscribe((data) => {
    //   this.imagePreviews = data.map(img => ({ ...img, url: `http://localhost:5213/${img.url}` }));
    // });
    
    //Image Editing
    this.empService.getImages(selectedEmployee.id).subscribe(images => {
      // Map the image URLs to the employeeData
      this.imageShow = images.map(img => ({ ...img, url: `http://localhost:5213/${img.url}` }));
      console.log('Images for editing:', this.imageShow);
    });

  }



  delete(id: number) {
    if (confirm('Confirm Deletion..?')) {
      this.empService.deleteEmployee(id).subscribe(
        data => {
          console.log('Record deleted...');
          // Manually remove the deleted employee from the list
          this.empService.listEmployee = this.empService.listEmployee.filter(employee => employee.id !== id);
          // Reset the employee data in the service after successful deletion
          this.empService.employeeData = new Employee(); // Clear the employee data
         this.imageShow=[];
          // Optionally, reset the form controls using the reset() method
          this.myform.reset(); // This will reset the form fields
          // This will instantly reflect the change in the UI
           
        },
        err => {
          console.log('Record not deleted...');
        }
      );
    }
  }


  getHobbiesNames(selectedEmployee: Employee): string {
    debugger;
    if (!selectedEmployee || !selectedEmployee.hobbies) {
      return 'No hobbies available';
    }
  
    // Split the hobbies string into an array of numbers
    const hobbyIds = selectedEmployee.hobbies
      .split(',')
      .map(hobby => parseInt(hobby, 10)) // Convert each to a number
      .filter(hobbyId => !isNaN(hobbyId)); // Filter out invalid numbers
  
    if (hobbyIds.length === 0) {
      return 'No hobbies available';
    }
  
    // Map hobby IDs to hobby names
    const hobbyNames = hobbyIds
      .map(hobbyId => {
        const hobby = this.empService.listHobbies.find(h => h.hobbyId === hobbyId);
        return hobby ? hobby.hobbyName : null; // Map ID to name, handle unmatched IDs
      })
      .filter(name => name); // Remove null or undefined values
  
    // Return the joined hobby names or a fallback message
    return hobbyNames.length > 0 ? hobbyNames.join(', ') : 'No hobbies available';
  }
  
  



  resetImage() {
    // this.imageEdit = null;  // Reset imageEdit
    console.log('Image reset!');
  }

}
