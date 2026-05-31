export interface Vocabulary {
    hiragana: string;
    banglaPronunciation: string;
    kanji: string;
    englishMeaning: string;
    banglaMeaning: string;
}

export interface Lesson {
    lesson: number;
    vocabulary: Vocabulary[];
}

export interface VocabularyData {
    data: Lesson[];
}
