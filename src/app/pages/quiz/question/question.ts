import { Component, input, output } from '@angular/core';
import { QuizQuestion } from '../../../services/quiz.service';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
    imports: [FontAwesomeModule],
    selector: 'app-question',
    templateUrl: './question.html',
    styleUrl: './question.scss'
})
export class Question {
    readonly correctIcon = faCheck;
    readonly incorrectIcon = faXmark;

    question = input.required<QuizQuestion>();
    onAnswer = output<{ questionId: number; correct: boolean }>();

    selectedAnswer: string | null = null;
    answered = false;

    select(option: string): void {
        if (this.answered) return;
        this.selectedAnswer = option;
        this.answered = true;
        const correct = option === this.question().correctAnswer;
        this.onAnswer.emit({ questionId: this.question().id, correct });
    }

    getOptionClass(option: string): string {
        if (!this.answered) return '';
        if (option === this.question().correctAnswer) return 'correct';
        if (option === this.selectedAnswer) return 'wrong';
        return 'dimmed';
    }

    get questionText(): string {
        const q = this.question();
        const word = q.script === 'hiragana' ? q.vocab.hiragana : (q.vocab.kanji || q.vocab.hiragana);
        if (q.showPronunciation && q.script === 'kanji') {
            return `${word} (${q.vocab.banglaPronunciation})`;
        }
        if (q.showPronunciation) {
            return `${word} (${q.vocab.banglaPronunciation})`;
        }
        return word;
    }
}
