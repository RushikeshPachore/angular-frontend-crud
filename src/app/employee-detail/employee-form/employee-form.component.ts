import { HttpErrorResponse } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import {  Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors } from '@angular/forms';
import { Designation, Employee } from 'src/app/shared/employee.model';
import { EmployeeService } from 'src/app/shared/employee.service';




@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})

export class EmployeeFormComponent implements OnInit {

//included to uncheck the hobby checkboxes after save manually
@ViewChildren('hobbyCheckbox') hobbyCheckboxes: QueryList<ElementRef>;

isImageRequired:boolean=false;
selectedImageName: string = '';

//Output is used from child to parent
@Output() cancelClick = new EventEmitter<void>();


//viewing image while editing. Input for child component. this is child of detail component

@Input() imageFromPar:string='';

//for viewing image while posting
imageUrl:string=this.empService.employeeData.image?`http://localhost:5213${this.empService.employeeData.image}`:'';


//services are injected in constructor of component class. Included through dependency injection
constructor(public empService: EmployeeService) {

}


//Lifecycle hook, called once when compoent is initialized. mostly used to fetch data from services or APIs.
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
            
            this.empService.employeeData.hobbies = employee.hobbies
            ? employee.hobbies.split(',').filter(h => h).join(',')
            : '';

            this.imageUrl=this.empService.employeeData.image?`http://localhost:5213${this.empService.employeeData.image}`: '';
            
          });
        }
      });
    });
  }  



  submit(form: NgForm) {
    debugger;
    if (this.empService.employeeData.designationID === 0 || !this.empService.employeeData.designationID) {
      alert("Please select a designation.");
      return;
    } 
    // Convert hobbies array back to a comma-separated string
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
      hobbies:  this.empService.employeeData.hobbies,  //checkbox so access this way
      image:this.empService.employeeData.image         //file type
    };

    console.log('Employee Data to send:', employeeData);
  
    if (this.empService.employeeData.id === 0) {
      this.insertEmployee(employeeData, form);
    } else {
      this.updateEmployee(employeeData, form);
    }
  }
  

  //wehere subscribe is written there response is seen.
  insertEmployee(employeeData: any, myform: NgForm) {
    debugger;
    this.empService.saveEmployee(employeeData).subscribe({
      next: (response) => {
        this.resetForm(myform);
        this.refreshData();
        console.log('Employee saved successfully:', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error occurred:', error);

      // Check if the error message corresponds to a duplicate email
      if (error.status === 400 && error.error?.message === "The email is already in use by another employee.") {
        alert("Duplicate Email: The email is already in use. Please use a different email.");
      } 
      else if (error.status === 400 && error.error?.errors) {
        // Handling other validation errors (such as empty fields, incorrect data types, etc.)
        const errorMessages = Object.values(error.error.errors).flat();
        alert(`Validation Errors: \n${errorMessages.join('\n')}`);
      }
      else {
        // Handle any other types of errors (like server errors or unexpected errors)
        alert("An error occurred while saving the employee. Please try again.");
      }
      }
    });
  }


  
  updateEmployee(employeeData: any, myform: NgForm) {
    debugger;
    this.empService.UpdateEmployee(employeeData).subscribe({
      next: (response) => {
        this.resetForm(myform);
        this.refreshData();
        console.log('Employee updated successfully:', employeeData);
      },
      // it checks if the error message from the server (located in error.error?.message) is specifically "The email is already in use by another employee."
      error: (error: HttpErrorResponse) => { //arrow function
        console.error('Error occurred:', error);
        if (error.status === 400 && error.error.message === "The email is already in use by another employee.") {
          alert("The email is already in use. Please use a different email.");
          //  error.error?.errors checks validation errors.
        } else if (error.status === 400 && error.error?.errors) {
          // Handling other validation errors (such as empty fields, incorrect data types, etc.)
          const errorMessages = Object.values(error.error.errors).flat();
          alert(`Validation Errors: \n${errorMessages.join('\n')}`);
        } else {
          // Handle any other types of errors (like server errors or unexpected errors)
          alert("An error occurred while saving the employee. Please try again.");
        }
      }
    });
  }
  

  resetForm(myform: NgForm) {
    myform.form.reset();
    this.empService.employeeData = new Employee();
    this.empService.employeeData.hobbies ='';// Reset hobbies to an empty string
    //clicked save then image is disappear in form
    this.imageFromPar='';
    this.imageUrl='';   
    this.cancelClick.emit();
  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Clear the file input of image after save or update
  }
   // Manually uncheck all hobby checkboxes after save, added viewChildren for that
  //   this.hobbyCheckboxes.forEach((checkbox) => {
  //   (checkbox.nativeElement as HTMLInputElement).checked = false;
  // });
  }
  

  refreshData() { //refreshes changes in the data, gets the available data from database
    this.empService.getEmployee().subscribe(res => {
      this.empService.listEmployee = res;
    });
  }





