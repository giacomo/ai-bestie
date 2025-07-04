import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    standalone: false,
    styleUrl: './app.scss'
})
export class App {
    constructor(
        private activatedRoute: ActivatedRoute,
    ) {
    }
}
