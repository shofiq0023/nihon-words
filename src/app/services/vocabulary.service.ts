import {Injectable} from '@angular/core';
import {Lesson, Vocabulary, VocabularyData} from '../models/vocabulary.model';
import vocabularyData from '../../data/minna_no_nihongo_N5_vocabulary.min.json';

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
}
