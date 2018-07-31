import {
  Component,
} from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-integer-widget',
  template: `<div class="widget form-group">
	<label [attr.for]="id" class="horizontal control-label">
		{{ schema.title }}
	</label>
  <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
	<input [attr.readonly]="schema.readOnly?true:null" [name]="name"
	class="text-widget integer-widget form-control" [formControl]="control"
	[attr.type]="'number'" [attr.min]="schema.minimum" [attr.max]="schema.maximum"
	[attr.placeholder]="schema.placeholder"
	[attr.maxLength]="schema.maxLength || null"
  [attr.minLength]="schema.minLength || null">
</div>`
})
export class IntegerWidget extends ControlWidget {
  ngAfterViewInit() {
    const control = this.control;
    this.formProperty.valueChanges.subscribe((newValue) => {
      if (control.value !== newValue) {
        control.setValue(newValue, {emitEvent: false});
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
      this.formProperty.setValue(newValue, false);
    });
  }
}
