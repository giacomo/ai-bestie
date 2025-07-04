import { Component, OnInit, Optional } from '@angular/core';
import { ElectronService } from '../services/electron/electron.service';
import { OpenRouterService } from '../services/open-router/open-router';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { map } from 'rxjs';

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings.dialog.html',
    styleUrls: ['./settings.dialog.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule]
})
export class SettingsDialogComponent implements OnInit {
    apiKey: string = '';
    selectedModel: string = '';
    models: string[] = [];
    showApiKey: boolean = false;

    constructor(
        private openRouterService: OpenRouterService,
        private electronService: ElectronService,
        @Optional() private dialogRef: DialogRef<{ action: string, model: string }>,
    ) {
    }

    ngOnInit() {
        this.openRouterService.getModels().pipe(
            map((models: any[]) => models.filter(model => model.endsWith(':free'))),
        ).subscribe((models: any) => {
            this.models = models;
        });

        this.electronService.invoke('get-api-key').then((apiKey: string) => {
            this.apiKey = apiKey;
        });

        this.electronService.invoke('get-api-model').then((selectedModel: string) => {
            this.selectedModel = selectedModel;
        });
    }

    onSave() {
        this.electronService.send('set-api-key', this.apiKey);
        this.electronService.send('set-model', this.selectedModel);
        if (this.dialogRef) {
            this.dialogRef.close({ action: 'updated', model: this.selectedModel });
        }
    }

    close() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    toggleApiKeyVisibility() {
        this.showApiKey = !this.showApiKey;
    }
}
