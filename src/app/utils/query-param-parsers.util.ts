export function parseScript(value: string | null): 'hiragana' | 'kanji' {
    return value === 'kanji' ? 'kanji' : 'hiragana';
}

export function parseAnswerLang(value: string | null): 'english' | 'bangla' {
    return value === 'bangla' ? 'bangla' : 'english';
}

export function parsePronunciationLang(value: string | null): 'off' | 'english' | 'bangla' {
    return value === 'english' || value === 'bangla' ? value : 'off';
}
