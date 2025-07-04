import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_DIALOG_CONFIG, DialogModule } from '@angular/cdk/dialog';
import { SettingsDialogComponent } from './components/settings.dialog';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        DialogModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: DEFAULT_DIALOG_CONFIG, useValue: {
                hasBackdrop: true,
                disableClose: true,
            }
        }
    ]
})
export class SharedModule {
}
