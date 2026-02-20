/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta. Base: hero.
 * Source: https://www.bonebreakingpoint.com/
 * Instances: #treatment-can-help, #discover-treatment
 *
 * Hero block: 1 row, 3 columns (image, imageAlt, text) matching xwalk model.
 * These are dark-purple CTA sections with side image, headings, text, and CTA button.
 * xwalk fields: image, imageAlt, text
 */
export default function parse(element, { document }) {
  // Extract image from quantum-cta image wrap
  const image = element.querySelector('.quantum-cta__image, img');

  // Extract text content from quantum-cta text area
  const textContainer = element.querySelector('.quantum-cta__text');

  // Column 1: Image with field hint
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (image) {
    const p = document.createElement('p');
    p.appendChild(image.cloneNode(true));
    imgFrag.appendChild(p);
  }

  // Column 2: Image alt text with field hint
  const altFrag = document.createDocumentFragment();
  altFrag.appendChild(document.createComment(' field:imageAlt '));
  if (image && image.alt) {
    const p = document.createElement('p');
    p.textContent = image.alt;
    altFrag.appendChild(p);
  }

  // Column 3: Text content with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (textContainer) {
    // Extract headings (skip empty h2.quantum-cta__title)
    const headings = textContainer.querySelectorAll('h3, h4');
    headings.forEach((h) => {
      if (h.textContent.trim()) {
        textFrag.appendChild(h.cloneNode(true));
      }
    });

    // Extract paragraphs and list content
    // Use .section-padding container if present (contains checklist items),
    // otherwise fall back to direct p children to avoid duplication
    const sectionPadding = textContainer.querySelector('.section-padding');
    if (sectionPadding) {
      textFrag.appendChild(sectionPadding.cloneNode(true));
      // Also get paragraphs outside .section-padding (e.g., "If you answered yes...")
      const siblingPs = textContainer.querySelectorAll(':scope > p, :scope > .if-you-answer');
      siblingPs.forEach((p) => {
        if (p.textContent.trim()) {
          textFrag.appendChild(p.cloneNode(true));
        }
      });
    } else {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          textFrag.appendChild(p.cloneNode(true));
        }
      });
    }

    // Extract CTA button
    const ctaButton = textContainer.querySelector('.quantum-button, button.quantum-cta__action');
    if (ctaButton) {
      const buttonText = ctaButton.querySelector('.quantum-button__text');
      // Get the parent link if exists
      const parentLink = element.querySelector('a.quantum-cta__inner');
      if (parentLink && buttonText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = parentLink.href;
        a.textContent = buttonText.textContent.trim();
        p.appendChild(a);
        textFrag.appendChild(p);
      } else if (buttonText) {
        const p = document.createElement('p');
        p.textContent = buttonText.textContent.trim();
        textFrag.appendChild(p);
      }
    }
  }

  // Single row with 3 columns: image | imageAlt | text
  const cells = [[imgFrag, altFrag, textFrag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
