// Reflection prompts — short, open questions matched to a drawn verse's themes
// and occasions. Used by the generator to add a "ponder this" beat beneath the
// verse card. Pure data + a tiny matcher (no DOM/Node imports) so it bundles
// cleanly into the client script.

const THEME_QUESTIONS = {
  Hope: [
    'What in this passage gives you hope for today?',
    'Where have you seen God’s promises at work in your life lately?',
    'What is one thing you are hoping for that you can entrust to God right now?',
  ],
  Peace: [
    'What is disturbing your peace today, and what would it look like to hand it over?',
    'How can you make space for stillness with God this week?',
    'Where do you need to trust God more than your own worry?',
  ],
  Love: [
    'How is God inviting you to receive His love today?',
    'Who is one person you can show practical love to this week?',
    'What does this verse reveal about the way God loves you?',
  ],
  Strength: [
    'What feels too heavy to carry alone right now?',
    'Where can you draw courage from God instead of your own effort?',
    'What step of courage is this verse prompting you to take?',
  ],
  Faith: [
    'What are you being invited to trust God with, even without seeing the outcome?',
    'Where has doubt crept in, and how can you bring it honestly to God?',
    'How does this passage reshape what you believe about God?',
  ],
  Comfort: [
    'What sorrow or worry do you need God’s comfort for today?',
    'Who in your life needs the same comfort you have received from God?',
    'How can you rest in God’s presence instead of trying to fix everything yourself?',
  ],
  Wisdom: [
    'How does this wisdom apply to a decision you are facing right now?',
    'What is one practical change this verse points you toward?',
    'Where do you need God’s perspective more than your own understanding?',
  ],
  Gratitude: [
    'What is one specific thing you can thank God for today?',
    'Where have you been taking blessings for granted lately?',
    'How can you turn this verse into a prayer of thanks right now?',
  ],
};

const OCCASION_QUESTIONS = {
  anxiety: [
    'What worry is heaviest on your heart, and can you name it before God?',
    'What would it look like to replace one anxious thought with this truth today?',
    'How does God’s nearness change the way you face your fears?',
  ],
  fear: [
    'What are you afraid of, and how does God’s presence answer that fear?',
    'Where is fear holding you back from a step of faith?',
    'What truth from this verse can you hold onto when fear returns?',
  ],
  encouragement: [
    'Who in your life needs the encouragement this verse offers today?',
    'What promise here can lift your spirit when you feel discouraged?',
    'How can you let this verse renew your hope for what is ahead?',
  ],
  healing: [
    'Where do you need healing — in body, heart, or spirit — today?',
    'What would it look like to bring that hurt honestly to God?',
    'How can you extend the healing you have received to someone else?',
  ],
  forgiveness: [
    'Who do you need to forgive, and what is the first step you can take?',
    'Where do you need to receive God’s forgiveness for yourself?',
    'What would freedom look like if you released this grudge today?',
  ],
  patience: [
    'What are you waiting on, and how is God shaping you in the wait?',
    'Where do you need to slow down and trust God’s timing?',
    'How can you respond with patience instead of frustration this week?',
  ],
  'new-beginnings': [
    'What new beginning is God inviting you into right now?',
    'What from the past do you need to leave behind to move forward?',
    'How does this verse give you courage for a fresh start?',
  ],
  grief: [
    'What loss are you carrying, and how can you let God comfort you in it?',
    'How has God’s faithfulness shown up for you in past seasons of sorrow?',
    'What would it look like to grieve with hope, not alone?',
  ],
  money: [
    'Where does money or security have a hold on your heart?',
    'How can you practice generosity instead of grasping this week?',
    'What does contentment look like for you right now?',
  ],
  marriage: [
    'How can you love your spouse more selflessly this week?',
    'Where does your relationship need more grace or patience?',
    'What is one way you can honor your commitment today?',
  ],
  birthday: [
    'As you mark another year, what are you most grateful for?',
    'What is one way you have seen God’s faithfulness this past year?',
    'What hope do you want to carry into the year ahead?',
  ],
  work: [
    'How can you work with more purpose and integrity this week?',
    'Where do you need to trust God with the outcome of your labor?',
    'Who can you serve through your work today?',
  ],
  friendship: [
    'Who is a friend you can encourage or support this week?',
    'How can you be a more faithful friend to someone today?',
    'What friendship needs mending, and what is a first step?',
  ],
};

// Fallback for whole-Bible draws (no theme/occasion tags).
const GENERAL_QUESTIONS = [
  'What is one thing this passage is inviting you to do or believe today?',
  'How can you turn this verse into a simple prayer?',
  'What would change if you lived out this truth this week?',
  'Who could you share this verse with today?',
];

// Gather every question that matches the verse's themes/occasions, deduped and
// in order (themes first, then occasions). Returns the general pool when the
// verse has no tags.
export function questionsFor(verse) {
  const keys = [...(verse.themes || []), ...(verse.occasions || [])];
  const out = [];
  const seen = new Set();
  for (const key of keys) {
    const qs = THEME_QUESTIONS[key] || OCCASION_QUESTIONS[key];
    if (!qs) continue;
    for (const q of qs) {
      if (!seen.has(q)) {
        seen.add(q);
        out.push(q);
      }
    }
  }
  return out.length ? out : GENERAL_QUESTIONS;
}
