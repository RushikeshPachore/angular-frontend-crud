import { HttpErrorResponse } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import {  Component, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Designation, Employee } from 'src/app/shared/employee.model';
import { EmployeeService } from 'src/app/shared/employee.service';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})

export class EmployeeFormComponent implements OnInit {

isImageRequired:boolean=false;
selectedImageName: string = '';

//viewing image while editing. Input for child component. this is child of detail component
@Input() imageFromPar:string='';

//for viewing image while posting
imageUrl:string=this.empService.employeeData.image?`http://localhost:5213${this.empService.employeeData.image}`:'';

[x: string]: any;
  dataService: any;
  constructor(public empService: EmployeeService) {}



  ngOnInit() {
  
    this.empService.getHobbies().subscribe(hobbies => {
      this.empService.listHobbies = hobbies;
      console.log(hobbies);
        
      this.empService.getDesignation().subscribe(designations => {
        this.empService.listDesignation = designations;
  
        // Fetch employee data if editing
        if (this.empService.employeeData.id !== 0) {
          this.empService.getEmployeeById(this.empService.employeeData.id).subscribe(employee => {
            this.empService.employeeData = employee;
            
            this.empService.employeeData.hobbies = this.empService.employeeData.hobbies
            ? this.empService.employeeData.hobbies.split(',').filter(h => h).join(',')
            : '';

            this.imageUrl=this.empService.employeeData.image?`http://localhost:5213${this.empService.employeeData.image}`: '';
            
          });
        }
      });
    });
  }  

  submit(form: NgForm) {

    if (this.empService.employeeData.designationID === 0 || !this.empService.employeeData.designationID) {
      alert("Please select a designation.");
      return;
    } 
    // Prepare the employee data payload
    const employeeData = {
      id: this.empService.employeeData.id,
      name: form.value.name,
      lastName: form.value.lastName,
      email: form.value.email,
      age: form.value.age,
      doj: form.value.doj,
      gender: form.value.gender,
      password:form.value.password,
      designationID: form.value.designationID,
      hobbies: this.empService.employeeData.hobbies ||'',  //checkbox so access this way
      image:this.empService.employeeData.image //file type
    };

    console.log('Employee Data to send:', employeeData);
  
    if (this.empService.employeeData.id === 0) {
      this.insertEmployee(employeeData, form);
    } else {
      this.updateEmployee(employeeData, form);
    }
  }
  

  insertEmployee(employeeData: any, myform: NgForm) {
    this.empService.saveEmployee(employeeData).subscribe({
      next: (response) => {
        this.resetForm(myform);
        this.refreshData();
        console.log('Employee saved successfully:', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
        console.log('Validation Errors:', error.error.errors);
      }
    });
  }
  
  updateEmployee(employeeData: any, myform: NgForm) {
    this.empService.UpdateEmployee(employeeData).subscribe({
      next: (response) => {
        this.resetForm(myform);
        this.refreshData();
        console.log('Employee updated successfully:', employeeData);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
        console.log('Validation Errors:', error.error.errors);
      }
    });
  }
  

  resetForm(myform: NgForm) {
    myform.form.reset(myform.value);
    this.empService.employeeData = new Employee();
    this.empService.employeeData.hobbies =''; // Reset hobbies to an empty string
    //clicked save then image is disappear in form
    this.imageFromPar='';
    this.imageUrl='';   
  
  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Clear the file input of image after save or update
  }
  }
  

  refreshData() { //refreshes changes in the data, gets the available data from database
    this.empService.getEmployee().subscribe(res => {
      this.empService.listEmployee = res;
    });
  }


  onHobbyChange(event: any, hobbyId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    // Initialize hobbies if not present
    let hobbiesArray = this.empService.employeeData.hobbies
        ? this.empService.employeeData.hobbies.split(',').map(id => parseInt(id, 10))
        : [];
    if (checked) {
        // Add the hobby ID if it's not already included
        if (!hobbiesArray.includes(hobbyId)) {
            hobbiesArray.push(hobbyId);
        }
    } else {
        // Remove the hobby ID if it's unchecked
        hobbiesArray = hobbiesArray.filter(id => id !== hobbyId);
    }
    // Update the hobbies field as a comma-separated string of IDs
    this.empService.employeeData.hobbies = hobbiesArray.filter(id => id > 0).join(',');
}



//A FileReader object is created. FileReader is an API that allows reading files from the user's local file system. In this case, it's used to read the image as a base64-encoded string.
onImageSelected(event: any) {
  const file = event.target.files[0]; // Gets the first file which is selected in this array files[0] and stored in 'file'
  if (!file) {
    this.isImageRequired = true; 
    return;
  }
  
  this.selectedImageName=file.name;
  const reader = new FileReader();
  reader.onload = () => {
    // Set the base64 string to employeeData.image
    //Inside the onload callback, reader.result contains the base64-encoded string of the image. 
    //This line assigns it to this.empService.employeeData.image
    //this is passed to html and then image seen in form after selected as it updates when image selected
    this.empService.employeeData.image = reader.result as string;
    this.imageUrl = reader.result as string; //to show image in form when selected , saves image url
    //null for to change the existing image in form when different is selected
    this.imageFromPar=null;
  };
  reader.onerror = (error) => {
    console.error('Error reading image file:', error);
  };
  reader.readAsDataURL(file); // Convert the image to base64 string with readAsDataURL method.
  this.isImageRequired = false; // Reset the flag if an image is selected
}



isHobbySelected(hobbyId: number): boolean {
  // If no hobbies are present, return false
  if (!this.empService.employeeData.hobbies) {
    return false;
  }

  // Parse hobbies into an array
  const selectedHobbies = this.empService.employeeData.hobbies.split(',').map(id => parseInt(id, 10));

  // Check if the given hobbyId is in the list
  return selectedHobbies.includes(hobbyId);
}

onCancel(myform:NgForm){
  myform.form.reset();
  this.empService.employeeData = new Employee();
  this.empService.employeeData.hobbies ='';
  this.imageUrl = null;
  this.imageFromPar = null;


  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Clear the file input of image after save or update
  }
}


}