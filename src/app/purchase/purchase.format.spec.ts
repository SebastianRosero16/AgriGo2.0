import { formatOrderReference } from './purchase.format';

describe('formatOrderReference', () => {
  it('formats UUIDs as a short AgriGo order reference', () => {
    expect(formatOrderReference('01659287-81dd-4cb0-809b-89e375348710')).toBe(
      'AG-01659287-81DD4CB0',
    );
  });

  it('keeps identifiers that are not UUIDs unchanged', () => {
    expect(formatOrderReference('ORD-2026-001')).toBe('ORD-2026-001');
  });
});
