/**
 * Styled Text block – extends default text with variants (Default, Gold, etc.).
 * Reads variant from model and applies class styled-text-{variant}.
 */
function getVariant(block) {
  const el = block.querySelector('[data-aue-prop="variant"]');
  const raw = (el?.textContent?.trim() ?? block.dataset.variant ?? block.getAttribute('data-variant') ?? '').toLowerCase();
  return raw && raw !== 'default' ? raw : '';
}

export default function decorate(block) {
  const variant = getVariant(block);
  if (variant) block.classList.add(`styled-text-${variant}`);
}
