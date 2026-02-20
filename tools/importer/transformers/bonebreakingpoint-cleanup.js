/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: bonebreakingpoint cleanup.
 * Removes non-authorable content and site-wide widgets.
 * Selectors from captured DOM of https://www.bonebreakingpoint.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent dialog (Cookiebot) - blocks parsing
    WebImporter.DOMUtils.remove(element, [
      '#CybotCookiebotDialog',
      '#CybotCookiebotDialogBodyUnderlay',
      '[id*="Cookiebot"]',
    ]);

    // Site-leaving modal overlay
    WebImporter.DOMUtils.remove(element, ['#Modal_Site_Leave']);
  }

  if (hookName === H.after) {
    // Non-authorable: header, footer, back-to-top
    WebImporter.DOMUtils.remove(element, [
      'header.header-nav',
      'footer#footer',
      '.quantum-back-to-top',
    ]);

    // Iframes, noscript, link elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'noscript', 'link']);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-gtm');
    });
  }
}
