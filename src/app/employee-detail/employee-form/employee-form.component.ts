import { HttpErrorResponse } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import {  Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

imageFiles:File[]=[];

//for Image editing and posting
imagePreviews:{id:number; url:string}[]=[];
selectedImageIds:number[]=[];  

isImageRequired:boolean=false;


@Output() checkboxStateChange = new EventEmitter<boolean>();
isChecked = false;


//viewing image while editing. Input for child component. this is child of detail component
@Input() imageFromPar:{id:number; url:string}[]=[];
@Input() remove:any;


//services are injected in constructor of component class. Included through dependency injection
constructor(public empService: EmployeeService,private router:Router) {}



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
            

            this.empService.getImages(this.empService.employeeData.id).subscribe((data) => {
              this.imagePreviews = data.map(img => ({  ...img,
                url: img.url.startsWith('http://localhost:5213') ? img.url : `http://localhost:5213${img.url}` }));
            });            
            console.log("image preview :", this.imagePreviews);
       

           this.empService.employeeData.hobbies = employee.hobbies
            ? employee.hobbies.split(',').filter(h => h).join(',')
            : '';
        
            
          });
        }
      });
    });
  }  



  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked;
    this.checkboxStateChange.emit(this.isChecked); // Emit the new state
  }


  submit(form: NgForm) {
    // debugger;
    if (this.empService.employeeData.designationID === 0 || !this.empService.employeeData.designationID) {
      alert("Please select a designation.");
      return;
    } 

    const email=form.value.email?form.value.email.toLowerCase ():'';

    // const age= form.value.age?form.value.age>"18":'';
    const employeeData = {
      id: this.empService.employeeData.id,
      name: form.value.name,
      lastName: form.value.lastName,
      email: email,
      age: form.value.age,
      doj: form.value.doj,
      gender: form.value.gender,
      password:form.value.password,
      designationID: form.value.designationID,
      hobbies:  this.empService.employeeData.hobbies,  //checkbox so access this way
    };
    console.log('Employee Data to send:', employeeData);
    if (this.empService.employeeData.id === 0) {
      this.insertEmployee(employeeData, form);
    } else {
      this.updateEmployee(employeeData, form);
    }
  }


  onNameChange(event:Event){
    let inputValue = (event.target as HTMLInputElement).value;
    if(!inputValue || inputValue.length==0)
      return true;
    return null;
  }

  //Where subscribe is written there response is seen.
  insertEmployee(employeeData: any, myform: NgForm) {
    this.empService.saveEmployee(employeeData).subscribe({
      next: (response) => {   
        const newEmployeeId = response.id; // Get the employee ID
        employeeData.id=newEmployeeId;
        console.log("EmpID for process,",employeeData.id);        

        if (this.imageFiles.length > 0) {
          //console.log("Image filess in insert", this.imageFiles);
          this.empService.uploadImages(newEmployeeId, this.imageFiles).subscribe({
            next: (uploadResponse) => {
              console.log('Images uploaded successfully:', uploadResponse);
              this.resetForm(myform);
              this.refreshData();
            }         
          });
        } else {
          alert('Employee saved successfully.');
          this.resetForm(myform);
          this.refreshData();
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.message === "The email is already in use by another employee.") {
          alert("The email is already in use. Please use a different email.");
        } 
      }
    });
  }


updateEmployee(employeeData: any, myform: NgForm) {
    this.empService.UpdateEmployee(employeeData).subscribe({
      next: (response) => {
        // Now, upload the images if there are any
        if (this.imageFiles.length > 0) {
          this.empService.uploadImages(employeeData.id, this.imageFiles).subscribe({
            next: (uploadResponse) => {
              console.log('Images updated successfully:', uploadResponse);
              this.resetForm(myform);
              this.refreshData();
            },
          });
        } else {   
          this.resetForm(myform);
          this.refreshData();
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.message === "The email is already in use by another employee.") {
          alert("The email is already in use. Please use a different email.");
        } 
      }
    });
  }

  

