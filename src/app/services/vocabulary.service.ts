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
