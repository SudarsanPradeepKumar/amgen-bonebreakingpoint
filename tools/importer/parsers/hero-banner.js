/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.bonebreakingpoint.com/
 * Instances: .component.plain-html.banner-text, #doing-all .Osteoporosis-promo
 *
 * Hero block: 1 column, 2 rows (image, text content).
 * xwalk fields: image (imageAlt collapsed), text
 */
export default function parse(element, { document }) {
  // Extract background image - look for img elements within the element or nearby hero-div
  const bgImage = element.querySelector('img')
    || (element.previousElementSibling && element.previousElementSibling.querySelector('img'))
    || (element.parentElement && element.parentElement.querySelector('.hero-div img, .field-promoicon img'));

  // Extract text content: headings, paragraphs, links
  const heading = element.querySelector('h3, h4, h2, h1');
  const paragraphs = Array.from(element.querySelectorAll('p'));
  const ctaLink = element.querySelector('a.external-link, a[href], .explore-medic a, .medic-option a');

  // Build cells matching hero block library structure:
  // Row 1: image (optional)
  // Row 2: text content (heading + paragraphs + CTA)
  const cells = [];

  // Row 1: Background image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage.cloneNode(true));
    cells.push([imgFrag]);
  } else {
    // Empty image row still required by block structure
    cells.push(['']);
  }

  // Row 2: Text content with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading.cloneNode(true));
  paragraphs.forEach((p) => {
    // Skip if paragraph is inside a link container we already handle
    if (!p.closest('.explore-medic') && !p.closest('.medic-option')) {
      textFrag.appendChild(p.cloneNode(true));
    }
  });
  if (ctaLink) {
    const p = document.createElement('p');
    p.appendChild(ctaLink.cloneNode(true));
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
