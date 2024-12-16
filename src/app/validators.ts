import { AbstractControl, ValidationErrors } from "@angular/forms";


export function noSpaceValidator(control:AbstractControl):ValidationErrors | null{
    const value= control.value?.trim();
     if (!value || value.length===0){
        return {noSpace:true};
     }
     return null;
     
}