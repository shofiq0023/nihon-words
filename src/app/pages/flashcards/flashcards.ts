import {Component, OnInit, computed, signal, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FlashcardItem, FlashcardService} from '../../services/flashcard.service';
import {FlashcardCard} from '../flashcard-card/flashcard-card';
import {parseAnswerLang, parsePronunciationLang, parseScript} from '../../utils/query-param-parsers.util';

@Component({
    selector: 'app-flashcards',
    imports: [FontAwesomeModule, FlashcardCard],
    templateUrl: './flashcards.html',
    styleUrl: './flashcards.scss'
})
export class Flashcards implements OnInit {
    readonly backIcon = faArrowLeft;
    readonly correctIcon = faCheck;
    readonly incorrectIcon = faXmark;

    private readonly topCard = viewChild(FlashcardCard);

    cards: FlashcardItem[] = [];
    script: 'hiragana' | 'kanji' = 'hiragana';
    answerLang: 'english' | 'bangla' = 'english';
    pronunciationLang: 'off' | 'english' | 'bangla' = 'off';

    private currentIndex = signal(0);
    private correctCount = signal(0);

    currentCard = computed<FlashcardItem | null>(() => this.cards[this.currentIndex()] ?? null);
    nextCard = computed<FlashcardItem | null>(() => this.cards[this.currentIndex() + 1] ?? null);
    remaining = computed(() => this.cards.length - this.currentIndex());

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private flashcardService: FlashcardService
    ) {}

    ngOnInit(): void {
        const params = this.route.snapshot.queryParamMap;

        const lessons = (params.get('lessons') ?? '1')
            .split(',')
            .map(Number)
            .filter(Boolean);

        this.script = parseScript(params.get('script'));
        this.answerLang = parseAnswerLang(params.get('answerLang'));
        this.pronunciationLang = parsePronunciationLang(params.get('pronunciation'));

        this.cards = this.flashcardService.buildFlashcards(lessons);

        if (this.cards.length === 0) {
            this.router.navigate(['/home']);
        }
    }

    handleSwipe(direction: 'left' | 'right'): void {
        if (direction === 'right') {
            this.correctCount.update(c => c + 1);
        }

        if (this.currentIndex() + 1 >= this.cards.length) {
            this.goToFinish();
        } else {
            this.currentIndex.update(i => i + 1);
        }
    }

    triggerSwipe(direction: 'left' | 'right'): void {
        this.topCard()?.forceSwipe(direction);
    }

    goHome(): void {
        this.router.navigate(['/home']);
    }

    private goToFinish(): void {
        const correct = this.correctCount();
        const total = this.cards.length;

        this.router.navigate(['/finish'], {
            queryParams: {
                correct,
                total,
                answered: total,
                percentage: Math.round((correct / total) * 100)
            }
        });
    }
}
