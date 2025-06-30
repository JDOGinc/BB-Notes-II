import React from 'react';
import './BibleRef.css';
import { useBridge } from '../../../hooks/useBridge';

const BibleVerse = ({ children }) => {
    const {sendMessage} = useBridge();
    const bibleRefTxt = children[0]?.props?.text || '';

    const splitReference = (ref) => {
        // Desestructuramos la referencia usando la lógica anterior
        const [bookAndChapter, versesPart] = ref.split(":");

        // Obtenemos el libro y el capítulo
        const book = bookAndChapter.match(/(?:[1-3]?[a-zA-Z]+)/)[0].toLowerCase();
        const chapter = parseInt(bookAndChapter.match(/\d+/)[0]);

        // Procesar versículos
        let arrayVerses = [];
        if (versesPart.includes(",")) {
            arrayVerses = versesPart.split(",").flatMap((part) => {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map((verse) => parseInt(verse));
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            } else {
                return [parseInt(part)];
            }
            });
        } else if (versesPart.includes("-")) {
            const [start, end] = versesPart.split("-").map((verse) => parseInt(verse));
            if (start > end) {
            return { book, chapter, arrayVerses: null, versesPart };
            }
            arrayVerses = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
            );
        } else {
            arrayVerses = [parseInt(versesPart)];
        }
        arrayVerses = Array.from(new Set(arrayVerses)).sort((a, b) => a - b);

        return { book, chapter, arrayVerses, versesPart };
    };

    const fetchBibleRef = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.activeElement.blur();
        if (!bibleRefTxt) {
            console.warn('No se encontró una referencia bíblica válida.');
            return;
        }
        const { book, chapter, arrayVerses, versesPart } = splitReference(bibleRefTxt);
        const data = {
            book,
            chapter,
            verses: arrayVerses,
            versesPart,
        };
        sendMessage({type: 'BIBLE_REF', payload: data});
        console.log('Referencia enviada:', data);
    };

  return (
    <span className='bible-ref'
      onClick={(e) =>fetchBibleRef(e)}
    >
      {children}
    </span>
  );
};

export default BibleVerse;
