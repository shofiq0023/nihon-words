import {Injectable} from '@angular/core';
import {Lesson, Vocabulary} from '../models/vocabulary.model';
import vocabularyData from '../../data/minna_no_nihongo_N5_vocabulary.json';

export interface QuizQuestion {
    id: number;
    vocab: Vocabulary;
    options: string[];
    correctAnswer: string;
    script: 'hiragana' | 'kanji';
    answerLang: 'english' | 'bangla';
    showPronunciation: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuizService {

    private allLessons: Lesson[] = (vocabularyData as any).data;

    buildQuestions(
        lessonNumbers: number[],
        script: 'hiragana' | 'kanji',
        answerLang: 'english' | 'bangla',
        showPronunciation: boolean
    ): QuizQuestion[] {
        const selectedVocab = this.selectVocab(lessonNumbers);
        const shuffled = this.shuffle(selectedVocab);

        return shuffled.map((vocab, index) => {
            const correctAnswer = answerLang === 'english' ? vocab.englishMeaning : vocab.banglaMeaning;

            // Get the full vocab pool from the same lesson as this word
            const lessonPool = this.allLessons
                .find(l => l.vocabulary.includes(vocab))
                ?.vocabulary ?? [];

            const distractors = this.getDistractors(vocab, lessonPool, answerLang, 3);
            const options = this.shuffle([correctAnswer, ...distractors]);

            return {
                id: index + 1,
                vocab,
                options,
                correctAnswer,
                script,
                answerLang,
                showPronunciation
            };
        });
    }

    private selectVocab(lessonNumbers: number[]): Vocabulary[] {
        const count = lessonNumbers.length;
        const result: Vocabulary[] = [];

        for (const num of lessonNumbers) {
            const lesson = this.allLessons.find(l => l.lesson === num);
            if (!lesson) continue;

            const vocab = this.shuffle([...lesson.vocabulary]);

            if (count < 2) {
                result.push(...vocab);
            } else if (count <= 2) {
                result.push(...vocab.slice(0, Math.ceil(vocab.length / 2)));
            } else {
                result.push(...vocab.slice(0, 15));
            }
        }

        return result;
    }

    private getDistractors(
        correct: Vocabulary,
        pool: Vocabulary[],
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
            const allVocab = this.allLessons.flatMap(l => l.vocabulary);
            candidates = [...new Set(
                allVocab
                    .filter(v => extract(v) !== correctAnswer)
                    .map(extract)
            )];
        }

        return this.shuffle(candidates).slice(0, count);
    }

    private shuffle<T>(arr: T[]): T[] {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
