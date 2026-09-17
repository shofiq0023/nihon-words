import {Injectable} from '@angular/core';
import {Lesson, Vocabulary, VocabularyData} from '../models/vocabulary.model';
import vocabularyData from '../../data/minna_no_nihongo_N5_vocabulary.json';
import {shuffle} from '../utils/shuffle.util';

@Injectable({
    providedIn: 'root'
})
export class VocabularyService {

    private data: VocabularyData = vocabularyData as VocabularyData;

    getAllLessons(): Lesson[] {
        return this.data.data;
    }

    getLessonNumbers(): number[] {
        return this.data.data.map((l) => l.lesson);
    }

    getVocabularyByLessons(lessonNumbers: number[]): Vocabulary[] {
        return this.data.data
            .filter((l) => lessonNumbers.includes(l.lesson))
            .flatMap((l) => l.vocabulary);
    }

    /**
     * Selects vocabulary per lesson using the app-wide sampling rule:
     * 1 lesson -> all its vocabulary, 2 lessons -> half of each,
     * 3+ lessons -> 15 words from each. Used by both the quiz and flashcards.
     */
    selectVocabulary(lessonNumbers: number[]): Vocabulary[] {
        const count = lessonNumbers.length;
        const result: Vocabulary[] = [];

        for (const num of lessonNumbers) {
            const lesson = this.data.data.find((l) => l.lesson === num);
            if (!lesson) continue;

            const vocab = shuffle(lesson.vocabulary);

            if (count < 2) {
                result.push(...vocab);
            } else if (count === 2) {
                result.push(...vocab.slice(0, Math.ceil(vocab.length / 2)));
            } else {
                result.push(...vocab.slice(0, 15));
            }
        }

        return result;
    }
}
