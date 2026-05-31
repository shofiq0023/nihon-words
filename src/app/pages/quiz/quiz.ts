import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService, QuizQuestion } from '../../services/quiz.service';
import { Question } from './question/question';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faAlarmClock, faArrowRightLong} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-quiz',
    imports: [Question, FontAwesomeModule],
    templateUrl: './quiz.html',
    styleUrl: './quiz.scss'
})
export class Quiz implements OnInit, OnDestroy {
    readonly stopwatchIcon = faAlarmClock;

    questions: QuizQuestion[] = [];
    answeredMap = new Map<number, boolean>(); // questionId -> correct
    correctCount = signal(0);
    showConfirmDialog = signal(false);

    // Timer
    timed = false;
    timerSeconds = 0;
    remainingSeconds = signal(0);
    private timerInterval: ReturnType<typeof setInterval> | null = null;

    // Config
    script: 'hiragana' | 'kanji' = 'hiragana';
    answerLang: 'english' | 'bangla' = 'english';
    showPronunciation = false;

    answeredCount = computed(() => this.answeredMap.size);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private quizService: QuizService
    ) {}

    ngOnInit(): void {
        const params = this.route.snapshot.queryParamMap;

        const lessons = (params.get('lessons') ?? '1')
            .split(',')
            .map(Number)
            .filter(Boolean);

        this.script = (params.get('script') ?? 'hiragana') as 'hiragana' | 'kanji';
        this.answerLang = (params.get('answerLang') ?? 'english') as 'english' | 'bangla';
        this.showPronunciation = params.get('pronunciation') === 'true';
        this.timed = params.get('timed') === 'true';
        this.timerSeconds = Number(params.get('timer') ?? 15);

        this.questions = this.quizService.buildQuestions(
            lessons, this.script, this.answerLang, this.showPronunciation
        );

        if (this.timed) {
            this.remainingSeconds.set(this.timerSeconds * this.questions.length);
            this.startTimer();
        }
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    handleAnswer(event: { questionId: number; correct: boolean }): void {
        this.answeredMap.set(event.questionId, event.correct);
        if (event.correct) {
            this.correctCount.update(c => c + 1);
        }
    }

    get unansweredCount(): number {
        return this.questions.length - this.answeredMap.size;
    }

    tryFinish(): void {
        if (this.unansweredCount > 0) {
            this.showConfirmDialog.set(true);
        } else {
            this.goToFinish();
        }
    }

    confirmFinish(): void {
        this.showConfirmDialog.set(false);
        this.goToFinish();
    }

    cancelFinish(): void {
        this.showConfirmDialog.set(false);
    }

    private goToFinish(): void {
        this.clearTimer();

        const correct = this.correctCount();
        const total = this.questions.length;
        const answered = this.answeredMap.size;

        this.router.navigate(['/finish'], {
            queryParams: {
                correct,
                total,
                answered,
                percentage: Math.round((correct / total) * 100)
            }
        });
    }

    private startTimer(): void {
        this.timerInterval = setInterval(() => {
            this.remainingSeconds.update(s => {
                if (s <= 1) {
                    this.clearTimer();
                    this.goToFinish();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }

    private clearTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    get formattedTime(): string {
        const s = this.remainingSeconds();
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    get timerUrgent(): boolean {
        return this.remainingSeconds() <= 10;
    }

    protected readonly arrowLongRight = faArrowRightLong;
    protected readonly faAlarmClock = faAlarmClock;
}
