import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
    faCircleCheck,
    faCircleXmark,
    faHome,
    faQuestionCircle,
    faRotateLeft,
    faTrophy
} from '@fortawesome/free-solid-svg-icons';

interface StatCard {
    label: string;
    value: string | number;
    sub?: string;
    type: 'success' | 'danger' | 'neutral';
}

@Component({
    selector: 'app-finish',
    imports: [FontAwesomeModule],
    templateUrl: './finish.html',
    styleUrl: './finish.scss'
})
export class Finish implements OnInit {
    icons = { faTrophy, faCircleCheck, faCircleXmark, faQuestionCircle, faRotateLeft, faHome };

    correct = 0;
    total = 0;
    answered = 0;
    percentage = 0;

    stats: StatCard[] = [];
    performanceMessage = '';
    performanceEmoji = '';

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        const params = this.route.snapshot.queryParamMap;
        this.correct   = Number(params.get('correct')    ?? 0);
        this.total     = Number(params.get('total')      ?? 0);
        this.answered  = Number(params.get('answered')   ?? 0);
        this.percentage = Math.round((this.correct / this.total) * 100) || 0;

        this.stats = [
            {
                label: 'Correct',
                value: this.correct,
                sub: 'out of ' + this.total,
                type: 'success'
            },
            {
                label: 'Wrong',
                value: this.answered - this.correct,
                sub: 'answered incorrectly',
                type: 'danger'
            },
            {
                label: 'Skipped',
                value: this.total - this.answered,
                sub: 'unanswered',
                type: 'neutral'
            }
        ];

        this.setPerformance();
    }

    private setPerformance(): void {
        if (this.percentage >= 90) {
            this.performanceMessage = 'Outstanding! You\'re mastering N5!';
            this.performanceEmoji = '🏆';
        } else if (this.percentage >= 75) {
            this.performanceMessage = 'Great job! Keep it up!';
            this.performanceEmoji = '🌟';
        } else if (this.percentage >= 50) {
            this.performanceMessage = 'Good effort! A little more practice!';
            this.performanceEmoji = '💪';
        } else if (this.percentage >= 25) {
            this.performanceMessage = 'Keep practicing, you\'ll get there!';
            this.performanceEmoji = '📖';
        } else {
            this.performanceMessage = 'Don\'t give up! Review and try again!';
            this.performanceEmoji = '🌱';
        }
    }

    get scoreRingOffset(): number {
        const circumference = 2 * Math.PI * 54;
        return circumference - (this.percentage / 100) * circumference;
    }

    get scoreRingColor(): string {
        if (this.percentage >= 75) return '#27ae60';
        if (this.percentage >= 50) return '#f39c12';
        return '#e74c3c';
    }

    goHome(): void {
        this.router.navigate(['/']);
    }

    playAgain(): void {
        window.history.go(-2);
    }
}
