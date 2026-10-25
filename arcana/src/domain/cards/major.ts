import type { CardContent, Element } from "@/domain/types";

export interface MajorSource extends CardContent {
  name: string;
  /** Golden Dawn elemental attribution, used for elemental dignities in the synthesis. */
  element: Element;
}

/** The 22 Major Arcana in traditional order, 0 (The Fool) to 21 (The World). */
export const MAJOR_ARCANA: readonly MajorSource[] = [
  {
    name: "The Fool",
    element: "air",
    tone: 1,
    upright: {
      keywords: ["beginnings", "openness", "trust"],
      meaning:
        "The Fool stands at the edge of something new with nothing but curiosity and a light pack. It describes a beginning that cannot be fully planned, a moment when trust in the process matters more than certainty about the outcome.",
      theme: "a fresh start entered with curiosity rather than certainty",
      advice: "Take the first small step before you feel completely ready, and let what you learn along the way shape the next one.",
      question: "What would you try if you allowed yourself to be a beginner?",
    },
    reversed: {
      keywords: ["hesitation", "recklessness", "naivety"],
      meaning:
        "Reversed, The Fool's openness tips out of balance. Either fear keeps you at the edge long after it is time to move, or enthusiasm carries you forward without looking at the ground beneath your feet.",
      theme: "a leap that is either held back by fear or taken without looking",
      advice: "Check one practical detail you have been avoiding, then decide whether this is a risk worth taking or one worth postponing.",
      question: "Is caution protecting you here, or simply keeping you where you are?",
    },
    areas: {
      work: "a new role, an unplanned pivot, or a project without a map",
      love: "a connection allowed to unfold without a script",
      self: "permission to start over without needing to know where it leads",
    },
  },
  {
    name: "The Magician",
    element: "air",
    tone: 2,
    upright: {
      keywords: ["skill", "focus", "resourcefulness"],
      meaning:
        "The Magician has every tool on the table and knows how to use them. It signals a moment when intention, skill, and available resources line up, so that what you focus on can actually be made real.",
      theme: "focused will and the skill to turn intention into action",
      advice: "Name exactly what you want to make happen, then use what is already in front of you instead of waiting for better tools.",
      question: "Which of your abilities are you underusing right now?",
    },
    reversed: {
      keywords: ["scattered energy", "manipulation", "untapped potential"],
      meaning:
        "Reversed, the tools are still there but the focus is not. Energy may be spread across too many directions, talent may sit unused, or persuasion may be sliding into manipulation, your own or someone else's.",
      theme: "talent that is scattered, unused, or bent toward manipulation",
      advice: "Choose one priority and drop two distractions. If something feels like a performance, ask what it is really selling.",
      question: "Where is your energy leaking away from what you actually intend?",
    },
    areas: {
      work: "the moment to pitch, launch, or demonstrate what you can do",
      love: "clear, intentional communication about what you want",
      self: "trust in your own capability to shape your circumstances",
    },
  },
  {
    name: "The High Priestess",
    element: "water",
    tone: 1,
    upright: {
      keywords: ["intuition", "stillness", "inner knowing"],
      meaning:
        "The High Priestess sits between two pillars, guarding what is not yet spoken. She points to knowledge that arrives through quiet attention: intuition, dreams, and the sense of something beneath the surface that cannot be rushed into words.",
      theme: "quiet intuition and knowledge that has not yet surfaced",
      advice: "Hold off on forcing a decision. Give yourself a quiet interval and notice what keeps returning to your mind when the noise drops.",
      question: "What do you already sense that you have not yet admitted out loud?",
    },
    reversed: {
      keywords: ["disconnection", "secrets", "noise"],
      meaning:
        "Reversed, the inner voice is drowned out or ignored. You may be relying entirely on outside opinions, or something hidden, in you or around you, is shaping events without being acknowledged.",
      theme: "an inner voice drowned out by noise, or something hidden working beneath the surface",
      advice: "Reduce the inputs for a while: fewer opinions, fewer feeds. Then ask what you would conclude if no one else were watching.",
      question: "Whose voice have you been listening to instead of your own?",
    },
    areas: {
      work: "reading what is unsaid in a team, a negotiation, or a market",
      love: "unspoken feelings, and the patience to let them surface",
      self: "a period of reflection, journaling, or deliberate solitude",
    },
  },
  {
    name: "The Empress",
    element: "earth",
    tone: 2,
    upright: {
      keywords: ["abundance", "nurture", "creativity"],
      meaning:
        "The Empress is growth in its most generous form: fertile ground, care, beauty, and the patient work of helping something flourish. She often appears when creativity, comfort, or nurturing, given or received, is central.",
      theme: "nurturing growth, creativity, and an abundance that comes from care",
      advice: "Tend what you have already planted. Give it time, attention, and a little more comfort than feels strictly necessary.",
      question: "What in your life is asking to be cared for rather than managed?",
    },
    reversed: {
      keywords: ["depletion", "smothering", "creative block"],
      meaning:
        "Reversed, care is out of balance. You may be giving until you are empty, holding on so tightly that growth is stifled, or neglecting the pleasures and rest that keep creativity alive.",
      theme: "care that has become depletion, over-control, or neglect of yourself",
      advice: "Redirect some of the care you give others toward yourself, and loosen your grip on something that needs room to grow.",
      question: "Where are you giving from an empty well?",
    },
    areas: {
      work: "a creative project, a growing business, or a team that needs tending",
      love: "warmth, sensuality, and the steady work of caring for each other",
      self: "rest, the body, and the creative instinct to make things",
    },
  },
  {
    name: "The Emperor",
    element: "fire",
    tone: 1,
    upright: {
      keywords: ["structure", "authority", "stability"],
      meaning:
        "The Emperor builds order where there was chaos. He represents structure, responsibility, clear boundaries, and the kind of authority that provides stability: rules and systems that let things endure.",
      theme: "structure, clear boundaries, and steady authority",
      advice: "Put a framework around the situation: a plan, a schedule, or a boundary you state clearly and keep.",
      question: "What would be easier if it had a clearer structure?",
    },
    reversed: {
      keywords: ["rigidity", "control", "instability"],
      meaning:
        "Reversed, structure becomes rigidity or collapses altogether. Control may be exercised for its own sake, authority may be abused or absent, and rules may protect status rather than people.",
      theme: "control that has turned rigid, or a structure that is missing when it is needed",
      advice: "Look at one rule you enforce, on yourself or others, and ask whether it still serves its purpose.",
      question: "Where are you holding on to control because uncertainty feels worse?",
    },
    areas: {
      work: "leadership, processes, and decisions about who holds responsibility",
      love: "commitment, reliability, and the boundaries that make a partnership safe",
      self: "discipline, routine, and taking ownership of your direction",
    },
  },
  {
    name: "The Hierophant",
    element: "earth",
    tone: 1,
    upright: {
      keywords: ["tradition", "guidance", "shared values"],
      meaning:
        "The Hierophant represents the wisdom held by institutions, traditions, and teachers. It suggests learning within an established framework, seeking guidance from someone experienced, or finding meaning in shared values and rituals.",
      theme: "established wisdom, mentorship, and shared values",
      advice: "Look for someone who has walked this path before you, and ask how they approached it.",
      question: "Which traditions or teachings genuinely support you, and which do you follow out of habit?",
    },
    reversed: {
      keywords: ["nonconformity", "dogma", "questioning"],
      meaning:
        "Reversed, The Hierophant questions the rules. It can point to rigid dogma that no longer fits, pressure to conform, or a healthy decision to find your own way outside conventional expectations.",
      theme: "a challenge to convention, whether a necessary questioning or a struggle with rigid expectations",
      advice: "Separate what you believe from what you were taught to believe, and allow yourself to keep only what still holds true.",
      question: "What expectation are you living up to that you never actually agreed to?",
    },
    areas: {
      work: "formal training, institutions, mentors, and established ways of doing things",
      love: "commitment, shared values, and the expectations of family or culture",
      self: "faith, belonging, and the beliefs that shape your choices",
    },
  },
  {
    name: "The Lovers",
    element: "air",
    tone: 1.5,
    upright: {
      keywords: ["connection", "alignment", "choice"],
      meaning:
        "The Lovers is about meaningful union and the choices that define it. Beyond romance, it describes alignment between values and action: a decision made with the whole heart, in which you choose what you truly stand for.",
      theme: "a meaningful connection, or a choice that aligns with your deepest values",
      advice: "Make the choice you could explain honestly to the people who matter to you, and to yourself.",
      question: "What do you value enough to choose it, even at a cost?",
    },
    reversed: {
      keywords: ["misalignment", "imbalance", "avoidance"],
      meaning:
        "Reversed, the union is strained or the choice is avoided. Values and actions may be out of step, a relationship may be out of balance, or a decision is being postponed in the hope that it will make itself.",
      theme: "misalignment between heart and action, or a decision that is being avoided",
      advice: "Write down the choice you are avoiding in one sentence. Then list what not choosing is already costing you.",
      question: "Where are your actions saying something different from your values?",
    },
    areas: {
      work: "partnerships, collaborations, and decisions that test your values",
      love: "deep connection, mutual choice, and honest alignment",
      self: "integrity, and living in line with what you believe",
    },
  },
  {
    name: "The Chariot",
    element: "water",
    tone: 1.5,
    upright: {
      keywords: ["determination", "direction", "momentum"],
      meaning:
        "The Chariot moves forward by holding opposing forces in check. It speaks of willpower, focus, and the discipline to steer toward a goal even when different parts of you, or of the situation, pull in different directions.",
      theme: "determined movement and the discipline to steer opposing forces",
      advice: "Decide on a direction and commit to it for a defined period. Progress will come from consistency, not from waiting for perfect conditions.",
      question: "What goal deserves your full commitment right now?",
    },
    reversed: {
      keywords: ["drift", "scattered force", "forcing"],
      meaning:
        "Reversed, the chariot loses its course. Energy may be spent pulling in several directions at once, or determination may harden into forcing outcomes that need patience.",
      theme: "lost direction, or willpower that is forcing what cannot be forced",
      advice: "Stop pushing for a moment. Identify which of your competing goals actually matters most, and let one of the others go.",
      question: "Are you steering, or simply trying to go faster?",
    },
    areas: {
      work: "ambition, a push toward a goal, or competing priorities that need to be reined in",
      love: "steering a relationship through change with a shared direction",
      self: "self-discipline and the confidence to move forward",
    },
  },
  {
    name: "Strength",
    element: "fire",
    tone: 1.5,
    upright: {
      keywords: ["courage", "compassion", "patience"],
      meaning:
        "Strength is not force but gentle mastery. It shows a quiet confidence that tames fear and impulse through patience and compassion, suggesting that the most durable power is calm, steady, and kind.",
      theme: "quiet courage and patient, compassionate self-mastery",
      advice: "Meet the difficult part of this situation, or of yourself, with steadiness instead of force. Gentleness may get further than pressure.",
      question: "What would it look like to be strong without being hard?",
    },
    reversed: {
      keywords: ["self-doubt", "impatience", "raw impulse"],
      meaning:
        "Reversed, inner strength is depleted or misdirected. Self-doubt can take hold, or impulses such as anger, fear, or appetite may be driving decisions instead of being gently held.",
      theme: "self-doubt, or impulses that are steering instead of being steadied",
      advice: "Look after the basics that support composure, such as sleep, food, and breathing room, before taking on the hardest conversation.",
      question: "What is unsettling your confidence, and is it actually true?",
    },
    areas: {
      work: "handling pressure, difficult personalities, or high stakes with composure",
      love: "patience, tenderness, and staying open during conflict",
      self: "resilience, emotional regulation, and self-compassion",
    },
  },
  {
    name: "The Hermit",
    element: "earth",
    tone: 0.5,
    upright: {
      keywords: ["introspection", "solitude", "inner guidance"],
      meaning:
        "The Hermit steps away from the crowd to find what is true. It describes a period of deliberate withdrawal, study, or inner listening, where the light needed for the next step comes from within rather than from others.",
      theme: "a deliberate withdrawal to listen for your own guidance",
      advice: "Set aside real time alone with the question, whether a walk, a page of writing, or an evening offline, before seeking anyone else's view.",
      question: "What becomes clear when the other voices go quiet?",
    },
    reversed: {
      keywords: ["isolation", "withdrawal", "avoidance"],
      meaning:
        "Reversed, solitude has turned into isolation, or reflection is being avoided altogether. You may be cut off from support, or staying busy precisely so that you never have to sit with what is underneath.",
      theme: "solitude that has become isolation, or reflection that is being avoided",
      advice: "Reach out to one person you trust and share a little of what you have been carrying alone.",
      question: "Are you withdrawing to understand, or to avoid being understood?",
    },
    areas: {
      work: "focused independent work, research, or stepping back to rethink your direction",
      love: "needing space, or learning what you want before sharing it",
      self: "contemplation, a retreat, or a search for meaning",
    },
  },
  {
    name: "Wheel of Fortune",
    element: "fire",
    tone: 1,
    upright: {
      keywords: ["cycles", "change", "turning points"],
      meaning:
        "The Wheel turns and conditions shift. This card speaks of cycles, timing, and change that arrives from outside your direct control, reminding you that circumstances are never static, including the ones that feel permanent.",
      theme: "a turning point, where circumstances shift and a new cycle begins",
      advice: "Focus on how you respond rather than on what you cannot control. Stay flexible enough to use the opportunity when the wheel turns.",
      question: "What patterns keep repeating, and what part do you play in them?",
    },
    reversed: {
      keywords: ["resistance", "setbacks", "repeating patterns"],
      meaning:
        "Reversed, the turning of the wheel feels like a setback, or change is being resisted. It can also point to a cycle that repeats because the lesson underneath it has not yet been learned.",
      theme: "a downturn, or a repeating cycle that is asking to be understood",
      advice: "Look back at the last time this situation occurred, and identify one thing you can do differently this time.",
      question: "What would it take to break this cycle rather than repeat it?",
    },
    areas: {
      work: "market shifts, sudden opportunities, or changes in fortune at work",
      love: "a new phase in a relationship, or a recurring dynamic",
      self: "accepting change and finding your footing in an evolving life",
    },
  },
  {
    name: "Justice",
    element: "air",
    tone: 1,
    upright: {
      keywords: ["fairness", "truth", "accountability"],
      meaning:
        "Justice weighs things as they are. It calls for honesty, fairness, and accountability, and suggests that decisions made now, and consequences already in motion, follow clearly from cause and effect.",
      theme: "clear-eyed fairness and accountability for cause and effect",
      advice: "Look at the facts as objectively as you can, including your own part. Make the decision you can stand behind long after the moment passes.",
      question: "What is the honest truth here, even if it is inconvenient?",
    },
    reversed: {
      keywords: ["imbalance", "bias", "evasion"],
      meaning:
        "Reversed, the scales are tilted. There may be unfairness, dishonesty, or a refusal, by you or others, to accept responsibility, and decisions may be skewed by bias or self-interest.",
      theme: "a tilted balance of unfairness, bias, or responsibility being avoided",
      advice: "Identify what you are accountable for and own it fully. Then decide calmly what you will no longer accept from others.",
      question: "Where are you judging yourself or others by a standard that is not fair?",
    },
    areas: {
      work: "contracts, decisions, and situations where fairness or integrity is on the line",
      love: "honesty, balance, and accountability between partners",
      self: "taking responsibility and living by your principles",
    },
  },
  {
    name: "The Hanged Man",
    element: "water",
    tone: 0,
    upright: {
      keywords: ["pause", "surrender", "new perspective"],
      meaning:
        "The Hanged Man hangs willingly, seeing the world upside down. It represents a deliberate pause: letting go of the need to act so that a new perspective can emerge, and accepting that some things become clear only after we stop pushing.",
      theme: "a deliberate pause that reveals a new perspective",
      advice: "Suspend action for a moment. Try describing the situation from the point of view of someone who disagrees with you.",
      question: "What might you see if you stopped trying to force an answer?",
    },
    reversed: {
      keywords: ["stalling", "resistance", "indecision"],
      meaning:
        "Reversed, the pause has become a stall. You may be stuck in indecision, making sacrifices that lead nowhere, or resisting a change in perspective that would release you.",
      theme: "a pause that has become a stall, held in place by resistance",
      advice: "Set a date by which you will decide. Waiting without a purpose is no longer serving you.",
      question: "What are you waiting for, and is it actually coming?",
    },
    areas: {
      work: "a delay, a project on hold, or the need to rethink an approach",
      love: "patience, letting a relationship breathe, or seeing your partner differently",
      self: "letting go of control and seeing your life from a new angle",
    },
  },
  {
    name: "Death",
    element: "water",
    tone: -0.5,
    upright: {
      keywords: ["endings", "transformation", "transition"],
      meaning:
        "Death rarely means a literal ending. It represents transformation: the close of one chapter so that another can begin, and the clearing away of what has run its course to make room for what is next.",
      theme: "an ending that clears the way for transformation",
      advice: "Let something finish properly. Mark the ending, even privately, rather than dragging it on out of habit or fear.",
      question: "What are you ready to let go of, if you are honest?",
    },
    reversed: {
      keywords: ["resisting change", "stagnation", "lingering"],
      meaning:
        "Reversed, a necessary ending is being resisted. Holding on to what has already run its course can create stagnation, and the transition becomes slower and more painful than it needs to be.",
      theme: "resistance to a necessary ending, which keeps you in limbo",
      advice: "Name the one thing you are keeping alive out of fear rather than love, and take a single step toward releasing it.",
      question: "What would become possible if you let this chapter close?",
    },
    areas: {
      work: "the end of a role or project, and the transition to something new",
      love: "a relationship transforming, or one phase ending so another can begin",
      self: "shedding an old identity, habit, or belief",
    },
  },
  {
    name: "Temperance",
    element: "fire",
    tone: 1.5,
    upright: {
      keywords: ["balance", "moderation", "integration"],
      meaning:
        "Temperance blends opposites with patience and care. It describes balance, healing, and integration: the steady art of combining different elements in the right proportion until something new and harmonious emerges.",
      theme: "patient balance and the integration of opposing forces",
      advice: "Look for the middle path. Adjust in small increments, and give the mixture time to settle before judging the result.",
      question: "Where would moderation serve you better than intensity?",
    },
    reversed: {
      keywords: ["excess", "imbalance", "impatience"],
      meaning:
        "Reversed, the blend is off. There may be excess in one area of life and neglect in another, or impatience may be pushing for quick results where gradual change is needed.",
      theme: "imbalance, excess, or impatience disrupting a gradual process",
      advice: "Identify where you are overdoing something and where you are underdoing something else. Shift a little weight from one to the other.",
      question: "What is out of proportion in your life right now?",
    },
    areas: {
      work: "collaboration, steady progress, and a sustainable pace",
      love: "compromise, mutual adjustment, and calm after tension",
      self: "healing, moderation, and finding a rhythm that sustains you",
    },
  },
  {
    name: "The Devil",
    element: "earth",
    tone: -1.5,
    upright: {
      keywords: ["attachment", "temptation", "constraint"],
      meaning:
        "The Devil shows chains that are looser than they appear. It points to attachments, compulsions, or arrangements that have become constraining: patterns kept in place by habit, fear, or short-term pleasure rather than by genuine choice.",
      theme: "attachments and patterns that feel binding but can be released",
      advice: "Name the pattern plainly. Then identify the smallest action that would prove to yourself that you have a choice.",
      question: "What are you holding on to that is also holding on to you?",
    },
    reversed: {
      keywords: ["release", "awareness", "reclaiming power"],
      meaning:
        "Reversed, The Devil's grip is loosening. You may be recognising an unhealthy pattern for what it is and beginning to break free, though old habits may still pull at you along the way.",
      theme: "growing awareness of a constraint, and the first steps toward release",
      advice: "Protect the progress you are making: change the environment that triggers the old pattern, and tell someone who can support you.",
      question: "What would freedom from this pattern actually feel like day to day?",
    },
    areas: {
      work: "golden handcuffs, overwork, or a role that feels impossible to leave",
      love: "codependence, jealousy, or a dynamic held together by fear",
      self: "habits, compulsions, and the stories that keep you stuck",
    },
  },
  {
    name: "The Tower",
    element: "fire",
    tone: -2,
    upright: {
      keywords: ["upheaval", "revelation", "sudden change"],
      meaning:
        "The Tower is sudden disruption: a structure built on a false premise gives way. Though unsettling, it clears illusions in a single stroke, revealing what was unstable so that something truer can be built in its place.",
      theme: "sudden upheaval that exposes what was built on unstable ground",
      advice: "Do not rush to rebuild exactly what fell. First look at what the disruption revealed, and keep what is genuinely sound.",
      question: "What truth has this disruption made impossible to ignore?",
    },
    reversed: {
      keywords: ["averted crisis", "fear of change", "delayed reckoning"],
      meaning:
        "Reversed, the upheaval is internal, delayed, or narrowly avoided. You may sense that something is unstable but are bracing against change, which can prolong the tension rather than resolve it.",
      theme: "a reckoning that is being delayed, or a change felt inwardly before it shows outwardly",
      advice: "Make a controlled change now, such as a conversation, a correction, or a repair, rather than waiting for a forced one later.",
      question: "What crack have you noticed but chosen not to look at?",
    },
    areas: {
      work: "restructuring, a sudden reversal, or an exposed weakness in a plan",
      love: "a revelation, a crisis, or the collapse of an illusion between people",
      self: "a breakthrough that arrives through disruption",
    },
  },
  {
    name: "The Star",
    element: "air",
    tone: 2,
    upright: {
      keywords: ["hope", "renewal", "calm"],
      meaning:
        "The Star appears after difficulty, bringing calm and renewed hope. It speaks of healing, inspiration, and quiet faith in the future: the sense that you are on the right path even if the destination is still far away.",
      theme: "renewed hope, healing, and a calm sense of direction",
      advice: "Allow yourself to be hopeful in a practical way: pick one small action that expresses your belief in what comes next.",
      question: "What gives you hope that does not depend on certainty?",
    },
    reversed: {
      keywords: ["discouragement", "doubt", "disconnection"],
      meaning:
        "Reversed, the light feels distant. Discouragement, fatigue, or a loss of faith may be making it hard to see possibilities that are, in fact, still there.",
      theme: "a dimmed sense of hope that needs gentle rekindling",
      advice: "Lower the bar for today. Do one restorative thing, and let that be enough to count as progress.",
      question: "What has made you stop believing this could get better?",
    },
    areas: {
      work: "renewed purpose, inspiration, or recovery after a difficult period",
      love: "healing, openness, and trust slowly returning",
      self: "renewal, rest, and reconnection with what you love",
    },
  },
  {
    name: "The Moon",
    element: "water",
    tone: -0.5,
    upright: {
      keywords: ["uncertainty", "intuition", "illusion"],
      meaning:
        "The Moon lights the path only partially. It describes a time of ambiguity, when imagination, fear, and intuition are hard to tell apart, and things may not be what they seem until more light arrives.",
      theme: "ambiguity, where intuition and illusion are difficult to separate",
      advice: "Avoid irreversible decisions while the picture is unclear. Note your fears and intuitions separately, and wait for one more piece of evidence.",
      question: "Which of your fears are information, and which are imagination?",
    },
    reversed: {
      keywords: ["clarity returning", "released fear", "confusion"],
      meaning:
        "Reversed, the fog begins to lift. Confusion or anxiety may be easing as hidden things come to light. If you have been avoiding the uncertainty, though, it may simply be getting louder.",
      theme: "fog beginning to lift, and fears that can now be examined",
      advice: "Ask the direct question you have been avoiding. The answer is likely to be more manageable than the uncertainty.",
      question: "What has become clearer, now that you are ready to look?",
    },
    areas: {
      work: "unclear information, uncertainty at work, or decisions based on incomplete facts",
      love: "insecurity, projection, or feelings that are hard to read",
      self: "dreams, anxieties, and the unconscious mind",
    },
  },
  {
    name: "The Sun",
    element: "fire",
    tone: 2,
    upright: {
      keywords: ["vitality", "clarity", "joy"],
      meaning:
        "The Sun shines without shadow. It is one of the most affirming cards in the deck, representing clarity, vitality, warmth, and success: a time when things are seen plainly and enjoyed fully.",
      theme: "clarity, warmth, and confident vitality",
      advice: "Let yourself be seen. Share what you are proud of and enjoy what is working without waiting for the catch.",
      question: "What would you do if you trusted that things could go well?",
    },
    reversed: {
      keywords: ["dimmed joy", "overconfidence", "delay"],
      meaning:
        "Reversed, the light is still present but partly obscured. Joy may be muted by worry, success may be delayed, or optimism may have tipped into overconfidence that overlooks the details.",
      theme: "warmth and success that are present but partly clouded",
      advice: "Find the part of the situation that is genuinely good and give it your attention, without ignoring the details that need checking.",
      question: "What is quietly dimming your enjoyment of what is going well?",
    },
    areas: {
      work: "recognition, success, and work that energises you",
      love: "warmth, openness, and joy shared freely",
      self: "health, confidence, and the simple pleasure of being alive",
    },
  },
  {
    name: "Judgement",
    element: "fire",
    tone: 1,
    upright: {
      keywords: ["awakening", "reckoning", "calling"],
      meaning:
        "Judgement sounds a call to rise. It represents reflection, reckoning, and renewal: seeing your past clearly, accepting it, and answering a deeper calling that asks you to become who you are meant to be.",
      theme: "an awakening, with a clear reckoning with the past and a call toward renewal",
      advice: "Review the lessons of this chapter honestly, forgive what needs forgiving, and say yes to the call you keep hearing.",
      question: "What is calling you forward, and what have you learned that prepares you for it?",
    },
    reversed: {
      keywords: ["self-doubt", "harsh judgement", "ignoring the call"],
      meaning:
        "Reversed, the call is muffled by doubt or self-criticism. You may be judging yourself too harshly to move on, or ignoring a clear sign that it is time to change.",
      theme: "a call to change that is being muffled by self-judgement or doubt",
      advice: "Replace one self-critical story with an accurate one. Then take a single step in the direction the call is pointing.",
      question: "What would you do if you forgave yourself for the past?",
    },
    areas: {
      work: "a career calling, an evaluation, or a decisive moment of reinvention",
      love: "reconciliation, second chances, or an honest reckoning together",
      self: "awakening, and acceptance of who you have been",
    },
  },
  {
    name: "The World",
    element: "earth",
    tone: 2,
    upright: {
      keywords: ["completion", "integration", "wholeness"],
      meaning:
        "The World marks the completion of a cycle. Everything has come together, lessons learned and effort rewarded, and there is a sense of wholeness, accomplishment, and readiness for the next, larger journey.",
      theme: "completion, integration, and the wholeness of a cycle fulfilled",
      advice: "Acknowledge what you have completed. Celebrate it properly before you rush on to the next thing.",
      question: "What have you accomplished that you have not yet fully recognised?",
    },
    reversed: {
      keywords: ["incompletion", "loose ends", "delays"],
      meaning:
        "Reversed, the cycle is not quite closed. Loose ends, unfinished business, or the fear of moving on may be preventing a sense of completion and keeping the next chapter on hold.",
      theme: "a cycle that is nearly complete but held open by loose ends",
      advice: "List what remains unfinished, and decide for each item whether to complete it or deliberately let it go.",
      question: "What last step would let you call this chapter finished?",
    },
    areas: {
      work: "the completion of a major project, a graduation, or a long effort paying off",
      love: "a relationship reaching a fulfilled and integrated stage",
      self: "a sense of wholeness and arrival after long effort",
    },
  },
];
