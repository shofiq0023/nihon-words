import {Injectable} from '@angular/core';
import {Lesson, Vocabulary} from '../models/vocabulary.model';
import {VocabularyService} from './vocabulary.service';
import {shuffle} from '../utils/shuffle.util';

export interface QuizQuestion {
    id: number;
    vocab: Vocabulary;
    options: string[];
    correctAnswer: string;
    script: 'hiragana' | 'kanji';
    answerLang: 'english' | 'bangla';
    pronunciationLang: 'off' | 'english' | 'bangla';
}

@Injectable({ providedIn: 'root' })
export class QuizService {

    constructor(private vocabularyService: VocabularyService) {}

    buildQuestions(
        lessonNumbers: number[],
        script: 'hiragana' | 'kanji',
        answerLang: 'english' | 'bangla',
        pronunciationLang: 'off' | 'english' | 'bangla'
    ): QuizQuestion[] {
        const selectedVocab = this.vocabularyService.selectVocabulary(lessonNumbers);
        const shuffled = shuffle(selectedVocab);
        const allLessons = this.vocabularyService.getAllLessons();

        return shuffled.map((vocab, index) => {
            const correctAnswer = answerLang === 'english' ? vocab.englishMeaning : vocab.banglaMeaning;

            // Get the full vocab pool from the same lesson as this word
            const lessonPool = allLessons
                .find(l => l.vocabulary.includes(vocab))
                ?.vocabulary ?? [];

            const distractors = this.getDistractors(vocab, lessonPool, allLessons, answerLang, 3);
            const options = shuffle([correctAnswer, ...distractors]);

            return {
                id: index + 1,
                vocab,
                options,
                correctAnswer,
                script,
                answerLang,
                pronunciationLang
            };
        });
    }

    private getDistractors(
        correct: Vocabulary,
        pool: Vocabulary[],
        allLessons: Lesson[],
        lang: 'english' | 'bangla',
        count: number
    ): string[] {
        const correctAnswer = lang === 'english' ? correct.englishMeaning : correct.banglaMeaning;

        const extract = (v: Vocabulary) => lang === 'english' ? v.englishMeaning : v.banglaMeaning;

        let candidates = [...new Set(
            pool
                .filter(v => extract(v) !== correctAnswer)
                .map(extract)
        )];

        // Fallback to all vocab if lesson doesn't have enough distractors
        if (candidates.length < count) {
            const allVocab = allLessons.flatMap(l => l.vocabulary);
            candidates = [...new Set(
                allVocab
                    .filter(v => extract(v) !== correctAnswer)
                    .map(extract)
            )];
        }

        return shuffle(candidates).slice(0, count);
    }
}
