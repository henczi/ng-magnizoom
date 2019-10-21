import { NgModule } from '@angular/core';
import { NgMagnizoomComponent } from './magnizoom.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [NgMagnizoomComponent],
  imports: [
    CommonModule
  ],
  exports: [NgMagnizoomComponent]
})
export class NgMagnizoomModule { }
