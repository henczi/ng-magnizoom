import { NgModule } from '@angular/core';
import { MagnizoomComponent } from './magnizoom.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [MagnizoomComponent],
  imports: [
    CommonModule
  ],
  exports: [MagnizoomComponent]
})
export class MagnizoomModule { }
