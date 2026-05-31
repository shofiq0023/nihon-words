# Nihon Words

🔗 [nihon-words.vercel.app](https://nihon-words.vercel.app/)

A vocabulary quiz application based on the **Minna no Nihongo N5** textbook.
Practice Japanese vocabulary through multiple choice questions with support for English and Bangla.

---

## What is this?

Nihon Words helps you practice Japanese vocabulary through multiple choice questions, with support for
both English and Bangla meanings, and Bangla pronunciation guides. It covers all 25 lessons from the
Minna no Nihongo Shokyu I (N5) textbook.

---

## How to use

1. **Select your lessons** — Choose one or more lessons from the 25 available N5 lessons. You must select at least one to start.
2. **Configure your preferences** — Choose whether questions appear in Hiragana or Kanji, whether answers are in English or Bangla, and whether to show Bangla pronunciation alongside the question.
3. **Take the quiz** — Each question shows a Japanese word with 4 answer options. Select the correct meaning. Once answered, the correct answer is highlighted and the question is locked.
4. **See your results** — After finishing, you'll see your score, how many you got correct, wrong, and skipped, along with a performance message.

---

## How questions are selected

| Lessons selected | Vocabulary included |
|---|---|
| 1 lesson | All vocabulary from that lesson |
| 2 lessons | Half the vocab from each lesson |
| 3 or more lessons | 15 words from each lesson |

Vocabulary and question order are randomized every time.

---

## Timed quiz

When timed mode is enabled, a countdown runs for the entire quiz based on the time per question you set (between 5s and 60s per question). When the timer reaches zero, the quiz ends automatically and you are taken to the results page regardless of how many questions you've answered.

---

## Quiz preferences

| Preference | Options |
|---|---|
| Question script | Hiragana / Kanji |
| Answer language | English / বাংলা |
| Show pronunciation | Bangla pronunciation shown beside the question |
| Timed quiz | Enable countdown timer per question |

---

## Tech stack

- **Angular 20** — frontend framework
- **Tailwind CSS v4** — styling
- **TypeScript** — language
- **SCSS** — component-level styles
- **Font Awesome** — icons
- **Nunito** — font

---

## Vocabulary source

All vocabulary is sourced from the **Minna no Nihongo Shokyu I (N5)** textbook.
Questions include the original Japanese word in Hiragana or Kanji, with meanings available in both English and Bangla.

---

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build
```

---

## Deployment

This app is deployed on **Vercel**. Every push to `main` triggers an automatic deployment.
