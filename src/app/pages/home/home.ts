import { Component, signal, computed } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowRightLong} from '@fortawesome/free-solid-svg-icons';

export interface QuizConfig {
    lessons: number[];
    script: 'hiragana' | 'kanji';
    answerLang: 'english' | 'bangla';
    showPronunciation: boolean;
    timed: boolean;
    timerSeconds: number;
}

@Component({
    selector: 'app-home',
    imports: [FormsModule, FontAwesomeModule, RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home {
    readonly arrowLongRight = faArrowRightLong;
    readonly totalLessons = Array.from({ length: 25 }, (_, i) => i + 1);

    selectedLessons = signal<Set<number>>(new Set());
    script = signal<'hiragana' | 'kanji'>('hiragana');
    answerLang = signal<'english' | 'bangla'>('english');
    showPronunciation = signal(false);
    timed = signal(false);
    timerSeconds = signal(15);
    showError = signal(false);

    selectedCount = computed(() => this.selectedLessons().size);

    constructor(private router: Router) {}

    toggleLesson(lesson: number): void {
        const current = new Set(this.selectedLessons());
        current.has(lesson) ? current.delete(lesson) : current.add(lesson);
        this.selectedLessons.set(current);
        this.showError.set(false);
    }

    isSelected(lesson: number): boolean {
        return this.selectedLessons().has(lesson);
    }

    selectAll(): void {
        this.selectedLessons.set(new Set(this.totalLessons));
        this.showError.set(false);
    }

    clearAll(): void {
        this.selectedLessons.set(new Set());
    }

    startQuiz(): void {
        if (this.selectedLessons().size === 0) {
            this.showError.set(true);
            return;
        }

        const config: QuizConfig = {
            lessons: [...this.selectedLessons()].sort((a, b) => a - b),
            script: this.script(),
            answerLang: this.answerLang(),
            showPronunciation: this.showPronunciation(),
            timed: this.timed(),
            timerSeconds: this.timerSeconds(),
        };

        this.router.navigate(['/quiz'], {
            queryParams: {
                lessons: config.lessons.join(','),
                script: config.script,
                answerLang: config.answerLang,
                pronunciation: config.showPronunciation,
                timed: config.timed,
                timer: config.timerSeconds,
            }
        });
    }
}
