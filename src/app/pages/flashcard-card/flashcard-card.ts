import {Component, computed, effect, input, output, signal} from '@angular/core';
import {FlashcardItem} from '../../services/flashcard.service';
import {getMeaningText, getPronunciationText, getScriptText} from '../../utils/vocab-display.util';

const SWIPE_THRESHOLD_PX = 120;
const DRAG_VS_TAP_THRESHOLD_PX = 6;
const EXIT_ANIMATION_MS = 260;

@Component({
    selector: 'app-flashcard-card',
    templateUrl: './flashcard-card.html',
    styleUrl: './flashcard-card.scss'
})
export class FlashcardCard {
    card = input.required<FlashcardItem>();
    script = input.required<'hiragana' | 'kanji'>();
    answerLang = input.required<'english' | 'bangla'>();
    pronunciationLang = input.required<'off' | 'english' | 'bangla'>();

    swiped = output<'left' | 'right'>();

    flipped = signal(false);
    dragging = signal(false);
    dragX = signal(0);
    dragY = signal(0);
    exitDirection = signal<'left' | 'right' | null>(null);

    questionText = computed(() => getScriptText(this.card().vocab, this.script()));
    answerText = computed(() => getMeaningText(this.card().vocab, this.answerLang()));
    pronunciationText = computed(() => getPronunciationText(this.card().vocab, this.pronunciationLang()));

    overlayLabel = computed<'like' | 'nope' | null>(() => {
        if (this.dragX() > 40) return 'like';
        if (this.dragX() < -40) return 'nope';
        return null;
    });

    overlayOpacity = computed(() => Math.min(Math.abs(this.dragX()) / SWIPE_THRESHOLD_PX, 1));

    cardStyle = computed(() => {
        const exit = this.exitDirection();
        if (exit) {
            const x = exit === 'right' ? 700 : -700;
            return {
                transform: `translate(${x}px, ${this.dragY()}px) rotate(${x / 20}deg)`,
                transition: `transform ${EXIT_ANIMATION_MS}ms ease-out, opacity ${EXIT_ANIMATION_MS}ms ease-out`,
                opacity: '0'
            };
        }

        const rotation = this.dragX() / 12;
        const isDragging = this.dragging();

        return {
            transform: `translate(${this.dragX()}px, ${this.dragY()}px) rotate(${rotation}deg)`,
            // If not dragging and dragX/dragY are 0, reset instantly without animating back from exit position
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            opacity: '1'
        };
    });

    private pointerId: number | null = null;
    private dragStartX = 0;
    private dragStartY = 0;
    private hasDragged = false;

    constructor() {
        effect(() => {
            // Track the card input to reset state whenever the card updates
            this.card();
            this.resetState();
        });
    }

    private resetState(): void {
        this.flipped.set(false);
        this.dragging.set(false);
        this.dragX.set(0);
        this.dragY.set(0);
        this.exitDirection.set(null);
    }

    onPointerDown(event: PointerEvent): void {
        if (this.exitDirection()) return;

        // Prevent touch scrolling on mobile devices while dragging
        if (event.cancelable) {
            event.preventDefault();
        }

        this.pointerId = event.pointerId;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.hasDragged = false;
        this.dragging.set(true);

        (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    onPointerMove(event: PointerEvent): void {
        if (!this.dragging() || event.pointerId !== this.pointerId) return;

        const dx = event.clientX - this.dragStartX;
        const dy = event.clientY - this.dragStartY;

        if (Math.abs(dx) > DRAG_VS_TAP_THRESHOLD_PX || Math.abs(dy) > DRAG_VS_TAP_THRESHOLD_PX) {
            this.hasDragged = true;
        }

        this.dragX.set(dx);
        this.dragY.set(dy);
    }

    onPointerUp(event: PointerEvent): void {
        if (event.pointerId !== this.pointerId) return;

        this.dragging.set(false);
        this.pointerId = null;

        if (Math.abs(this.dragX()) >= SWIPE_THRESHOLD_PX) {
            this.commitSwipe(this.dragX() > 0 ? 'right' : 'left');
            return;
        }

        if (!this.hasDragged) {
            this.flipped.update(f => !f);
        }

        this.dragX.set(0);
        this.dragY.set(0);
    }

    // Allows the parent page's Correct/Incorrect buttons to trigger the same animated exit
    forceSwipe(direction: 'left' | 'right'): void {
        if (this.exitDirection()) return;
        this.commitSwipe(direction);
    }

    private commitSwipe(direction: 'left' | 'right'): void {
        this.exitDirection.set(direction);
        setTimeout(() => this.swiped.emit(direction), EXIT_ANIMATION_MS);
    }
}
