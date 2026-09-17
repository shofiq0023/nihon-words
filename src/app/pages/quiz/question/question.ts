import {Component, input, output} from '@angular/core';
import {QuizQuestion} from '../../../services/quiz.service';
import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {getPronunciationText, getScriptText} from '../../../utils/vocab-display.util';

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
        return getScriptText(q.vocab, q.script);
    }

    get pronunciationText(): string {
        const q = this.question();
        return getPronunciationText(q.vocab, q.pronunciationLang);
    }
}
