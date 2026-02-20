/**
 * Styled Text block – color and border as separate fields.
 * Applies styled-text-{colorVariant} and styled-text-{borderVariant}, removes metadata rows.
 */
function getField(block, prop) {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  const raw = (el?.textContent?.trim() ?? '').toLowerCase();
  return raw && raw !== 'default' ? raw : '';
}

function removePropRow(block, prop) {
  const el = block.querySelector(`[data-aue-prop="${prop}"]`);
  if (!el) return;
  let row = el;
  while (row.parentElement && row.parentElement !== block) row = row.parentElement;
  if (row.parentElement === block) row.remove();
}

export default function decorate(block) {
  const colorVariant = getField(block, 'colorVariant');
  const borderVariant = getField(block, 'borderVariant');
  if (colorVariant) block.classList.add(`styled-text-${colorVariant}`);
  if (borderVariant) block.classList.add(`styled-text-${borderVariant}`);
  removePropRow(block, 'colorVariant');
  removePropRow(block, 'borderVariant');
}
