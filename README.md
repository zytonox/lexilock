# LexiLock

Build your vocabulary with LexiLock. Add words in context, get helpful hints with translations and transcriptions, reverse translation, categorize (idioms, phrasal verbs, etc.) and filter by category for targeted practice.

## How to use

1. **Open "manage.html"**: Open the `manage.html` file in your browser.
2. **Enter Context**: Type the sentence or passage containing the new word(s) into the "Context" field.
3. **Add Word Details**:
   For each new word:
   - Enter the word or phrase itself in the "Original" field.
   - Enter the phonetic transcription in the "Transcription" field.
   - Enter the translation in the "Translation" field.
   - Select the word type (Word, Collocation, Idiom, or Phrasal Verb) from the "Type" dropdown.
   - Click the "+" button to add more words within the same context.
4. **Copy Context Data**: Once you've added all words for the context, click the "Copy Context" button. The data will be copied to your clipboard.
5. **Update Vocabulary Data**:
   - Navigate to the `scripts/data/` folder and open the appropriate category file (e.g., news-politics.js, science.js, films.js).
   - Paste the copied data at the end of the array in that file.
   - To create a new category:
     - Create a new `.js` file in the `scripts/data/` folder.
     - Add: `allData['Category Name'] = []` (replace with your category name).
     - Paste your data into the array.
     - Add `<script src="scripts/data/your-category.js"></script>` to `learn.html`.
6. **Practice and Explore**:
   - Open `learn.html` in a browser to practice the new words within their context.
   - Switch Data: Use the data dropdown to change thematic context.
   - Enable Hints: Click words to reveal translations and transcriptions.
   - Reverse Practice: Toggle translation direction with the "Translate" button.
   - Filter Types: Focus on idioms, phrasal verbs, collocations, or words.
   - Change View: Switch between single and multiple context modes.
   - View Hints: Click on the added words within the context to reveal their associated hints.

## Note

- You can add multiple contexts. Each new context is appended to the previous ones before being copied.
- Click "Clear Context" to remove all entered contexts.
