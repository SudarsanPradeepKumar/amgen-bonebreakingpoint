/**
 * Text block – applies variant class from model (variant-1: gold text, variant-2: border right, variant-3: border left).
 */
function getVariant(block) {
  const el = block.querySelector('[data-aue-prop="variant"]');
  const raw = (el?.textContent?.trim() ?? block.dataset.variant ?? block.getAttribute('data-variant') ?? '').toLowerCase();
  if (['variant-1', 'variant-2', 'variant-3'].includes(raw)) return raw;
  return '';
}

export default function decorate(block) {
  const variant = getVariant(block);
  if (variant) block.classList.add(`text-${variant}`);
}
