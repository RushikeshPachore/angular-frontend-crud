import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Designation, Employee, Hobbies } from './employee.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { Designation } from './designation.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private http:HttpClient) { } //http object for crud operation

  imageUrl:string= 'http://localhost:5213/api/Image';
  employeeUrl: string = 'http://localhost:5213/api/Employees';  //api endpoint for managing employee data.port number is from backend
  designationUrl:string='http://localhost:5213/api/Designation';
  hobbyUrl:string='http://localhost:5213/api/Hobbies';
  
  listEmployee:Employee[]=[];//for get ,Employee list will be saved here
  listDesignation:Designation[]=[]; //for get
  listHobbies:Hobbies[]=[];

  employeeData:Employee=new Employee(); //to post data


  saveEmployee(employee:any): Observable<any>{ 
    return this.http.post(this.employeeUrl,employee); 
  }
//
  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${employeeId}`);
  }

  UpdateEmployee(employeeData:any): Observable<any>{
    console.log("Update employee data",employeeData);
    if (!this.employeeData.id) {
      throw new Error("Employee ID is undefined.");
    }
    return this.http.put(`${this.employeeUrl}/${this.employeeData.id}`,employeeData); //Here, this.employeeUrl is the base URL for the employee API (e.g., https://localhost:4200/api/Employee).
   // this.employeeData.id retrieves the ID of the employee you want to update. This ID is appended to the base URL to form the full URL. For example, if the ID is 123, the resulting URL might be https://localhost:4200/api/Employee/123.
  }

  getEmployee():Observable<Employee[]>{ //WE USE OBSERVABLE FOR GET METHOD ALWAYS, IT IS PATTERN IN ANGULAR 
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  getHobbies(): Observable<Hobbies[]> {
  return this.http.get<Hobbies[]>(this.hobbyUrl);
}


getDesignation():Observable<Designation[]>{ //WE USE return type as OBSERVABLE FOR GET METHOD ALWAYS, IT IS PATTERN IN ANGULAR
    return this.http.get<Designation[]>(this.designationUrl);
}

deleteEmployee(id:number):Observable<any> {
    return this.http.delete(`${this.employeeUrl}/${id}`);
}



// getImages(employeeId: number): Observable<string[]> {
//   return this.http.get<string[]>(`http://localhost:5213/api/Image/Employee/${employeeId}`);
// }


getImages(employeeId: number):Observable<{ id:number; url:string }[]> {
  debugger;
  const apiUrl = `http://localhost:5213/api/Image/Employee/${employeeId}`;
  console.log("apiUrl,",apiUrl);
  return this.http.get<{ id:number; url:string }[]>(
    apiUrl
  );
}



uploadImages(employeeId: number, imageFiles: File[]) {
  const formData = new FormData();
  formData.append('employeeId', employeeId.toString());
  imageFiles.forEach((file) => {
    formData.append('images', file, file.name);
  });
  return this.http.post('http://localhost:5213/api/Image/Upload', formData, {
    headers: {
      // Do not include `Content-Type` header as Angular automatically sets it for FormData
    },
  });
}



removeImages(employeeId:number,imageIds:number[]): Observable<any>
{ debugger;
  return this.http.post<any>(`http://localhost:5213/api/Image/removeImages/${employeeId}`,imageIds)
}




}
