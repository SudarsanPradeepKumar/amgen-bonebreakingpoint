/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: bonebreakingpoint sections.
 * Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Runs in afterTransform only. Uses payload.template.sections.
 * Selectors from captured DOM of https://www.bonebreakingpoint.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const { document } = payload;
  const sections = payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  // Process sections in reverse order to avoid DOM position shifts
  const reversedSections = [...sections].reverse();

  for (const section of reversedSections) {
    // Find the first element matching the section selector
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }
    if (!sectionEl) continue;

    // Add section-metadata block if section has a style
    if (section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Insert section-metadata after the last content element of this section
      sectionEl.after(sectionMetadata);
    }

    // Add <hr> section break before section (except for the first section)
    const sectionIndex = sections.indexOf(section);
    if (sectionIndex > 0) {
      // Only add hr if there is content before this section element
      if (sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
