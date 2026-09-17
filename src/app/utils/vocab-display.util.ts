import {Vocabulary} from '../models/vocabulary.model';

export function getScriptText(vocab: Vocabulary, script: 'hiragana' | 'kanji'): string {
    return script === 'hiragana' ? vocab.hiragana : (vocab.kanji || vocab.hiragana);
}

export function getMeaningText(vocab: Vocabulary, answerLang: 'english' | 'bangla'): string {
    return answerLang === 'english' ? vocab.englishMeaning : vocab.banglaMeaning;
}

export function getPronunciationText(vocab: Vocabulary, pronunciationLang: 'off' | 'english' | 'bangla'): string {
    if (pronunciationLang === 'english') {
        return `(${vocab.englishPronunciation})`;
    }
    if (pronunciationLang === 'bangla') {
        return `(${vocab.banglaPronunciation})`;
    }
    return '';
}
