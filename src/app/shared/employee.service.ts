import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Designation, Employee, Hobbies } from './employee.model';
import { Observable, tap } from 'rxjs';
// import { Designation } from './designation.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private http:HttpClient) { } //http object for crud operation

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

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${employeeId}`);
  }

  UpdateEmployee(employeeData:any): Observable<any>{
    if (!this.employeeData.id) {
      throw new Error("Employee ID is undefined.");
    }
    return this.http.put(`${this.employeeUrl}/${this.employeeData.id}`,this.employeeData); //Here, this.employeeUrl is the base URL for the employee API (e.g., https://localhost:4200/api/Employee).
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

  // Set hobbies for the employee, store hobby ids in employee table
setHobbiesForEmployee() {
 if (!this.employeeData.id) {
     throw new Error("Employee ID is undefined.");
  }
   const hobbyIds = this.employeeData.hobbies || [];
  return this.http.post(`${this.employeeUrl}/${this.employeeData.id}/setHobbies`, hobbyIds);
}



}
