import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../shared/employee.service';
import { Answer } from '../shared/employee.model';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  userName:string=''
  email:string=''
  token:string=''
  userId:string=''
  image:string=''
  gender:string=''
  // questionId:string='';
  // designation:string=''
  answers: string[] = [];
  existingAnswers:Answer[]=[];
  totalQuestion:any;
  answeredQuestions:any;

  constructor(public empService: EmployeeService,private route:Router){}
  //getting details using localStorage as we seyt them in login component
  ngOnInit(){ //as we navigated from login.ts after setting up userNmae there etc, now we get it here and set in our local variable userName

    this.userName=localStorage.getItem('userName') || 'Guest';
    this.email=localStorage.getItem('email') || 'Guest'; 
    this.token=localStorage.getItem('token');
    this.userId=localStorage.getItem('userId');
    this.gender=localStorage.getItem('gender');

    // console.log("QuesId",this.questionId);
    this.empService.getQuestion().subscribe(question=>{
      this.empService.listQuestion=question;
      console.log("ques,",this.empService.listQuestion);

      this.totalQuestion=this.empService.listQuestion.length;
      // console.log("QuestionsTotal",this.totalQuestion);

      this.countAnswers();
    })

    if (this.userId) {
      this.empService.getAnswers( Number(this.userId)).subscribe((answers) => {
        this.existingAnswers = answers;
        // console.log('Existing Answers:', this.existingAnswers);
        // Patch answers into the input fields
        this.patchAnswers();
        this.countAnswers();
      });
    }    
  }

     countAnswers(){
      this.answeredQuestions=this.existingAnswers.filter(answer=>answer?.answer?.trim() !== '').length;
      console.log("answerQuestion:,",this.answeredQuestions);
    }

  patchAnswers(){
      // Initialize answers array to match the number of questions
    this.answers = this.empService.listQuestion.map((question: any) => {
      // Find the answer for the current question if it exists
      const answer = this.existingAnswers.find(
        (ans) => ans.questionId === question.id //here question id is taken from TblAnswer as getAnswers get them from there and stored in existingAnswer
      );
      return answer ? answer.answer : ''; // Default to empty if no answer exists
    });
  }

  //when i edit the same answer and save again then it saves different entries in db, it should replace the cureent entry a
  
  saveAnswers() {
    const formattedAnswers: Answer[] = this.answers.map((answer,index) => {
      // Assuming that you can fetch the appropriate question id based on the answer
      const questionId = this.empService.listQuestion[index]?.id; // You need to map your answer to the question based on a common field
      return { //return statement is called in map function , it returns to it this:
        employeeId: Number(this.userId),
        answer: answer,
        questionId: questionId, // Add the questionId here
      };
    });
  
    this.empService.saveAnswer(formattedAnswers).subscribe(
      (response) => {
        console.log('Answers saved successfully!', response);
        alert('Answers saved successfully!');
      },
      (error) => {
        console.error('Error saving answers', error);
        alert('Failed to save answers. Please try again.');
      }
    );
  }
  
  //
  

  //method is called from html file
  logout(){
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}