function parseAlignClass(str) {
  const m = (str || '').match(/columns-align-((?:left|right)(?:-(?:left|right))*)/i);
  if (m && m[1]) {
    return m[1].split('-').map((s) => (s.toLowerCase() === 'right' ? 'right' : 'left'));
  }
  return null;
}

/**
 * Read column alignments from block. Tries, in order:
 * 1) data-aue-prop="classes" (UE "Content alignment" field)
 * 2) block class columns-align-*
 * 3) data-aue-prop="columnAlignments"
 * 4) data-column-alignments attribute
 * 5) first row third cell
 * 6) search block text for columns-align-* (preview fallback)
 */
function getBlockColumnAlignments(block) {
  const classesEl = block.querySelector('[data-aue-prop="classes"]');
  const classesRaw = classesEl ? (classesEl.textContent || '').trim() : '';
  const alignFromClasses = classesRaw.split(/\s+/).find((c) => c.startsWith('columns-align-'));
  if (alignFromClasses) {
    const out = parseAlignClass(alignFromClasses);
    if (out) return out;
  }
  const alignClass = Array.from(block.classList).find((c) => c.startsWith('columns-align-'));
  if (alignClass) {
    const out = parseAlignClass(alignClass);
    if (out) return out;
  }
  const columnAlignEl = block.querySelector('[data-aue-prop="columnAlignments"]');
  const raw = columnAlignEl ? (columnAlignEl.textContent || '').trim() : '';
  if (raw) {
    return raw.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const attr = (block.getAttribute('data-column-alignments') || '').trim();
  if (attr) {
    return attr.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'));
  }
  const firstRow = block.firstElementChild;
  const thirdCell = firstRow && firstRow.children.length >= 3 ? firstRow.children[2].textContent : '';
  const value = (thirdCell || '').trim();
  if (value) {
    const fromCell = value.includes(',')
      ? value.split(',').map((s) => (s.trim().toLowerCase() === 'right' ? 'right' : 'left'))
      : parseAlignClass(value);
    if (fromCell) return fromCell;
  }
  const blockText = block.textContent || '';
  const parsed = parseAlignClass(blockText);
  if (parsed && parsed.length >= 1) return parsed;
  return ['left', 'left'];
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

function getBlockVerticalAlignment(block) {
  const classesEl = block.querySelector('[data-aue-prop="classes"]');
  const classesRaw = classesEl ? (classesEl.textContent || '').trim() : '';
  const valign = classesRaw.split(/\s+/).find((c) => c.startsWith('columns-valign-'));
  if (valign && /columns-valign-(top|center|bottom)/i.test(valign)) return valign;
  const fromBlock = Array.from(block.classList).find((c) => c.startsWith('columns-valign-'));
  if (fromBlock && /columns-valign-(top|center|bottom)/i.test(fromBlock)) return fromBlock;
  const blockText = block.textContent || '';
  const m = blockText.match(/columns-valign-(top|center|bottom)/i);
  if (m) return `columns-valign-${m[1].toLowerCase()}`;
  return 'columns-valign-center';
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-${cols.length}-cols`);

  const blockAlignments = getBlockColumnAlignments(block);
  const valignClass = getBlockVerticalAlignment(block);
  block.classList.add(valignClass);

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
