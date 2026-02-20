/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.bonebreakingpoint.com/
 * Instances: #osteoporosis-one, #next-break, #good-news, #doing-all .column-splitter
 *
 * Columns block: 2 columns per row, each cell can contain text, images, or links.
 * No field hints needed for Columns blocks (xwalk exception).
 *
 * Source patterns:
 * - Osteoporosis-promo: .field-promoicon (image) + .field-promotext (text)
 * - column-splitter: .plain-html (text+CTA) + .image (image)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Osteoporosis-promo with field-promoicon/field-promotext structure
  const promoIcon = element.querySelector('.field-promoicon');
  const promoText = element.querySelector('.field-promotext');
  const promoIcon2 = element.querySelector('.field-promoicon2');
  const promoText2 = element.querySelector('.field-promotext2');
  const promoLink = element.querySelector('.field-promolink');

  // Pattern 2: column-splitter with two child divs
  const columnSplitterChildren = element.classList && element.classList.contains('column-splitter')
    ? Array.from(element.children)
    : null;

  if (promoIcon || promoText) {
    // Build column 1: image or text from promoicon/promotext
    const col1 = document.createDocumentFragment();
    if (promoIcon) {
      const img = promoIcon.querySelector('img');
      if (img) col1.appendChild(img.cloneNode(true));
    }

    // Build column 2: text content from promotext/promotext2
    const col2 = document.createDocumentFragment();
    if (promoText) {
      Array.from(promoText.children).forEach((child) => {
        if (child.textContent.trim()) {
          col2.appendChild(child.cloneNode(true));
        }
      });
    }
    if (promoLink) {
      col2.appendChild(promoLink.cloneNode(true));
    }
    if (promoText2) {
      Array.from(promoText2.children).forEach((child) => {
        if (child.textContent.trim()) {
          col2.appendChild(child.cloneNode(true));
        }
      });
    }

    // Check if there's a second image (promoicon2) and second text block
    // If so, we have content for a second row with reversed layout
    if (promoIcon2) {
      // Row 1: image | text
      cells.push([col1, col2]);

      // Row 2: text2 | image2
      const col2a = document.createDocumentFragment();
      if (promoText2 && !promoText) {
        Array.from(promoText2.children).forEach((child) => {
          if (child.textContent.trim()) {
            col2a.appendChild(child.cloneNode(true));
          }
        });
      }

      const col2b = document.createDocumentFragment();
      const img2 = promoIcon2.querySelector('img');
      if (img2) col2b.appendChild(img2.cloneNode(true));

      // Only add second row if there's meaningful content
      if (col2b.childNodes.length > 0) {
        cells.push([col2a, col2b]);
      }
    } else {
      cells.push([col1, col2]);
    }

    // Handle five-ex-text pattern (#next-break has a special large statistic)
    const fiveExText = element.querySelector('.five-ex-text');
    if (fiveExText && !promoText.querySelector('.five-ex-text')) {
      // Already captured in promoText
    }
  } else if (columnSplitterChildren && columnSplitterChildren.length >= 2) {
    // Pattern 2: column-splitter - two side-by-side divs
    const leftDiv = columnSplitterChildren[0];
    const rightDiv = columnSplitterChildren[1];

    const col1 = document.createDocumentFragment();
    const leftContent = leftDiv.querySelector('.component-content');
    if (leftContent) {
      Array.from(leftContent.childNodes).forEach((child) => {
        if (child.nodeType === 1 && child.textContent.trim()) {
          col1.appendChild(child.cloneNode(true));
        }
      });
    }

    const col2 = document.createDocumentFragment();
    const rightImg = rightDiv.querySelector('img');
    if (rightImg) {
      col2.appendChild(rightImg.cloneNode(true));
    }

    cells.push([col1, col2]);
  } else {
    // Fallback: try to split content into two columns
    const images = Array.from(element.querySelectorAll('img'));
    const textEls = Array.from(element.querySelectorAll('h3, h4, p'));

    const col1 = document.createDocumentFragment();
    const col2 = document.createDocumentFragment();

    if (images.length > 0) {
      col1.appendChild(images[0].cloneNode(true));
    }
    textEls.forEach((el) => {
      if (el.textContent.trim()) {
        col2.appendChild(el.cloneNode(true));
      }
    });

    cells.push([col1, col2]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
