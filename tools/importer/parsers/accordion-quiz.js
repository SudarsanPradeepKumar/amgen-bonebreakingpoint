/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-quiz. Base: accordion.
 * Source: https://www.bonebreakingpoint.com/
 * Instance: .quiz-content
 *
 * Accordion block: 2 columns per row (summary | text). Container block.
 * Each row is a quiz question with its answer.
 * xwalk fields per item: summary, text
 *
 * Source DOM: .quiz-content contains multiple .component.content.tab elements,
 * each with a .question-card (question) and .answer-container (answer).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each quiz question is in a .component.content.tab section
  const tabs = element.querySelectorAll('.component.content.tab, [id^="Section"]');

  tabs.forEach((tab) => {
    // Extract question from .question-card .title
    const questionEl = tab.querySelector('.question-card .title, .question-card h2');
    const questionText = questionEl ? questionEl.textContent.trim() : '';

    // Extract answer from .answer-container
    const answerContainer = tab.querySelector('.answer-container');

    if (questionText) {
      // Column 1: Summary (question) with field hint
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(' field:summary '));
      const summaryP = document.createElement('p');
      summaryP.textContent = questionText;
      summaryFrag.appendChild(summaryP);

      // Column 2: Text (answer) with field hint
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));

      if (answerContainer) {
        Array.from(answerContainer.children).forEach((child) => {
          if (child.textContent.trim()) {
            textFrag.appendChild(child.cloneNode(true));
          }
        });
      }

      cells.push([summaryFrag, textFrag]);
    }
  });

  // Only create block if we found quiz questions
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-quiz', cells });
    element.replaceWith(block);
  }
}
