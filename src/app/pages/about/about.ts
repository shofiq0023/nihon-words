import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-about',
    imports: [FontAwesomeModule],
    templateUrl: './about.html',
    styleUrl: './about.scss'
})
export class About {
    icons = { faArrowLeft };

    constructor(private router: Router) {}

    goHome(): void {
        this.router.navigate(['/']);
    }
}
