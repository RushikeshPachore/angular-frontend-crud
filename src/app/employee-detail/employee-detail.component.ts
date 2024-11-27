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

  @ViewChild('myform') myform: NgForm;

  // @ViewChild(EmployeeFormComponent) employeeComponent:EmployeeFormComponent;

  availableHobbies: any[] = [];
  imageEdit:string='';
  constructor(public empService:EmployeeService, public datepipe:DatePipe){
  }

  ngOnInit(){
    this.empService.getEmployee().subscribe(data=>{   
      this.empService.listEmployee=data;     
      console.log('Employee Data:', data); 
      //all the data is stored in 'data' variable using subscribe first then we passs that data variable to listEmployee created in service.
      //after that list is rendered in employee-detail.html using ngFor  //subscribe to retrive data
      // Fetch available hobbies from the service or backend
    this.empService.getHobbies().subscribe(hobbies => {
      this.availableHobbies = hobbies;
      console.log('Available Hobbies:', hobbies);

    });
    });
  }


  //this.empService.employeeData is assigned a shallow copy of selectedEmployee.
  //The syntax { ...selectedEmployee } uses the spread operator to create a new object with the same properties as selectedEmployee.
  edit(selectedEmployee: Employee) 
  { debugger;
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
    // this.empService.employeeData.image = selectedEmployee.image || '';
    console.log('Selected image:',selectedEmployee.image);
    this.imageEdit=`http://localhost:5213${selectedEmployee.image}`;

    
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
          this.imageEdit='';
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
  
  
  
  // getHobbiesNames(selectedEmployee: Employee): string {
  //   debugger;
  //   if (!selectedEmployee || !selectedEmployee.hobbies) {
  //     return 'No hobbies available';
  //   }
  //   // Split the hobbies string into an array and convert to numbers
  //   const hobbyIds = selectedEmployee.hobbies.split(',').map(hobby => parseInt(hobby, 10)).filter(h => !isNaN(h));
  //   // Map hobby IDs to hobby names
  //   const hobbyNames = hobbyIds.map(hobbyId => {
  //     const hobby = this.empService.listHobbies.find(h => h.hobbyId === hobbyId);
  //     return hobby ? hobby.hobbyName : null;
  //   }).filter(name => name); // Filter out any null values
  //   return hobbyNames.length > 0 ? hobbyNames.join(',') : 'No hobbies available';
  // }


  resetImage() {
    this.imageEdit = null;  // Reset imageEdit
    console.log('Image reset!');
  }

}
