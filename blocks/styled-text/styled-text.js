/**
 * Styled Text block – extends default text with variants (Default, Gold, etc.).
 * Reads variant from model, applies class styled-text-{variant}, and removes
 * the variant metadata element so it is not displayed on the page.
 */
function getVariant(block) {
  const el = block.querySelector('[data-aue-prop="variant"]');
  const raw = (el?.textContent?.trim() ?? block.dataset.variant ?? block.getAttribute('data-variant') ?? '').toLowerCase();
  return raw && raw !== 'default' ? raw : '';
}

export default function decorate(block) {
  const variantEl = block.querySelector('[data-aue-prop="variant"]');
  const variant = getVariant(block);
  if (variant) block.classList.add(`styled-text-${variant}`);
  /* Remove variant metadata row so "gold" (or other value) is not shown on the page */
  if (variantEl) {
    let row = variantEl;
    while (row.parentElement && row.parentElement !== block) row = row.parentElement;
    if (row.parentElement === block) row.remove();
  }
}
