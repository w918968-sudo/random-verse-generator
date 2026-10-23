// Curated Bible reading plans. Each plan is an ordered list of verse IDs drawn
// from the existing curated library (no new source text). The order is
// intentional — the days follow a short narrative arc, so a plan reads as a
// journey rather than a random assortment. Reusing a verse across different
// plans is fine; within one plan the days stay unique.
export const READING_PLANS = [
  {
    slug: 'hope',
    title: '30 Days of Hope',
    description:
      'A month of Bible verses to anchor your hope in God’s promises — from learning to wait, to a future made new.',
    days: [
      // Days 1–5 · Foundation — God's character and promises
      'jer-029-011-013', // Jeremiah 29:11–13
      'lam-003-022-024', // Lamentations 3:22–24
      'psa-033-018-022', // Psalm 33:18–22
      'heb-006-018-020', // Hebrews 6:18–20
      'tit-002-011-013', // Titus 2:11–13
      // Days 6–10 · Waiting patiently
      'rom-008-023-025', // Romans 8:23–25
      'psa-130-005-008', // Psalm 130:5–8
      'mic-007-007-009', // Micah 7:7–9
      'psa-040-001-003', // Psalm 40:1–3
      'psa-062-001-003', // Psalm 62:1–3
      // Days 11–15 · Hope in hardship
      'isa-040-028-031', // Isaiah 40:28–31
      'rom-008-026-028', // Romans 8:26–28
      '2co-004-016-018', // 2 Corinthians 4:16–18
      'psa-042-005-007', // Psalm 42:5–7
      'lam-003-025-027', // Lamentations 3:25–27
      // Days 16–20 · Hope renewed
      'rom-015-004-006', // Romans 15:4–6
      'rom-008-031-033', // Romans 8:31–33
      'heb-010-023-025', // Hebrews 10:23–25
      'php-001-006-008', // Philippians 1:6–8
      '1pe-001-003-005', // 1 Peter 1:3–5
      // Days 21–25 · A future made new
      '2co-005-017-019', // 2 Corinthians 5:17–19
      'ezk-036-026-028', // Ezekiel 36:26–28
      'rev-021-001-004', // Revelation 21:1–4
      'rev-021-005-007', // Revelation 21:5–7
      'isa-065-017-019', // Isaiah 65:17–19
      // Days 26–30 · Living in hope
      'tit-003-004-007', // Titus 3:4–7
      '1th-005-008-010', // 1 Thessalonians 5:8–10
      'psa-062-005-008', // Psalm 62:5–8
      'heb-010-035-037', // Hebrews 10:35–37
      '1pe-001-013-015', // 1 Peter 1:13–15
    ],
  },
  {
    slug: 'peace',
    title: '7 Days of Peace',
    description:
      'A week of verses to calm an anxious heart, let go of worry, and rest in God’s peace.',
    days: [
      'php-004-004-007', // Philippians 4:4–7
      'mat-011-028-030', // Matthew 11:28–30
      'jhn-014-025-027', // John 14:25–27
      'isa-026-003-005', // Isaiah 26:3–5
      'psa-046-008-011', // Psalm 46:8–11
      'mat-006-031-034', // Matthew 6:31–34
      'rom-005-001-005', // Romans 5:1–5
    ],
  },
  {
    slug: 'strength',
    title: '14 Days of Strength & Courage',
    description:
      'Two weeks of verses to face your fears and hard days with God’s strength, not your own.',
    days: [
      'isa-041-010-013', // Isaiah 41:10–13
      'php-004-011-013', // Philippians 4:11–13
      'jos-001-007-009', // Joshua 1:7–9
      'deu-031-006-008', // Deuteronomy 31:6–8
      'psa-046-001-003', // Psalm 46:1–3
      'psa-027-001-003', // Psalm 27:1–3
      'psa-121-001-004', // Psalm 121:1–4
      'psa-018-001-003', // Psalm 18:1–3
      '2ti-001-007-009', // 2 Timothy 1:7–9
      'eph-006-010-013', // Ephesians 6:10–13
      '2co-012-007-010', // 2 Corinthians 12:7–10
      'hab-003-017-019', // Habakkuk 3:17–19
      'neh-008-010-012', // Nehemiah 8:10–12
      'gal-006-009-011', // Galatians 6:9–11
    ],
  },
  {
    slug: 'gratitude',
    title: '7 Days of Gratitude',
    description:
      'A week of thanksgiving to turn your heart toward God’s goodness and steady your spirit.',
    days: [
      'psa-103-001-005', // Psalm 103:1–5
      'psa-100-001-005', // Psalm 100:1–5
      '1th-005-016-018', // 1 Thessalonians 5:16–18
      'psa-107-001-003', // Psalm 107:1–3
      'col-003-015-017', // Colossians 3:15–17
      'eph-005-018-020', // Ephesians 5:18–20
      'col-004-002-004', // Colossians 4:2–4
    ],
  },
  {
    slug: 'comfort',
    title: '7 Days of Comfort',
    description:
      'A week of verses of comfort for grief and hard times, when you need to be reminded God is near.',
    days: [
      '2co-001-003-005', // 2 Corinthians 1:3–5
      'psa-034-017-019', // Psalm 34:17–19
      'isa-040-001-003', // Isaiah 40:1–3
      'psa-091-001-004', // Psalm 91:1–4
      'jhn-014-001-003', // John 14:1–3
      'rom-008-018-020', // Romans 8:18–20
      'rev-021-001-004', // Revelation 21:1–4
    ],
  },
  {
    slug: 'new-beginnings',
    title: '14 Days of New Beginnings',
    description:
      'Two weeks of verses for fresh starts and second chances, when God makes all things new.',
    days: [
      '2co-005-017-019', // 2 Corinthians 5:17–19
      'ezk-036-026-028', // Ezekiel 36:26–28
      'isa-043-018-021', // Isaiah 43:18–21
      'eph-002-008-010', // Ephesians 2:8–10
      'rom-006-003-005', // Romans 6:3–5
      'eph-004-022-024', // Ephesians 4:22–24
      'col-003-009-011', // Colossians 3:9–11
      'isa-042-008-010', // Isaiah 42:8–10
      'jol-002-025-027', // Joel 2:25–27
      'rev-021-005-007', // Revelation 21:5–7
      'isa-060-001-003', // Isaiah 60:1–3
      'lam-003-022-024', // Lamentations 3:22–24
      'eph-002-004-006', // Ephesians 2:4–6
      'rom-012-001-003', // Romans 12:1–3
    ],
  },
  {
    slug: 'healing',
    title: '7 Days of Healing',
    description:
      'A week of verses for the healing of body, mind, and soul — God’s comfort for what is broken.',
    days: [
      'jer-017-014-016', // Jeremiah 17:14–16
      'psa-147-001-003', // Psalm 147:1–3
      'isa-053-004-006', // Isaiah 53:4–6
      'jas-005-014-016', // James 5:14–16
      'psa-103-001-005', // Psalm 103:1–5
      'isa-061-001-003', // Isaiah 61:1–3
      'mal-004-002-004', // Malachi 4:2–4
    ],
  },
  {
    slug: 'forgiveness',
    title: '7 Days of Forgiveness',
    description:
      'A week of verses on God’s mercy — receiving His forgiveness and learning to forgive others.',
    days: [
      '1jn-001-008-010', // 1 John 1:8–10
      'psa-103-008-011', // Psalm 103:8–11
      'isa-001-018-020', // Isaiah 1:18–20
      'mic-007-018-020', // Micah 7:18–20
      'eph-004-030-032', // Ephesians 4:30–32
      'mat-006-014-016', // Matthew 6:14–16
      'col-003-012-014', // Colossians 3:12–14
    ],
  },
];
