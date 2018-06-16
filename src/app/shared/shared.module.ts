import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatNavList,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSliderModule,
  MatSnackBarModule,
  MatDialogModule
} from '@angular/material';
import { SharedService } from './shared.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogOverviewExampleDialog } from '../app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [SharedService],
  entryComponents: [DialogOverviewExampleDialog],
  declarations: [DialogOverviewExampleDialog]
})
export class SharedModule { }
