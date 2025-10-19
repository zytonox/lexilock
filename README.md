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
5. **Update "learn.html"**:
   - Open `learn.html` in a text or code editor.
   - Locate the `data` array in the JavaScript code.
   - Paste the copied data at the end of the `data` array. Ensure proper formatting (e.g., within square brackets (`[]`) and separated by commas (`,`)).
   - Save the file.
6. **Practice in Browser**:
   - Open `learn.html` in a browser to practice the new words within their context.
   - Enable Hints: Click the "Hint" button to toggle hints on or off.
   - View Hints: Click on the added words within the context to reveal their associated hints.

## Note

- You can add multiple contexts. Each new context is appended to the previous ones before being copied.
- Click "Clear Context" to remove all entered contexts.
