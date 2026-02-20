/**
 * Styled Text block – extends default text with variant (Default, Gold, etc.).
 * Reads variant from model and applies corresponding class.
 */
function getVariant(block) {
  const el = block.querySelector('[data-aue-prop="variant"]');
  const raw = (el?.textContent?.trim() ?? block.dataset.variant ?? block.getAttribute('data-variant') ?? '').toLowerCase();
  if (['gold'].includes(raw)) return raw;
  return '';
}

export default function decorate(block) {
  const variant = getVariant(block);
  if (variant) block.classList.add(`styled-text-${variant}`);
}
