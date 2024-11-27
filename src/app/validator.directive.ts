import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
import { ageValidator } from './validators';

@Directive({
  selector: '[ageGreaterThan18]',  // The selector for using the directive in templates
  providers: [
    { provide: NG_VALIDATORS, useExisting: validatorDirective, multi: true },

  ]
})

export class validatorDirective implements Validator { //this directive is imported in app.module , then it can be used in input field
  validate(control: AbstractControl) {
    return ageValidator(control);
  }
}


