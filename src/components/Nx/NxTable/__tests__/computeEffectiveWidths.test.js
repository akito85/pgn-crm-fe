import { computeEffectiveWidths } from '../hooks/useColumnLayout';

const noCol     = { key: 'no',     width: 60  };
const actionCol = { key: 'action', width: 90  };
const colA      = { key: 'colA',   width: 200 };
const colB      = { key: 'colB',   width: 100 };

describe('computeEffectiveWidths', () => {
  it('returns null when containerWidth is 0', () => {
    expect(computeEffectiveWidths([noCol, colA], {}, 0, undefined)).toBeNull();
  });

  it('returns null when scrollX > containerWidth (horizontal scroll active — leave CSS behaviour untouched)', () => {
    expect(computeEffectiveWidths([noCol, colA], {}, 800, 900)).toBeNull();
  });

  it('returns null when total defined widths already fill the container', () => {
    // noCol(60) + colA(200) = 260, but NO gets pinned to 90 → total = 90+200 = 290 > 260
    // guard: totalDefined(290) >= containerWidth(260) → null
    expect(computeEffectiveWidths([noCol, colA], {}, 260, undefined)).toBeNull();
  });

  it('returns null when total defined widths exceed the container', () => {
    expect(computeEffectiveWidths([noCol, colA], {}, 200, undefined)).toBeNull();
  });

  it('pins NO column at NO_COL_WIDTH (90) regardless of col.width', () => {
    const result = computeEffectiveWidths([noCol, actionCol, colA], {}, 1000, undefined);
    expect(result).not.toBeNull();
    expect(result['no']).toBe(90);
  });

  it('pins ACTION column at ACTION_COL_MIN_WIDTH (111) when not user-resized', () => {
    const result = computeEffectiveWidths([noCol, actionCol, colA], {}, 1000, undefined);
    expect(result).not.toBeNull();
    expect(result['action']).toBe(111);
  });

  it('pins ACTION column at user-resized width when wider than 90', () => {
    const result = computeEffectiveWidths(
      [noCol, actionCol, colA],
      { action: 150 },
      1000,
      undefined,
    );
    expect(result).not.toBeNull();
    expect(result['action']).toBe(150);
  });

  it('distributes remaining space proportionally to unresized flex cols', () => {
    // NO=90, ACTION=111 → pinned=201
    // colA base=200, colB base=100 → totalBase=300
    // available = 1000 - 201 = 799
    // colA → floor(200 * 799/300) = 532
    // colB → floor(100 * 799/300) = 266
    const result = computeEffectiveWidths(
      [noCol, actionCol, colA, colB],
      {},
      1000,
      undefined,
    );
    expect(result).not.toBeNull();
    expect(result['colA']).toBe(Math.floor(200 * (799 / 300)));
    expect(result['colB']).toBe(Math.floor(100 * (799 / 300)));
  });

  it('locks user-resized flex cols and distributes only to unresized', () => {
    // NO=90, ACTION=111, lockedColA=300 → available = 1000 - 90 - 111 - 300 = 499
    // Only colB is unresized (base=100), gets all 499px
    const result = computeEffectiveWidths(
      [noCol, actionCol, colA, colB],
      { colA: 300 },
      1000,
      undefined,
    );
    expect(result).not.toBeNull();
    expect(result['colA']).toBe(300);
    expect(result['colB']).toBe(499);
  });

  it('returns null when user resizes consume all available space', () => {
    // NO=90, ACTION=90, lockedColA=900 → available = 1000 - 90 - 90 - 900 = -80 <= 0
    const result = computeEffectiveWidths(
      [noCol, actionCol, colA],
      { colA: 900 },
      1000,
      undefined,
    );
    expect(result).toBeNull();
  });

  it('works when NO column is absent', () => {
    // No NO col → only ACTION pinned at 111
    // colA(200) + colB(100) = 300 flex base, available = 1000 - 111 = 889
    const result = computeEffectiveWidths(
      [actionCol, colA, colB],
      {},
      1000,
      undefined,
    );
    expect(result).not.toBeNull();
    expect(result['no']).toBeUndefined();
    expect(result['action']).toBe(111);
    expect(result['colA']).toBe(Math.floor(200 * (889 / 300)));
  });

  it('works when ACTION column is absent', () => {
    // No ACTION col → only NO pinned at 90
    // colA(200) + colB(100) = 300 flex base, available = 1000 - 90 = 910
    const result = computeEffectiveWidths(
      [noCol, colA, colB],
      {},
      1000,
      undefined,
    );
    expect(result).not.toBeNull();
    expect(result['action']).toBeUndefined();
    expect(result['no']).toBe(90);
    expect(result['colA']).toBe(Math.floor(200 * (910 / 300)));
  });
});
