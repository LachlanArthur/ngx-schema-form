import {
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { ControlWidget } from '../../widget';
import { NumberProperty } from '../../model/numberproperty';

@Component({
  selector: 'sf-integer-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
  <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
	<input #input [attr.readonly]="schema.readOnly?true:null" [name]="name"
	class="text-widget integer-widget form-control" [formControl]="control"
	[attr.type]="'number'" [attr.min]="schema.minimum" [attr.max]="schema.maximum"
	[attr.placeholder]="schema.placeholder"
	[attr.maxLength]="schema.maxLength || null"
  [attr.minLength]="schema.minLength || null">
</div>`
})
export class IntegerWidget extends ControlWidget {
  formProperty: NumberProperty;
  private _displayValue: string;
  @ViewChild('input') element: ElementRef;

  ngAfterViewInit() {
    const control = this.control;
    this.formProperty.valueChanges.subscribe((newValue) => {
      // Ignore the model value, use the display value instead
      if (control.value !== this._displayValue) {
        control.setValue(this._displayValue, {emitEvent: false});
      }
    });
    this.formProperty.errorsChanges.subscribe((errors) => {
      control.setErrors(errors, { emitEvent: true });
      const messages = (errors || [])
        .filter(e => {
          return e.path && e.path.slice(1) === this.formProperty.path;
        })
        .map(e => e.message);
      this.errorMessages = messages.filter((m, i) => messages.indexOf(m) === i);
    });
    control.valueChanges.subscribe((newValue) => {
      // Store a copy of the original string value
      this._displayValue = newValue;
      this.formProperty.setValue(newValue, false);
      if (newValue === '' && (<HTMLInputElement>this.element.nativeElement).validity.badInput) {
        // Show a custom error if the number is invalid
        this.formProperty.extendErrors([{
          path: '#'+this.formProperty.path,
          message: 'Invalid number',
        }]);
      }
    });
  }
}
