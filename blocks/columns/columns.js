function parseAlignClass(str) {
  const m = (str || '').match(/columns-align-((?:left|right)(?:-(?:left|right))*)/i);
  if (m && m[1]) {
    return m[1].split('-').map((s) => (s.toLowerCase() === 'right' ? 'right' : 'left'));
  }
  return null;
}

/** Get full classes string from block (any source) so we can apply to block and parse. */
function getBlockClassesString(block) {
  const dataClasses = (block.getAttribute('data-column-classes') || '').trim();
  if (dataClasses) return dataClasses;
  const classesEl = block.querySelector('[data-aue-prop="classes"]');
  const fromEl = classesEl ? (classesEl.textContent || '').trim() : '';
  if (fromEl) return fromEl;
  const fromBlockClass = Array.from(block.classList).find(
    (c) => c.startsWith('columns-align-') || c.startsWith('columns-valign-'),
  );
  if (fromBlockClass) {
    const all = Array.from(block.classList)
      .filter((c) => c.startsWith('columns-align-') || c.startsWith('columns-valign-'))
      .join(' ');
    if (all) return all;
  }
  const firstRow = block.firstElementChild;
  if (firstRow) {
    for (let i = 0; i < firstRow.children.length; i += 1) {
      const cellText = (firstRow.children[i].textContent || '').trim();
      if (cellText && (cellText.includes('columns-align-') || cellText.includes('columns-valign-')))
        return cellText;
    }
  }
  const blockText = block.textContent || '';
  const alignMatch = blockText.match(/columns-align-(?:left|right)(?:-(?:left|right))+/i);
  const valignMatch = blockText.match(/columns-valign-(?:top|center|bottom)/i);
  const parts = [];
  if (alignMatch) parts.push(alignMatch[0]);
  if (valignMatch) parts.push(valignMatch[0]);
  if (parts.length) return parts.join(' ');
  return '';
}

/**
 * Read column alignments (horizontal) from block.
 */
function getBlockColumnAlignments(block) {
  const classesRaw = getBlockClassesString(block);
  const alignFromClasses = classesRaw.split(/\s+/).find((c) => c.startsWith('columns-align-'));
  if (alignFromClasses) {
    const out = parseAlignClass(alignFromClasses);
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
  const classesRaw = getBlockClassesString(block);
  const valign = classesRaw.split(/\s+/).find((c) => c.startsWith('columns-valign-'));
  if (valign && /columns-valign-(top|center|bottom)/i.test(valign)) return valign;
  const blockText = block.textContent || '';
  const m = blockText.match(/columns-valign-(top|center|bottom)/i);
  if (m) return `columns-valign-${m[1].toLowerCase()}`;
  return 'columns-valign-center';
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-${cols.length}-cols`);

  const classesString = getBlockClassesString(block);
  if (classesString) {
    classesString.split(/\s+/).forEach((c) => {
      if (c && (c.startsWith('columns-align-') || c.startsWith('columns-valign-'))) {
        block.classList.add(c);
      }
    });
  }

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
