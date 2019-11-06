import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { isBlank, isPresent } from './utils';

export class CustomValidators {

  public static uniqueBy = (field: string, caseSensitive: boolean = true): ValidatorFn => {
    return (formArray: FormArray): { [key: string]: boolean } => {
      const controls: AbstractControl[] = formArray.controls.filter((formGroup: FormGroup) => {
        return isPresent(formGroup.get(field).value);
      });
      const uniqueObj: any = { uniqueBy: true };
      let find: boolean = false;
      
      if (controls.length > 1) {
        for (let i: number = 0; i < controls.length; i++) {
          const formGroup: FormGroup = controls[i];
          const mainControl: AbstractControl = formGroup.get(field);

          const val: string = mainControl.value;

          const mainValue: string = caseSensitive ? val.toLowerCase() :  val;
          controls.forEach((group: FormGroup, index: number) => {
            if (i === index) {
              // Same group
              return;
            }

            const currControl: any = group.get(field);
            const tempValue: string = currControl.value;
            const currValue: string = caseSensitive ? tempValue.toLowerCase() : tempValue;
            let newErrors: any;

            if ( mainValue === currValue) {
              if (isBlank(currControl.errors)) {
                newErrors = uniqueObj;
              } else {
                newErrors = Object.assign(currControl.errors, uniqueObj);
              }

              find = true;
            } else {
              newErrors = currControl.errors;

              if (isPresent(newErrors)) {
                // delete uniqueBy error
                delete newErrors['uniqueBy'];
                if (isBlank(newErrors)) {
                  // {} to undefined/null
                  newErrors = null;
                }
              }
            }
            
            // Add specific errors based on condition
            currControl.setErrors(newErrors);
          });
        }
        
        if (find) {
          // Set errors to whole formArray
          return uniqueObj;
        }
      }

      // Clean errors
      return null;
    };
  }
}