//A FileReader object is created. FileReader is an API that allows reading files from the user's local file system. In this case, it's used to read the image as a base64-encoded string.
onImageSelected(event: any): void {
  const files = event.target.files; // Get selected files

  if (!files || files.length === 0) {
    this.isImageRequired = true; // Mark image as required if no files selected
    return;
  }

  this.imageFiles = Array.from(files); // Save File objects for upload
  this.imagePreviews = []; // Clear previous previews
   // Generate previews with id and url
   for (let i = 0; i < this.imageFiles.length; i++) {
    const file = this.imageFiles[i];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagePreviews.push({ id: i, url: base64String }); // Add id and url
    };
    reader.onerror = (error) => {
      console.error('Error reading image file:', error);
    };
    reader.readAsDataURL(file); // Read file as base64
  }
  this.isImageRequired = false; // Reset validation flag
}

  //used when editing the image , to delete them there in form by ticking checkboxes.
  //Toggle selection of image checkboxes
  onChecktick(imageId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);
    if (checkbox.checked) {
      // Add imageId to selectedImageIds when checked
      this.selectedImageIds.push(imageId);
    } else {
      // Remove imageId from selectedImageIds when unchecked
      const index =this.selectedImageIds.indexOf(imageId);
      if (index !== -1) {
        this.selectedImageIds.splice(index, 1);
      }
    }
  }


  removeImage(employeeId: number) {
    debugger;
    if (this.selectedImageIds.length > 0) {
      console.log("selected image ids",this.selectedImageIds);
      this.empService.removeImages(employeeId, this.selectedImageIds).subscribe(
        response => {
          console.log('Images removed successfully:', response);
          // Optionally, update the image list or handle success logic here
        },
        error => {
          console.error('Error removing images:', error);
          // Handle error logic here
        }
      );
    } else {
      console.log('No images selected for removal');
    }
  }


  refreshData() { //refreshes changes in the data, gets the available data from database
    this.empService.getEmployee().subscribe(res => {
      this.empService.listEmployee = res;
      for (let employee of this.empService.listEmployee) {
        this.empService.getImages(employee.id).subscribe((images) => {
          employee.image = images.map(img => ({
            ...img,
            url: `http://localhost:5213${img.url}` // Ensure correct URL formatting..prefixing image url
          }));
        });
      }
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
   if(checked) {
    // Add the hobby ID if it's not already included
    if (!hobbiesArray.includes(hobbyId)) {
      hobbiesArray.push(hobbyId);
    }
  }
    else {
    // Remove the hobby ID if it's unchecked. new aaray is assigned to hobbiesArray
    hobbiesArray = hobbiesArray.filter(id => id !== hobbyId);
   }
  // Update the hobbies field as a comma-separated string of IDs
  this.empService.employeeData.hobbies=hobbiesArray.filter(id => id>0).join(",");
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



resetForm(myform: NgForm) {
  myform.form.reset();
  // this.empService.employeeData = new Employee();
  this.empService.employeeData.hobbies ='';// Reset hobbies to an empty string
  //clicked save then image is disappear in form
  this.imageFiles=[];
  this.imagePreviews=[];
  this.imageFromPar=[];  
  this.selectedImageIds=[];

  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
  fileInput.value = ''; // Clear the file input of image after save or update
 }
}



//USED FOR CANCEL BUTTON, BUT SAME INCLUDES IN RESETFORM SO
onCancel(myform:NgForm){
  myform.form.reset();
  this.empService.employeeData = new Employee();
  this.empService.employeeData.hobbies ='';
  this.imagePreviews = [];
  this.imageFiles = [];
  this.imageFromPar=[];
  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Clear the file input of image after save or update
  }
  
}


  // Method to navigate to the "Show Category" page
  onShowCategory(): void {
    this.router.navigate(['/home']);
  }
}
