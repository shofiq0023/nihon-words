import { Injectable } from '@angular/core';
import { Vocabulary, Lesson } from '../models/vocabulary.model';
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
        const allVocab = this.allLessons.flatMap(l => l.vocabulary);
        const shuffled = this.shuffle(selectedVocab);

        return shuffled.map((vocab, index) => {
            const correctAnswer = answerLang === 'english' ? vocab.englishMeaning : vocab.banglaMeaning;
            const distractors = this.getDistractors(vocab, allVocab, answerLang, 3);
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
        const candidates = pool
            .filter(v => {
                const ans = lang === 'english' ? v.englishMeaning : v.banglaMeaning;
                return ans !== correctAnswer;
            })
            .map(v => lang === 'english' ? v.englishMeaning : v.banglaMeaning);

        const unique = [...new Set(candidates)];
        return this.shuffle(unique).slice(0, count);
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
