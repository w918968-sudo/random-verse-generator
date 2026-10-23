// Curated, ranked list of the 100 most well-known passages in the library.
// Each entry is the `id` of a passage in public/data/verses.json (WEBP and KJV
// share ids). The order here is the ranking shown on /top-100/.
//
// This is a presentation-layer ranking only — the verse text itself still comes
// from the built data files, so it stays verbatim and translation-aware.

export const TOP_100 = [
  'jhn-003-016-018', // John 3:16–18
  'psa-023-001-004', // Psalm 23:1–4
  'php-004-011-013', // Philippians 4:11–13
  'jer-029-011-013', // Jeremiah 29:11–13
  'pro-003-005-008', // Proverbs 3:5–8
  'rom-008-026-028', // Romans 8:26–28
  'isa-041-010-013', // Isaiah 41:10–13
  'php-004-004-007', // Philippians 4:4–7
  '1co-013-004-007', // 1 Corinthians 13:4–7
  'jos-001-007-009', // Joshua 1:7–9
  'mat-006-031-034', // Matthew 6:31–34
  'rom-012-001-003', // Romans 12:1–3
  'isa-040-028-031', // Isaiah 40:28–31
  'eph-002-008-010', // Ephesians 2:8–10
  'psa-046-008-011', // Psalm 46:8–11
  '2ti-001-007-009', // 2 Timothy 1:7–9
  'mat-011-028-030', // Matthew 11:28–30
  'gal-005-022-024', // Galatians 5:22–24
  'psa-121-001-004', // Psalm 121:1–4
  'rom-008-035-039', // Romans 8:35–39
  'heb-011-001-003', // Hebrews 11:1–3
  '1pe-005-006-008', // 1 Peter 5:6–8
  'mat-006-025-027', // Matthew 6:25–27
  'jas-001-002-004', // James 1:2–4
  'psa-091-001-004', // Psalm 91:1–4
  'rom-010-009-013', // Romans 10:9–13
  'pro-018-008-010', // Proverbs 18:8–10
  'isa-053-004-006', // Isaiah 53:4–6
  'psa-034-004-006', // Psalm 34:4–6
  '2co-005-017-019', // 2 Corinthians 5:17–19
  '1jn-004-007-011', // 1 John 4:7–11
  'mat-005-003-006', // Matthew 5:3–6
  'num-006-024-026', // Numbers 6:24–26
  'psa-118-024-026', // Psalm 118:24–26
  'lam-003-022-024', // Lamentations 3:22–24
  'isa-026-003-005', // Isaiah 26:3–5
  'jhn-013-034-036', // John 13:34–36
  'eph-006-010-013', // Ephesians 6:10–13
  'psa-139-013-016', // Psalm 139:13–16
  '1co-010-031-033', // 1 Corinthians 10:31–33
  'col-003-023-025', // Colossians 3:23–25
  'gal-002-019-021', // Galatians 2:19–21
  'psa-027-001-003', // Psalm 27:1–3
  'deu-031-006-008', // Deuteronomy 31:6–8
  'rom-005-006-008', // Romans 5:6–8
  'heb-013-005-007', // Hebrews 13:5–7
  'jas-005-014-016', // James 5:14–16
  'isa-043-001-003', // Isaiah 43:1–3
  'zep-003-015-017', // Zephaniah 3:15–17
  '1jn-001-008-010', // 1 John 1:8–10
  'rom-008-031-033', // Romans 8:31–33
  'gal-006-009-011', // Galatians 6:9–11
  'psa-046-001-003', // Psalm 46:1–3
  '1pe-002-023-025', // 1 Peter 2:23–25
  '2co-012-007-010', // 2 Corinthians 12:7–10
  'heb-012-001-003', // Hebrews 12:1–3
  'psa-051-009-011', // Psalm 51:9–11
  'psa-090-012-014', // Psalm 90:12–14
  'rom-008-018-020', // Romans 8:18–20
  '1th-005-016-018', // 1 Thessalonians 5:16–18
  'psa-100-001-005', // Psalm 100:1–5
  'pro-022-006-008', // Proverbs 22:6–8
  'eph-004-030-032', // Ephesians 4:30–32
  'col-003-012-014', // Colossians 3:12–14
  'psa-103-001-005', // Psalm 103:1–5
  'jhn-016-031-033', // John 16:31–33
  'psa-118-006-008', // Psalm 118:6–8
  'heb-011-006-008', // Hebrews 11:6–8
  '1jn-003-001-003', // 1 John 3:1–3
  'mat-005-043-045', // Matthew 5:43–45
  'rom-012-011-013', // Romans 12:11–13
  'psa-034-017-019', // Psalm 34:17–19
  '2co-001-003-005', // 2 Corinthians 1:3–5
  'isa-040-001-003', // Isaiah 40:1–3
  'psa-103-008-011', // Psalm 103:8–11
  'jhn-014-001-003', // John 14:1–3
  'eph-003-014-017', // Ephesians 3:14–17
  '2co-009-006-008', // 2 Corinthians 9:6–8
  'psa-019-007-009', // Psalm 19:7–9
  'pro-016-003-005', // Proverbs 16:3–5
  'isa-055-010-012', // Isaiah 55:10–12
  'jer-031-012-014', // Jeremiah 31:12–14
  '1jn-004-016-019', // 1 John 4:16–19
  'rom-012-017-019', // Romans 12:17–19
  'mat-022-037-039', // Matthew 22:37–39
  'psa-056-003-005', // Psalm 56:3–5
  'isa-049-013-015', // Isaiah 49:13–15
  'php-001-006-008', // Philippians 1:6–8
  '1co-015-056-058', // 1 Corinthians 15:56–58
  'heb-010-023-025', // Hebrews 10:23–25
  'psa-037-007-009', // Psalm 37:7–9
  'mat-010-028-031', // Matthew 10:28–31
  'rom-008-015-017', // Romans 8:15–17
  'eph-002-004-006', // Ephesians 2:4–6
  'ezk-036-026-028', // Ezekiel 36:26–28
  'isa-043-018-021', // Isaiah 43:18–21
  '2co-005-014-016', // 2 Corinthians 5:14–16
  'psa-119-097-100', // Psalm 119:97–100
  'pro-004-005-009', // Proverbs 4:5–9
  'eph-005-018-020', // Ephesians 5:18–20
];