//map() is an array method used to create a new array by applying a function to each element of the original array.
//In this case, map() takes each element (which is initially a string from the split() result) and passes it through the function id => parseInt(id, 10).
// split() is a string method that splits a "string into an array" based on the delimiter provided. In this case, it's using the comma (',') as the delimiter.
// So, it takes the string in hobbies, splits it at each comma, and returns an array of strings. ["1,2,3"]=>["1","2","3"]

//id => ... is an arrow function, which is a shorthand syntax for defining functions in JavaScript. 
//Here, id represents each individual element (string) from the array resulting from split().
//parseInt is a built-in JavaScript function that converts a "string to an integer". The 10 is the radix (base) for the conversion, 
//which means it interprets the string as a base-10 number (decimal system).
//For example, if id is the string "1", parseInt(id, 10) will convert it into the integer 1.

//filter() is a method that creates a new array containing only the elements that pass a test.
// The filter() method loops through each element in hobbiesArray and applies the provided function to each element.
onHobbyChange(event: any, hobbyId: number) {
  const checked = (event.target as HTMLInputElement).checked;

  // Initialize hobbies if not present. 
  let hobbiesArray = this.empService.employeeData.hobbies
      ? this.empService.employeeData.hobbies.split(',').map(id => parseInt(id, 10))
      : [];

  if (checked) {
    // Add the hobby ID if it's not already included
    if (!hobbiesArray.includes(hobbyId)) {
      hobbiesArray.push(hobbyId);
    }
  }
  //Not checked then 
  else {
    // Remove the hobby ID if it's unchecked. new aaray is assigned to hobbiesArray
    hobbiesArray = hobbiesArray.filter(id => id !== hobbyId);
  }
  // Update the hobbies field as a comma-separated string of IDs
  this.empService.employeeData.hobbies = hobbiesArray.filter(id => id > 0).join(',');
  console.log('Updated hobbies:', this.empService.employeeData.hobbies);
}




//when hobby is selected (ticked checkboxes)
isHobbySelected(hobbyId: number): boolean {
  // If no hobbies are present, return false
  if (!this.empService.employeeData.hobbies) {
    return false;
  }
  // Parse hobbies into an array, string to array. "1" => 1.
  const selectedHobbies = this.empService.employeeData.hobbies.split(',').map(id => parseInt(id, 10));
  // Check if the given hobbyId is in the list
  return selectedHobbies.includes(hobbyId); 
}

// The includes() method checks if the hobbyId is present in the selectedHobbies array. 
//It returns true if the array contains hobbyId and false if it does not.


isAnyHobbySelected():boolean{
  
    return this.empService.employeeData.hobbies.length>0;

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







//USED FOR CANCEL BUTTON, BUT SAME INCLUDES IN RESETFORM SO
onCancel(myform:NgForm){
  myform.form.reset();
  this.empService.employeeData = new Employee();
  this.empService.employeeData.hobbies ='';
  this.imageUrl = null;
  this.imageFromPar = null;
  this.cancelClick.emit();
  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Clear the file input of image after save or update
  }
}




}