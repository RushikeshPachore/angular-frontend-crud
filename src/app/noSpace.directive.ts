import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
import { noSpaceValidator } from './validators';

@Directive({
  selector: '[noSpaceValidator]',  // The name of the directive in templates
  providers: [
    { provide: NG_VALIDATORS, useExisting: NoSpaceValidatorDirective, multi: true }
  ]
})
export class NoSpaceValidatorDirective implements Validator {
  validate(control: AbstractControl) {
    return noSpaceValidator(control);
  }
}
