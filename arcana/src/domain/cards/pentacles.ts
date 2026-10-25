import type { CardContent } from "@/domain/types";

/** Pentacles — earth: work, money, the body, material matters. Ace … Ten, Page, Knight, Queen, King. */
export const PENTACLES: readonly CardContent[] = [
  {
    tone: 2,
    upright: {
      keywords: ["opportunity", "prosperity", "new foundations"],
      meaning:
        "The Ace of Pentacles offers a tangible new beginning: an opportunity to build something real, whether financial, professional, or physical. It is a seed with genuine potential, provided it is planted and tended.",
      theme: "a tangible opportunity to build something real and lasting",
      advice: "Make the opportunity concrete: set a budget, a schedule, or a first practical step.",
      question: "What opportunity in front of you could grow into something lasting?",
    },
    reversed: {
      keywords: ["missed opportunity", "poor planning", "scarcity"],
      meaning:
        "Reversed, a promising opportunity may slip away through hesitation or poor planning, or a fear of scarcity may be preventing you from investing in your own future.",
      theme: "an opportunity at risk of slipping away through hesitation or scarcity thinking",
      advice: "Check the practical details of money, time, and energy before committing, but do not let caution become paralysis.",
      question: "What resources do you already have that you are overlooking?",
    },
    areas: {
      work: "a job offer, a new business opportunity, or financial growth",
      love: "a relationship with a solid foundation, or a practical commitment",
      self: "health, grounding, and investing in your well-being",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["balance", "adaptability", "juggling"],
      meaning:
        "The Two of Pentacles juggles two coins within an endless loop. It speaks of adaptability, managing competing priorities, and keeping your balance amid change, which is as much a skill as a struggle.",
      theme: "adaptable juggling of competing priorities",
      advice: "Accept that balance is dynamic, not fixed. Review your commitments each week and adjust as needed.",
      question: "What are you juggling, and what could you put down?",
    },
    reversed: {
      keywords: ["overwhelm", "disorganisation", "imbalance"],
      meaning:
        "Reversed, the juggling act falters. Too many commitments, financial strain, or disorganisation may be causing things to drop.",
      theme: "a juggling act that has become overwhelming",
      advice: "Write down every commitment you are holding. Choose the two that matter most this week.",
      question: "What would simplify your life the most?",
    },
    areas: {
      work: "managing several projects, flexible roles, or financial juggling",
      love: "balancing a relationship with other demands",
      self: "work-life balance and adapting to change",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["collaboration", "craftsmanship", "learning"],
      meaning:
        "The Three of Pentacles shows a craftsperson consulting with others beneath a cathedral arch. It represents teamwork, skill, and the recognition that comes when different talents combine to create something of quality.",
      theme: "skilled collaboration in which different talents build something of quality",
      advice: "Bring the right people together and respect each person's expertise. Ask for feedback early.",
      question: "Whose skills would complement yours here?",
    },
    reversed: {
      keywords: ["poor teamwork", "misalignment", "mediocrity"],
      meaning:
        "Reversed, collaboration breaks down. Goals may be misaligned, contributions may go unrecognised, or standards may slip because no one is taking ownership.",
      theme: "collaboration that is misaligned or lacking ownership",
      advice: "Clarify roles and expectations. A short conversation about who does what can prevent weeks of friction.",
      question: "Where is the team, or your part in it, out of alignment?",
    },
    areas: {
      work: "teamwork, apprenticeship, or a project that rewards skill",
      love: "building something together through shared effort",
      self: "mastering a craft and learning from others",
    },
  },
  {
    tone: -0.5,
    upright: {
      keywords: ["security", "control", "holding on"],
      meaning:
        "The Four of Pentacles holds tightly to what it has. It speaks of security, saving, and stability, and also of possessiveness, fear of loss, and a grip so tight that nothing new can enter.",
      theme: "a protective grip on security that may be holding too tightly",
      advice: "Protect what matters, but loosen your hold on something that would benefit from being shared or invested.",
      question: "What are you afraid would happen if you loosened your grip?",
    },
    reversed: {
      keywords: ["release", "generosity", "instability"],
      meaning:
        "Reversed, the grip loosens. Sometimes this is wise, as generosity and openness return; sometimes it is careless, with reckless spending or a sudden loss of security.",
      theme: "a loosening grip, moving toward either generosity or instability",
      advice: "Let go deliberately rather than all at once. Decide what you are releasing and why.",
      question: "Is your letting go a choice or a reaction?",
    },
    areas: {
      work: "financial caution, holding a position, or resistance to change",
      love: "possessiveness, or fear of vulnerability",
      self: "security, control, and the fear of scarcity",
    },
  },
  {
    tone: -2,
    upright: {
      keywords: ["hardship", "exclusion", "worry"],
      meaning:
        "The Five of Pentacles walks through the snow past a lit window. It describes hardship, financial or physical strain, and feeling left out in the cold, while help may be closer than it seems.",
      theme: "hardship and feeling left out in the cold, with help nearby but unseen",
      advice: "Ask for help. Look for the support you have not yet approached, and let it in.",
      question: "What help are you overlooking because asking feels too hard?",
    },
    reversed: {
      keywords: ["recovery", "support", "improvement"],
      meaning:
        "Reversed, the hardship begins to ease. Recovery, renewed support, or improved circumstances may be arriving as you accept help and find your way back inside.",
      theme: "recovery from hardship, with support returning",
      advice: "Accept the help that is offered, and take the next small step toward stability.",
      question: "What has helped you get through, and how can you build on it?",
    },
    areas: {
      work: "financial difficulty, job insecurity, or a sense of exclusion at work",
      love: "feeling neglected or left out, or facing hardship together",
      self: "health concerns, insecurity, and the courage to ask for help",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["generosity", "exchange", "fairness"],
      meaning:
        "The Six of Pentacles weighs its coins on a scale before giving them away. It speaks of generosity, fair exchange, and the flow of resources: giving and receiving help in a balanced way.",
      theme: "generous, balanced exchange of help and resources",
      advice: "Give what you can afford to give, and allow yourself to receive what you need.",
      question: "Are you more comfortable giving or receiving, and why?",
    },
    reversed: {
      keywords: ["strings attached", "imbalance", "dependency"],
      meaning:
        "Reversed, the exchange becomes unequal. Generosity may come with strings attached, power may be imbalanced, or one person may be giving far more than they receive.",
      theme: "an exchange that is unequal or comes with strings attached",
      advice: "Look at the terms behind the help you give or receive. Make the unspoken expectations explicit.",
      question: "What expectations are hidden inside this exchange?",
    },
    areas: {
      work: "fair pay, mentoring, or giving and receiving support",
      love: "balanced give-and-take, or one partner supporting the other",
      self: "generosity, and healthy boundaries around helping",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["patience", "assessment", "long-term growth"],
      meaning:
        "The Seven of Pentacles leans on a hoe and studies a harvest that is still ripening. It describes patience, evaluation, and long-term investment: pausing to assess whether your effort is paying off.",
      theme: "patient assessment of long-term effort that is still ripening",
      advice: "Measure your progress honestly. Decide whether to keep investing, adjust, or redirect your energy.",
      question: "Is this effort growing into what you hoped for?",
    },
    reversed: {
      keywords: ["impatience", "poor returns", "doubt"],
      meaning:
        "Reversed, frustration sets in. Results may feel too slow, effort may be going into the wrong place, or impatience may tempt you to abandon something just before it pays off.",
      theme: "impatience with slow returns, or effort invested in the wrong place",
      advice: "Before giving up, check whether the problem is the effort itself or the timeline you set.",
      question: "What would you do differently if you were planning for the long term?",
    },
    areas: {
      work: "a long-term investment, a career review, or waiting for results",
      love: "evaluating where a relationship is going",
      self: "patience with your own growth",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["diligence", "mastery", "skill-building"],
      meaning:
        "The Eight of Pentacles works steadily on one coin after another. It represents dedication, craftsmanship, and the quiet satisfaction of improving through repetition and attention to detail.",
      theme: "dedicated practice and the steady pursuit of mastery",
      advice: "Focus on doing one thing well. Practise consistently, and let quality accumulate.",
      question: "What skill are you building, and what would mastery look like?",
    },
    reversed: {
      keywords: ["perfectionism", "lack of focus", "cutting corners"],
      meaning:
        "Reversed, the work loses its meaning. It can point to perfectionism, repetitive effort without growth, or cutting corners because the motivation has faded.",
      theme: "effort that has become perfectionism, repetition, or shortcuts",
      advice: "Reconnect with why the work matters. Do the next task well, rather than perfectly.",
      question: "Is this work still helping you grow?",
    },
    areas: {
      work: "training, skill-building, or a demanding project that rewards attention",
      love: "putting consistent effort into a relationship",
      self: "self-improvement and disciplined practice",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["independence", "abundance", "self-sufficiency"],
      meaning:
        "The Nine of Pentacles stands at ease in a flourishing garden. It represents independence, refinement, and the satisfaction of enjoying what you have built through your own effort.",
      theme: "self-sufficient abundance and the enjoyment of what you have built",
      advice: "Enjoy the rewards of your effort. Invest in your own comfort and independence.",
      question: "What have you built that allows you to stand on your own?",
    },
    reversed: {
      keywords: ["overwork", "dependence", "appearances"],
      meaning:
        "Reversed, the garden is less secure than it looks. Success may rest on overwork or appearances, independence may be fragile, or you may struggle to enjoy what you have earned.",
      theme: "success that rests on appearances, overwork, or fragile independence",
      advice: "Check that your way of living is sustainable. Give yourself permission to enjoy without proving anything.",
      question: "What would true independence look like for you?",
    },
    areas: {
      work: "financial independence, self-employment, or the rewards of discipline",
      love: "being whole on your own, or a relationship that respects independence",
      self: "self-worth, refinement, and enjoying your own company",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["legacy", "wealth", "long-term security"],
      meaning:
        "The Ten of Pentacles arranges its coins in the shape of the Tree of Life above a family home. It speaks of legacy, lasting security, and wealth, material and otherwise, that extends across generations.",
      theme: "lasting legacy and security built across generations",
      advice: "Think long term. Make choices today that your future self, and those after you, will thank you for.",
      question: "What legacy do you want to build?",
    },
    reversed: {
      keywords: ["family conflict", "instability", "short-term thinking"],
      meaning:
        "Reversed, the foundation shows cracks. There may be family tension, disputes over money or inheritance, or short-term choices that undermine long-term security.",
      theme: "cracks in a long-term foundation, or tension over legacy",
      advice: "Address the long-term issue you have been postponing, whether it is a conversation, a plan, or a financial decision.",
      question: "What foundation needs repair before you build further?",
    },
    areas: {
      work: "long-term success, a family business, or stable institutions",
      love: "long-term commitment, family, and building a home",
      self: "roots, heritage, and lasting security",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["study", "ambition", "practical beginnings"],
      meaning:
        "The Page of Pentacles studies a coin with complete absorption. It represents a practical new beginning: learning, planning, and the patient ambition to turn an idea into something real.",
      theme: "studious, grounded ambition at the start of something practical",
      advice: "Learn the fundamentals. Make a realistic plan and take the first practical step.",
      question: "What would you like to learn deeply?",
    },
    reversed: {
      keywords: ["procrastination", "lack of progress", "unrealistic goals"],
      meaning:
        "Reversed, plans stay on paper. Procrastination, distraction, or goals that do not match the resources available may be preventing real progress.",
      theme: "practical plans that stall in procrastination or unrealistic goals",
      advice: "Shrink the goal until you can start on it today. Progress beats planning.",
      question: "What small action would turn this plan into reality?",
    },
    areas: {
      work: "education, an apprenticeship, or a new job with room to grow",
      love: "a slow, steady, sincere beginning",
      self: "learning, health goals, and practical self-improvement",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["reliability", "routine", "steady progress"],
      meaning:
        "The Knight of Pentacles sits on a still horse, surveying a ploughed field. He embodies reliability, patience, and methodical progress: not fast, but thorough and dependable.",
      theme: "methodical, reliable progress that values thoroughness over speed",
      advice: "Commit to a steady routine. Small, consistent steps will take you further than bursts of effort.",
      question: "What routine would support your goal most reliably?",
    },
    reversed: {
      keywords: ["stagnation", "boredom", "perfectionism"],
      meaning:
        "Reversed, steadiness becomes stagnation. Routine may turn into a rut, caution into inertia, or perfectionism may stop work from ever being finished.",
      theme: "steadiness that has hardened into stagnation or perfectionism",
      advice: "Introduce one small change into your routine, and set a finishing point for the task you keep refining.",
      question: "Where has caution become inertia?",
    },
    areas: {
      work: "dependable progress, a long project, or a methodical approach",
      love: "loyalty, consistency, and showing love through reliability",
      self: "discipline, healthy routines, and patience",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["nurture", "practicality", "abundance"],
      meaning:
        "The Queen of Pentacles sits in a lush garden, holding her coin with care. She represents practical nurturing, resourcefulness, and grounded abundance: the ability to create comfort and security for herself and others.",
      theme: "practical care and grounded, generous abundance",
      advice: "Look after the practical needs, yours and other people's, and create comfort where you can.",
      question: "How can you care for yourself and others in a practical way?",
    },
    reversed: {
      keywords: ["imbalance", "self-neglect", "smothering"],
      meaning:
        "Reversed, practical care becomes imbalanced. You may be neglecting your own needs, focusing too much on work or appearances, or caring for others in a way that becomes smothering.",
      theme: "practical care out of balance, neglecting the self or overwhelming others",
      advice: "Restore the balance between your responsibilities and your own well-being. Let someone look after you.",
      question: "Who takes care of you?",
    },
    areas: {
      work: "a supportive leader, financial competence, or a healthy balance with home",
      love: "a nurturing, generous partner, or a comfortable home",
      self: "self-care, comfort, and connection to the body",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["security", "discipline", "provision"],
      meaning:
        "The King of Pentacles sits among vines, his throne carved with bulls. He represents wealth, discipline, and leadership grounded in practical results: a reliable provider who builds lasting security.",
      theme: "secure, disciplined abundance and grounded leadership",
      advice: "Make decisions with long-term stability in mind. Use your resources to build something lasting.",
      question: "What does real security mean to you?",
    },
    reversed: {
      keywords: ["greed", "materialism", "stubbornness"],
      meaning:
        "Reversed, success becomes materialism or control. There may be stubbornness, an obsession with status or money, or financial decisions driven by ego.",
      theme: "material success that has turned into greed, stubbornness, or control",
      advice: "Separate your worth from your wealth. Use your resources to serve your values, not your status.",
      question: "What would you still value if the money were gone?",
    },
    areas: {
      work: "business success, financial leadership, or a stable career",
      love: "a dependable, protective partner, or practical commitment",
      self: "material security and disciplined self-management",
    },
  },
];
