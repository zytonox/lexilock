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
   - Open `learn.html` in a browser to practice the new words within their context:

   <p align="left">
      <img width="400px" alt="initial" src="https://github.com/user-attachments/assets/d6c2ce48-e1ee-4122-8a28-46fa34207f30" />
   </p>

   - Switch Data: Use the data dropdown to change thematic context:

   <p align="left">
      <img width="400px" alt="data" src="https://github.com/user-attachments/assets/f4a1eb40-1346-4844-ae46-a25965a32cee" />
   </p>

   - View Hints: Enable hints and click words to reveal translations and transcriptions:

   <p align="left">
      <img width="400px" alt="hint" src="https://github.com/user-attachments/assets/00142599-92d2-4bde-8b84-23cd0b495d12" />
   </p>

   - Reverse Practice: Toggle translation direction with the "Translate" button:

   <p align="left">
      <img width="400px" alt="translated" src="https://github.com/user-attachments/assets/45d0041d-caa1-4e56-b310-3ed3db51729c" />
   </p>

   - Filter Types: Focus on idioms, phrasal verbs, collocations, or words:

   <p align="left">
      <img width="400px" alt="filter" src="https://github.com/user-attachments/assets/60f9f256-5385-45bb-abed-52eee1244f04" />

      <img width="400px" alt="filtered" src="https://github.com/user-attachments/assets/839af233-2a43-4a85-9b71-57fb2bee5147" />
   </p>

   - Change View: Switch between single and multiple context modes:

   <p align="left">
      <img width="400px" alt="view" src="https://github.com/user-attachments/assets/f2e629dd-2eb7-459a-8c20-b40598190fd7" />
   </p>

## Note

- You can add multiple contexts. Each new context is appended to the previous ones before being copied.
- Click "Clear Context" to remove all entered contexts.
