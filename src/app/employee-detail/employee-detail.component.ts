import { Component,ViewChild } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent {
  @ViewChild('myform') myform: NgForm;
  [x: string]: any;
  availableHobbies: any[] = [];
  constructor(public empService:EmployeeService, public datepipe:DatePipe){
  }

  ngOnInit(){
    // debugger;
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
  edit(selectedEmployee: Employee) {
    this.empService.employeeData={...selectedEmployee} 
    console.log("empdata:",this.empService.employeeData)
    const selectedHobbies = this.empService.employeeData.hobbies
    ? this.empService.employeeData.hobbies.split(',')
    : [];
    let df = this.datepipe.transform(selectedEmployee.doj, 'yyyy-MM-dd');
    this.empService.employeeData.doj = df;
    console.log("Selected hobbies for editing:", selectedHobbies);
  }


  delete(id: number) {
    if (confirm('Confirm Deletion?')) {
      this.empService.deleteEmployee(id).subscribe(
        data => {
          console.log('Record deleted...');
          // Manually remove the deleted employee from the list
          this.empService.listEmployee = this.empService.listEmployee.filter(employee => employee.id !== id);
          // Reset the employee data in the service after successful deletion
          this.empService.employeeData = new Employee(); // Clear the employee data
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
    if (!selectedEmployee || !selectedEmployee.hobbies) {
      return 'No hobbies available';
    }
    // Split the hobbies string into an array and convert to numbers
    const hobbyIds = selectedEmployee.hobbies.split(',').map(hobby => parseInt(hobby, 10)).filter(h => !isNaN(h));
    // Map hobby IDs to hobby names
    const hobbyNames = hobbyIds.map(hobbyId => {
      const hobby = this.empService.listHobbies.find(h => h.hobbyId === hobbyId);
      return hobby ? hobby.hobbyName : null;
    }).filter(name => name); // Filter out any null values
    return hobbyNames.length > 0 ? hobbyNames.join(', ') : 'No hobbies available';
  }
}
