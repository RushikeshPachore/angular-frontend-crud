import { AbstractControl, ValidationErrors } from "@angular/forms";

export function ageValidator(control:AbstractControl):ValidationErrors | null {
    //control.value, in this value is inbuilt property of abstractControl class

    const value=control.value;
    if(value && value<=18){
        return{ageGreaterThan18:true};
    }
     return null;
}


export function noSpaceValidator(control:AbstractControl):ValidationErrors | null{

    const value= control.value?.trim();
     if (!value || value.length===0){
        return {noSpace:true};
     }
     return null;
}