/**
 * Read column alignments from block. Tries, in order:
 * 1) data-aue-prop="columnAlignments" (UE property)
 * 2) data-column-alignments attribute on block
 * 3) block class "columns-align-{left|right}-{left|right}-..." (e.g. columns-align-left-right)
 * 4) first row third cell (table config)
 */
function getBlockColumnAlignments(block) {
  const classesEl = block.querySelector('[data-aue-prop="classes"]');
  const classesRaw = classesEl ? (classesEl.textContent || '').trim() : '';
  const alignFromClasses = classesRaw.split(/\s+/).find((c) => c.startsWith('columns-align-'));
  if (alignFromClasses) {
    return alignFromClasses
      .replace('columns-align-', '')
      .split('-')
      .map((s) => (s.toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const el = block.querySelector('[data-aue-prop="columnAlignments"]');
  const raw = el ? (el.textContent || '').trim() : '';
  if (raw) {
    return raw.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const attr = (block.getAttribute('data-column-alignments') || '').trim();
  if (attr) {
    return attr.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const alignClass = Array.from(block.classList).find((c) => c.startsWith('columns-align-'));
  if (alignClass) {
    return alignClass
      .replace('columns-align-', '')
      .split('-')
      .map((s) => (s.toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const firstRow = block.firstElementChild;
  const thirdCell = firstRow && firstRow.children.length >= 3 ? firstRow.children[2].textContent : '';
  const value = (thirdCell || 'left, left').trim();
  return value.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'));
}

function getColumnAlignment(col, index, blockAlignments) {
  if (blockAlignments[index] !== undefined) return blockAlignments[index];
  const el = col.querySelector('[data-aue-prop="alignment"]');
  if (el) {
    const v = (el.textContent || '').trim().toLowerCase();
    if (v === 'left' || v === 'right') return v;
  }
  const first = col.firstElementChild;
  if (first && (first.textContent || '').trim().toLowerCase() === 'right') return 'right';
  return 'left';
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-${cols.length}-cols`);

  const blockAlignments = getBlockColumnAlignments(block);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, colIndex) => {
      const alignment = getColumnAlignment(col, colIndex, blockAlignments);
      col.classList.add(`column-align-${alignment}`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
