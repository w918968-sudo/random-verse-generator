// Topic-specific FAQ content for the landing pages. Keyed by the topic's route
// slug (lowercase theme id for themes, occasion slug for occasions), which is
// exactly `item.slug` in src/pages/[topic].astro. Each entry feeds both the
// visible "Frequently asked questions" section and the FAQPage JSON-LD schema.

export const TOPIC_FAQ = {
  // ——— Themes ———
  hope: [
    {
      q: 'What does the Bible say about hope?',
      a: 'The Bible presents hope as confident trust in God’s promises rather than wishful thinking. Passages like Jeremiah 29:11–13 and Romans 15:4–6 describe a hope rooted in God’s faithfulness and future restoration.',
    },
    {
      q: 'What is a good Bible verse for hope?',
      a: 'Jeremiah 29:11–13 is among the most loved, with its promise of “a hope and a future.” Isaiah 40:28–31 and Lamentations 3:22–24 are also frequently chosen for renewing hope.',
    },
    {
      q: 'How do I find hope in hard times according to the Bible?',
      a: 'Scripture points to God’s unchanging character and past faithfulness as the ground for hope. Reading a range of hope passages and praying them back to God is a common practice when hope feels thin.',
    },
  ],
  peace: [
    {
      q: 'What does the Bible say about peace?',
      a: 'Biblical peace means more than the absence of conflict — it is wholeness and rest in God. Philippians 4:4–7 and John 14:25–27 describe a peace that surpasses understanding.',
    },
    {
      q: 'What is a good Bible verse for peace?',
      a: 'Philippians 4:6–7 is often chosen, promising that God’s peace will guard hearts and minds. Isaiah 26:3 and John 16:33 are also common go-to verses.',
    },
    {
      q: 'How can I experience God’s peace?',
      a: 'The Bible ties peace to prayer, thanksgiving, and trusting God with our worries. Bringing anxieties to God in prayer is the specific practice Philippians 4 recommends.',
    },
  ],
  love: [
    {
      q: 'What does the Bible say about love?',
      a: 'Love is central to the Bible — God’s love for us and our love for God and neighbor. 1 Corinthians 13:4–7 describes love’s character, while 1 John 4:7–11 roots our love in God’s love for us.',
    },
    {
      q: 'What is a good Bible verse about love?',
      a: '1 Corinthians 13:4–7 (“Love is patient, love is kind…”) is the most famous. John 3:16–18 and 1 John 4:7–11 are also widely quoted.',
    },
    {
      q: 'What does the Bible say about God’s love?',
      a: 'The Bible says God’s love is steadfast, sacrificial, and not earned. Romans 8:35–39 declares that nothing can separate us from the love of God in Christ.',
    },
  ],
  strength: [
    {
      q: 'What does the Bible say about strength?',
      a: 'The Bible locates true strength in God rather than ourselves. Isaiah 40:28–31 promises that those who wait on the Lord renew their strength.',
    },
    {
      q: 'What is a good Bible verse for strength?',
      a: 'Philippians 4:13 and Isaiah 41:10 are the most popular. Joshua 1:9 is another frequent choice for courage.',
    },
    {
      q: 'How do I find strength when I feel weak?',
      a: 'Scripture says God’s power is made perfect in weakness. Admitting weakness and relying on God is the biblical pattern for renewed strength.',
    },
  ],
  faith: [
    {
      q: 'What does the Bible say about faith?',
      a: 'Faith is trusting God and acting on that trust. Hebrews 11:1–3 defines faith as confidence in what we hope for and assurance about what we do not see.',
    },
    {
      q: 'What is a good Bible verse for faith?',
      a: 'Hebrews 11:1 is the classic definition. Romans 10:17 (“faith comes by hearing”) and 2 Corinthians 5:7 (“we walk by faith”) are also common.',
    },
    {
      q: 'How do I grow my faith?',
      a: 'The Bible connects growing faith with hearing God’s word and taking small steps of obedience. Hebrews 11 shows ordinary people whose faith grew as they trusted God one step at a time.',
    },
  ],
  comfort: [
    {
      q: 'What does the Bible say about comfort?',
      a: 'The Bible calls God “the God of all comfort” who comforts us in trouble (2 Corinthians 1:3–4). Comfort passages often point to God’s presence and care in suffering.',
    },
    {
      q: 'What is a good Bible verse for comfort?',
      a: 'Psalm 23 and Matthew 11:28–30 are the most comforting. 2 Corinthians 1:3–4 and Revelation 21:4 are also frequently shared with the hurting.',
    },
    {
      q: 'What Bible verses help when I’m sad or grieving?',
      a: 'Verses like Revelation 21:4 (God will wipe away every tear) and Matthew 5:4 (blessed are those who mourn) are commonly read for grief and sorrow.',
    },
  ],
  wisdom: [
    {
      q: 'What does the Bible say about wisdom?',
      a: 'Wisdom begins with the fear of the Lord (Proverbs 9:10). The Bible describes wisdom as practical, God-honoring skill for living rather than mere knowledge.',
    },
    {
      q: 'What is a good Bible verse for wisdom?',
      a: 'Proverbs 3:5–6 and James 1:5 (which promises wisdom to those who ask) are the most referenced. Proverbs 9:10 is the foundational verse.',
    },
    {
      q: 'How do I get wisdom according to the Bible?',
      a: 'Scripture says to ask God for wisdom in faith (James 1:5) and to fear the Lord, study his word, and seek counsel. Proverbs repeatedly ties wisdom to humility and teachability.',
    },
  ],
  gratitude: [
    {
      q: 'What does the Bible say about gratitude?',
      a: 'Gratitude is a repeated command — “give thanks in all circumstances” (1 Thessalonians 5:18). Thankfulness is portrayed as the natural response to God’s goodness.',
    },
    {
      q: 'What is a good Bible verse for gratitude?',
      a: '1 Thessalonians 5:16–18 and Psalm 100 are the most quoted. Colossians 3:15–17 also ties thankfulness to the Christian life.',
    },
    {
      q: 'Why does the Bible emphasize thankfulness?',
      a: 'Thankfulness reorients the heart away from complaint toward God’s provision. The Bible connects gratitude with peace, contentment, and worship.',
    },
  ],

  // ——— Occasions ———
  anxiety: [
    {
      q: 'What does the Bible say about anxiety?',
      a: 'The Bible addresses anxiety directly, telling us not to be anxious but to bring our worries to God in prayer (Philippians 4:6–7; 1 Peter 5:7).',
    },
    {
      q: 'What is a good Bible verse for anxiety?',
      a: 'Philippians 4:6–7 is the most common. 1 Peter 5:7 (“cast all your anxiety on him”) and Matthew 6:25–34 are also frequently chosen.',
    },
    {
      q: 'How can Scripture help with worry?',
      a: 'Anxiety verses refocus the mind on God’s care and provision. Many people memorize a short passage and return to it when worry rises.',
    },
  ],
  fear: [
    {
      q: 'What does the Bible say about fear?',
      a: 'The Bible’s most repeated command is “do not be afraid,” grounded in God’s presence. Isaiah 41:10 promises God’s strength and help.',
    },
    {
      q: 'What is a good Bible verse for fear?',
      a: 'Isaiah 41:10 (“fear not, for I am with you”) and 2 Timothy 1:7 (“God has not given us a spirit of fear”) are the most popular.',
    },
    {
      q: 'How do I overcome fear biblically?',
      a: 'Scripture counters fear with God’s presence and faithfulness. Replacing fearful thoughts with God’s promises is the recurring biblical response.',
    },
  ],
  encouragement: [
    {
      q: 'What does the Bible say about encouragement?',
      a: 'The Bible calls believers to encourage one another and build each other up (1 Thessalonians 5:11). God himself is described as the source of encouragement.',
    },
    {
      q: 'What is a good Bible verse for encouragement?',
      a: 'Joshua 1:9 (“be strong and courageous”) and Romans 15:4–6 are common. Isaiah 41:10 is also frequently shared.',
    },
    {
      q: 'What verses encourage someone going through a hard time?',
      a: 'Verses like Jeremiah 29:11 and Romans 8:28 are often shared to remind people of God’s good purposes and faithful presence in hardship.',
    },
  ],
  healing: [
    {
      q: 'What does the Bible say about healing?',
      a: 'The Bible presents God as the healer of body and soul. Passages like Psalm 147:3 (“he heals the brokenhearted”) and James 5:14–15 speak to God’s healing care.',
    },
    {
      q: 'What is a good Bible verse for healing?',
      a: 'Psalm 147:3 and Jeremiah 17:14 are common. Exodus 15:26 (“I am the Lord who heals you”) is also frequently quoted.',
    },
    {
      q: 'How do I pray for healing according to the Bible?',
      a: 'Scripture shows believers praying for the sick with faith and laying on hands (James 5:14–16), while trusting the outcome to God’s will.',
    },
  ],
  forgiveness: [
    {
      q: 'What does the Bible say about forgiveness?',
      a: 'The Bible grounds our forgiveness of others in God’s forgiveness of us. Ephesians 4:32 and Colossians 3:13 urge forgiving as the Lord forgave you.',
    },
    {
      q: 'What is a good Bible verse about forgiveness?',
      a: 'Ephesians 4:32 is the most quoted. 1 John 1:9 (God forgives when we confess) and Matthew 6:14–15 are also central.',
    },
    {
      q: 'Why should I forgive according to the Bible?',
      a: 'Because God has forgiven us first, and unforgiveness harms the one who holds it. Scripture presents forgiveness as an act of grace, not excusing the wrong.',
    },
  ],
  patience: [
    {
      q: 'What does the Bible say about patience?',
      a: 'The Bible presents patience as a fruit of the Spirit and part of love (Galatians 5:22; 1 Corinthians 13:4). It is often linked with waiting on God.',
    },
    {
      q: 'What is a good Bible verse for patience?',
      a: 'Romans 12:12 (“patient in tribulation”) and James 1:2–4 (which ties trials to perseverance) are common. Galatians 5:22–23 lists patience as fruit of the Spirit.',
    },
    {
      q: 'How do I become more patient biblically?',
      a: 'Scripture ties patience to trusting God’s timing and character. Waiting on the Lord (Psalm 27:14) is the recurring practice.',
    },
  ],
  'new-beginnings': [
    {
      q: 'What does the Bible say about new beginnings?',
      a: 'The Bible is full of fresh starts, from new mercies every morning (Lamentations 3:22–23) to becoming a new creation in Christ (2 Corinthians 5:17).',
    },
    {
      q: 'What is a good Bible verse for a new beginning?',
      a: '2 Corinthians 5:17 (“the old has passed away… the new has come”) and Isaiah 43:18–19 (“I am doing a new thing”) are the most used.',
    },
    {
      q: 'What verses help with starting over?',
      a: 'Verses like Isaiah 43:18–19 and Philippians 3:13–14 encourage leaving the past behind and pressing toward what God has ahead.',
    },
  ],
  grief: [
    {
      q: 'What does the Bible say about grief?',
      a: 'The Bible does not minimize grief — Jesus wept (John 11:35). It offers comfort in God’s presence and the hope of resurrection.',
    },
    {
      q: 'What is a good Bible verse for grief?',
      a: 'Psalm 34:18 (“the Lord is near to the brokenhearted”) and Revelation 21:4 are the most shared with the grieving.',
    },
    {
      q: 'What verses comfort someone who has lost a loved one?',
      a: 'Matthew 5:4, Psalm 23, and 1 Thessalonians 4:13–14 are commonly read at funerals and shared with those mourning.',
    },
  ],
  money: [
    {
      q: 'What does the Bible say about money?',
      a: 'The Bible warns that the love of money is a root of evil (1 Timothy 6:10) and calls for contentment and generosity rather than greed.',
    },
    {
      q: 'What is a good Bible verse about money?',
      a: '1 Timothy 6:10, Hebrews 13:5 (“keep your life free from the love of money”), and Matthew 6:24 (serving God or money) are the most referenced.',
    },
    {
      q: 'What does the Bible say about contentment and wealth?',
      a: 'Scripture ties contentment to godliness (1 Timothy 6:6) and urges storing up treasure in heaven rather than on earth (Matthew 6:19–21).',
    },
  ],
  marriage: [
    {
      q: 'What does the Bible say about marriage?',
      a: 'The Bible describes marriage as a covenant in which two become one (Genesis 2:24), reflecting Christ’s love for the church (Ephesians 5:25).',
    },
    {
      q: 'What is a good Bible verse for a wedding?',
      a: '1 Corinthians 13:4–7 (the “love is patient” passage) is the most read at weddings. Genesis 2:24 and Ecclesiastes 4:9–12 are also common.',
    },
    {
      q: 'What does the Bible say about love in marriage?',
      a: 'Scripture calls husbands and wives to mutual, sacrificial love and respect (Ephesians 5:21–33), patterned on Christ and the church.',
    },
  ],
  birthday: [
    {
      q: 'What does the Bible say about birthdays?',
      a: 'The Bible does not command birthday observance but frames every year of life as a gift from God. Psalm 139:13–16 and James 1:17 celebrate God’s hand in our lives.',
    },
    {
      q: 'What is a good Bible verse for a birthday?',
      a: 'Numbers 6:24–26 (a blessing) and Psalm 20:4 (“may he give you the desire of your heart”) are popular birthday blessings. Jeremiah 29:11 is also common.',
    },
    {
      q: 'What verses celebrate life and God’s blessings?',
      a: 'Psalm 139:13–14 (“fearfully and wonderfully made”) and James 1:17 (“every good gift”) are often shared to mark another year.',
    },
  ],
  work: [
    {
      q: 'What does the Bible say about work?',
      a: 'The Bible presents work as good, given before the fall, to be done with diligence “as for the Lord” (Colossians 3:23).',
    },
    {
      q: 'What is a good Bible verse for work?',
      a: 'Colossians 3:23 (“whatever you do, work heartily”) and Proverbs 16:3 (“commit your work to the Lord”) are the most referenced.',
    },
    {
      q: 'What does the Bible say about laziness and diligence?',
      a: 'Proverbs contrasts the diligent with the sluggard and urges working while there is opportunity. Hard work is honored, while laziness leads to want.',
    },
  ],
  friendship: [
    {
      q: 'What does the Bible say about friendship?',
      a: 'The Bible values loyal, honest friendship. Proverbs 17:17 says a friend loves at all times, and Proverbs 27:17 says friends sharpen one another.',
    },
    {
      q: 'What is a good Bible verse about friendship?',
      a: 'Proverbs 17:17 and Proverbs 18:24 (“a friend who sticks closer than a brother”) are the most quoted. John 15:13 is also central.',
    },
    {
      q: 'What does the Bible say about being a good friend?',
      a: 'Scripture points to loyalty, honesty, and sacrificial love. “Faithful are the wounds of a friend” (Proverbs 27:6) values truthful, caring correction.',
    },
  ],

  // ——— Holidays / seasons ———
  christmas: [
    {
      q: 'What does the Bible say about the birth of Jesus?',
      a: 'The Gospels describe Jesus’ birth in Bethlehem as the fulfillment of prophecy (Matthew 1–2; Luke 2). John 1:14 says “the Word became flesh.”',
    },
    {
      q: 'What is a good Bible verse for Christmas?',
      a: 'Luke 2:10–14 (the angels’ announcement) and Isaiah 9:6 (“unto us a child is born”) are the most read at Christmas.',
    },
    {
      q: 'What does the Bible say about the meaning of Christmas?',
      a: 'Christmas celebrates God coming to us in Jesus — “God with us” (Matthew 1:23). Galatians 4:4–5 says Jesus came to redeem those under the law.',
    },
  ],
  easter: [
    {
      q: 'What does the Bible say about the resurrection?',
      a: 'The Gospels record that Jesus rose from the dead on the third day (Matthew 28; Mark 16; Luke 24; John 20). 1 Corinthians 15:3–8 summarizes the gospel this way.',
    },
    {
      q: 'What is a good Bible verse for Easter?',
      a: 'Luke 24:5–6 (“Why do you seek the living among the dead? He is not here, but is risen”) and 1 Corinthians 15:20 are the most used.',
    },
    {
      q: 'Why is the resurrection important?',
      a: 'The resurrection is the foundation of Christian hope — it confirms Jesus’ victory over sin and death and the promise of eternal life (1 Corinthians 15:20–22).',
    },
  ],
  thanksgiving: [
    {
      q: 'What does the Bible say about thanksgiving?',
      a: 'The Bible repeatedly commands giving thanks (Psalm 100:4; 1 Thessalonians 5:18). Thanksgiving is the response to God’s goodness and mercy.',
    },
    {
      q: 'What is a good Bible verse for Thanksgiving?',
      a: 'Psalm 100 and 1 Thessalonians 5:16–18 are the most read. Psalm 107:1 (“give thanks to the Lord, for he is good”) is also central.',
    },
    {
      q: 'What are some Thanksgiving Bible verses to share?',
      a: 'Colossians 3:15–17, Psalm 136, and James 1:17 (“every good and perfect gift is from above”) are commonly shared at Thanksgiving.',
    },
  ],
};
