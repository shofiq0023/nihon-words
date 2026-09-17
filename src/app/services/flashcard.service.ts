import {Injectable} from '@angular/core';
import {Vocabulary} from '../models/vocabulary.model';
import {VocabularyService} from './vocabulary.service';
import {shuffle} from '../utils/shuffle.util';

export interface FlashcardItem {
    id: number;
    vocab: Vocabulary;
}

@Injectable({ providedIn: 'root' })
export class FlashcardService {

    constructor(private vocabularyService: VocabularyService) {}

    buildFlashcards(lessonNumbers: number[]): FlashcardItem[] {
        const selectedVocab = this.vocabularyService.selectVocabulary(lessonNumbers);
        const shuffled = shuffle(selectedVocab);

        return shuffled.map((vocab, index) => ({
            id: index + 1,
            vocab
        }));
    }
}
