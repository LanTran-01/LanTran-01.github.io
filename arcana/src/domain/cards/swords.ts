import type { CardContent } from "@/domain/types";

/** Swords — air: thought, truth, conflict, communication. Ace … Ten, Page, Knight, Queen, King. */
export const SWORDS: readonly CardContent[] = [
  {
    tone: 1.5,
    upright: {
      keywords: ["clarity", "truth", "breakthrough"],
      meaning:
        "The Ace of Swords cuts through confusion. It brings mental clarity, a breakthrough idea, or a truth spoken plainly: the kind of insight that makes a clear decision possible.",
      theme: "a breakthrough of clarity and the courage to state the truth",
      advice: "Say the clear thing. Write down the decision you have reached and the reasons behind it.",
      question: "What truth, once spoken, would simplify everything?",
    },
    reversed: {
      keywords: ["confusion", "misinformation", "harsh words"],
      meaning:
        "Reversed, the blade is clouded or misused. Thinking may be muddled, information unreliable, or truth wielded harshly, cutting people rather than cutting through confusion.",
      theme: "clouded thinking, or truth used as a weapon",
      advice: "Before acting on what you think you know, verify it. Say difficult things with care for how they land.",
      question: "Where is your thinking clouded by assumption?",
    },
    areas: {
      work: "a breakthrough idea, a clear decision, or honest feedback",
      love: "an honest conversation that clears the air",
      self: "mental clarity and a new way of seeing",
    },
  },
  {
    tone: -0.5,
    upright: {
      keywords: ["stalemate", "indecision", "avoidance"],
      meaning:
        "In the Two of Swords, a blindfolded figure holds two blades in tense balance. It describes a difficult choice, a stalemate, or a decision avoided by refusing to look at the full picture.",
      theme: "a stalemate held in place by a decision that is being avoided",
      advice: "Remove the blindfold: gather the information you have been avoiding, and accept that no option will be perfect.",
      question: "What are you refusing to see because seeing it would require a choice?",
    },
    reversed: {
      keywords: ["overwhelm", "confusion", "information overload"],
      meaning:
        "Reversed, the balance gives way. Indecision may have become overwhelming, too much information may be making a choice impossible, or the truth you were avoiding is now in plain sight.",
      theme: "an avoided decision that has become overwhelming",
      advice: "Reduce the decision to its two most important factors. Decide on those, and let the rest follow.",
      question: "What is the simplest version of this choice?",
    },
    areas: {
      work: "a tough decision, a negotiation at a standstill, or conflicting priorities",
      love: "an emotional stalemate, or a difficult conversation being avoided",
      self: "inner conflict between head and heart",
    },
  },
  {
    tone: -2,
    upright: {
      keywords: ["heartbreak", "grief", "painful truth"],
      meaning:
        "The Three of Swords pierces the heart. It names emotional pain plainly, whether grief, betrayal, disappointment, or a truth that hurts, and suggests that acknowledging the wound is the first step in healing it.",
      theme: "heartbreak, or a painful truth that needs to be acknowledged",
      advice: "Do not minimise the hurt. Let yourself feel it, and let someone you trust know what you are going through.",
      question: "What pain needs to be acknowledged before it can begin to heal?",
    },
    reversed: {
      keywords: ["recovery", "release", "lingering hurt"],
      meaning:
        "Reversed, the wound begins to close, though it may still ache. You may be releasing old pain and forgiving, or holding on to it, replaying the hurt instead of letting it heal.",
      theme: "recovery from hurt, or pain that is being replayed rather than released",
      advice: "Notice the story you tell about this hurt. Choose the version of it that allows you to move forward.",
      question: "What would it take to let this pain soften?",
    },
    areas: {
      work: "disappointment, harsh criticism, or the end of something you were invested in",
      love: "heartbreak, betrayal, or a painful separation",
      self: "grief, and the honest acknowledgement of sorrow",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["rest", "recovery", "contemplation"],
      meaning:
        "The Four of Swords lays the blades down. It calls for rest, recuperation, and quiet reflection after strain: a deliberate pause to restore your energy before facing the next challenge.",
      theme: "deliberate rest and recovery after a period of strain",
      advice: "Schedule genuine rest, not just a break from one task to do another. Protect it like an appointment.",
      question: "What would real rest look like for you right now?",
    },
    reversed: {
      keywords: ["restlessness", "burnout", "forced pause"],
      meaning:
        "Reversed, rest is refused or comes too late. Restlessness, burnout, or an inability to switch off may be wearing you down, or the body may be forcing the pause that the mind would not take.",
      theme: "burnout, or a pause forced because rest was not taken",
      advice: "Treat exhaustion as information rather than weakness. Cancel one thing this week.",
      question: "What are you afraid will happen if you stop?",
    },
    areas: {
      work: "a needed break, a sabbatical, or stepping back to plan",
      love: "taking space to recover from tension or conflict",
      self: "rest, meditation, and recovery",
    },
  },
  {
    tone: -1.5,
    upright: {
      keywords: ["conflict", "hollow victory", "tension"],
      meaning:
        "The Five of Swords shows a victory that costs too much. It describes conflict, defeat, or winning at the expense of relationships, and asks whether the battle was worth fighting at all.",
      theme: "a conflict in which winning may cost more than it gains",
      advice: "Decide what actually matters more: being right, or keeping the relationship. Pick your battles accordingly.",
      question: "What would you gain, and what would you lose, by winning this?",
    },
    reversed: {
      keywords: ["reconciliation", "resentment", "moving past conflict"],
      meaning:
        "Reversed, the dust begins to settle. There may be an opportunity to reconcile and make amends, or lingering resentment and unspoken grievances may keep the conflict alive under the surface.",
      theme: "the aftermath of conflict, with a chance to reconcile or a resentment that lingers",
      advice: "Make the first move toward repair, or decide consciously to walk away without carrying the fight with you.",
      question: "What would it take to put this conflict down?",
    },
    areas: {
      work: "office politics, competition, or a dispute you may be better off leaving",
      love: "arguments, power struggles, or hurtful words",
      self: "examining how you handle conflict and defeat",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["transition", "moving on", "calmer waters"],
      meaning:
        "The Six of Swords carries you across the water, away from turbulence. It describes a transition, a necessary departure, or a gradual movement toward calmer circumstances: carrying some of the past, but leaving the worst behind.",
      theme: "a transition from turbulence toward calmer water",
      advice: "Accept help to move forward. You do not need to have fully recovered before you begin to leave.",
      question: "What are you ready to leave behind as you move on?",
    },
    reversed: {
      keywords: ["resisting change", "unfinished business", "stuck"],
      meaning:
        "Reversed, the crossing stalls. You may be resisting a necessary transition, returning to troubled waters, or carrying unresolved baggage that makes moving on harder.",
      theme: "a necessary transition that is stalled or weighed down by unfinished business",
      advice: "Identify the one unresolved issue you keep carrying, and decide whether to address it or put it down.",
      question: "What keeps pulling you back to where you started?",
    },
    areas: {
      work: "a move to a new role or place, or leaving a stressful environment",
      love: "moving on from a difficult period, together or apart",
      self: "healing through gradual change",
    },
  },
  {
    tone: -1,
    upright: {
      keywords: ["secrecy", "strategy", "deception"],
      meaning:
        "The Seven of Swords tiptoes away with an armful of blades. It points to strategy, secrecy, and cunning, sometimes clever and sometimes deceptive, and asks whether someone, possibly you, is not being entirely honest.",
      theme: "strategy and secrecy, with a question of who is being fully honest",
      advice: "Check the agreements and assumptions you are relying on. If you are tempted to cut a corner, consider who would pay for it.",
      question: "Where are you, or someone else, not telling the whole story?",
    },
    reversed: {
      keywords: ["confession", "conscience", "coming clean"],
      meaning:
        "Reversed, what was hidden is brought into the open. It can indicate confession, a guilty conscience, or giving up a strategy that relied on avoiding the truth.",
      theme: "hidden things surfacing, and an urge to come clean",
      advice: "Tell the truth you have been holding, starting with the person it affects most.",
      question: "What would it cost you to be fully honest now?",
    },
    areas: {
      work: "office politics, a strategic manoeuvre, or a breach of trust",
      love: "secrecy, trust issues, or something left unsaid",
      self: "self-deception, and the stories you tell to avoid discomfort",
    },
  },
  {
    tone: -1.5,
    upright: {
      keywords: ["restriction", "feeling trapped", "self-limiting beliefs"],
      meaning:
        "In the Eight of Swords, a bound and blindfolded figure stands among blades that do not actually enclose her. It describes feeling trapped by circumstances that are partly sustained by fear, assumption, or self-limiting belief.",
      theme: "feeling trapped by limits that are partly self-imposed",
      advice: "List the constraints you feel. Mark the ones that are facts and the ones that are fears, and act on one of the fears.",
      question: "Which of the walls around you are actually real?",
    },
    reversed: {
      keywords: ["release", "new perspective", "self-acceptance"],
      meaning:
        "Reversed, the bindings loosen. You may be recognising that you are freer than you thought, beginning to see a way out, and reclaiming your own power to choose.",
      theme: "release from self-imposed limits, with a way out coming into view",
      advice: "Take the step you have been telling yourself you cannot take, even a very small version of it.",
      question: "What would you do differently if you trusted that you are free?",
    },
    areas: {
      work: "a role that feels confining, or limiting beliefs about your abilities",
      love: "feeling stuck in a dynamic, or afraid to ask for what you need",
      self: "anxiety, rumination, and the stories that keep you small",
    },
  },
  {
    tone: -1.5,
    upright: {
      keywords: ["anxiety", "worry", "sleepless nights"],
      meaning:
        "The Nine of Swords sits up in the dark, head in hands. It speaks of anxiety, guilt, and worry that grows louder at night: fears that often feel far heavier in the mind than they turn out to be in reality.",
      theme: "anxiety and worry that loom larger in the mind than in reality",
      advice: "Write the worry down in full, then write the most likely outcome next to it. Share it with someone in daylight.",
      question: "Which of your worries is about something that has actually happened?",
    },
    reversed: {
      keywords: ["easing anxiety", "hope", "facing fears"],
      meaning:
        "Reversed, the night begins to end. Anxiety may be easing as you reach out for support or face your fears. If ignored, though, it may be deepening into something that needs more care.",
      theme: "anxiety beginning to ease as fears are brought into the light",
      advice: "Reach out for support, whether a friend, a professional, or a practice that calms your nervous system. You do not have to handle this alone.",
      question: "What support would make this worry lighter to carry?",
    },
    areas: {
      work: "stress, overthinking, or fear of failure that keeps you up at night",
      love: "insecurity, guilt, or worry about a relationship",
      self: "mental health, rest, and the need for gentle support",
    },
  },
  {
    tone: -2,
    upright: {
      keywords: ["painful ending", "rock bottom", "release"],
      meaning:
        "The Ten of Swords is a dramatic ending, but the sky behind it is already lightening. It marks the point where something has truly run its course: painful and final, and also a release from waiting for the worst to happen.",
      theme: "a painful but definitive ending, with dawn already on the horizon",
      advice: "Acknowledge that this is over. Stop reopening the wound, and let the ending become the ground you stand on.",
      question: "Now that the worst has happened, what is no longer holding you back?",
    },
    reversed: {
      keywords: ["recovery", "survival", "resisting an ending"],
      meaning:
        "Reversed, you are getting back up. It suggests recovery, regeneration, and the hard-won knowledge that you survived, or a reluctance to accept an ending that has already occurred.",
      theme: "recovery after a low point, or reluctance to accept an ending",
      advice: "Take stock of what survived. Rebuild slowly, starting with your daily routine and one person you trust.",
      question: "What strength did you discover in getting through this?",
    },
    areas: {
      work: "a job loss, a failed venture, or the end of a difficult chapter",
      love: "a painful breakup, or the definitive end of a cycle",
      self: "hitting bottom, and the first steps of recovery",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["curiosity", "vigilance", "new ideas"],
      meaning:
        "The Page of Swords is alert, curious, and eager to learn. It represents a sharp mind exploring new ideas, asking questions, and watching closely, though sometimes speaking before thinking.",
      theme: "sharp curiosity and an eagerness to learn and ask questions",
      advice: "Ask the questions you are curious about. Research before you commit, and listen as carefully as you speak.",
      question: "What do you want to understand better before you decide?",
    },
    reversed: {
      keywords: ["gossip", "scattered thinking", "defensiveness"],
      meaning:
        "Reversed, curiosity turns restless or careless. There may be gossip, hasty words, plenty of talk with little action, or a defensive need to be right.",
      theme: "restless thinking that drifts into gossip, haste, or defensiveness",
      advice: "Pause before replying. Check whether you are trying to understand or trying to win.",
      question: "Are you looking for the truth, or for confirmation?",
    },
    areas: {
      work: "learning a new skill, research, or a new idea to explore",
      love: "honest questions, curiosity, or nervous communication",
      self: "intellectual exploration and a hunger for knowledge",
    },
  },
  {
    tone: 0,
    upright: {
      keywords: ["ambition", "speed", "decisive action"],
      meaning:
        "The Knight of Swords charges headlong into the wind. He represents fast, focused action driven by ideas and conviction: a powerful force that can achieve a great deal, but may overlook consequences in its haste.",
      theme: "fast, decisive action driven by conviction",
      advice: "Move quickly where speed matters, but take one moment to consider who might be affected along the way.",
      question: "Is this the moment for speed, or for strategy?",
    },
    reversed: {
      keywords: ["recklessness", "impatience", "burnout"],
      meaning:
        "Reversed, momentum becomes recklessness. Impatience, aggression, or scattered energy may lead to rushed decisions, tactless words, or burnout.",
      theme: "momentum that has turned reckless or scattered",
      advice: "Slow down enough to plan. A decision made a day later is often better than one made in anger.",
      question: "What are you rushing toward, or away from?",
    },
    areas: {
      work: "rapid progress, a competitive push, or acting quickly on an idea",
      love: "passionate pursuit, blunt honesty, or impatience in a relationship",
      self: "drive, conviction, and learning when to slow down",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["clear judgement", "independence", "honesty"],
      meaning:
        "The Queen of Swords raises her blade with a clear, unflinching gaze. She represents independent thought, honest communication, and judgement shaped by experience: perceptive, fair, and not easily deceived.",
      theme: "clear, independent judgement and honest communication",
      advice: "Say what you see, kindly and directly. Trust your own discernment over the pressure to please.",
      question: "What do you know from experience that you can trust here?",
    },
    reversed: {
      keywords: ["coldness", "harshness", "bitterness"],
      meaning:
        "Reversed, clarity turns cold. Honesty may become harshness, independence may become isolation, and past wounds may be making judgement bitter or overly critical.",
      theme: "clarity that has turned cold, critical, or guarded",
      advice: "Let warmth back in. You can be honest and kind at the same time.",
      question: "Where has protecting yourself made you harder than you want to be?",
    },
    areas: {
      work: "sharp analysis, clear boundaries, and principled decisions",
      love: "honest communication, independence, and clear expectations",
      self: "discernment and the wisdom gained from hard experience",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["intellect", "authority", "principle"],
      meaning:
        "The King of Swords rules through reason. He represents intellectual authority, ethical judgement, and clear communication: the ability to make decisions grounded in logic and principle rather than emotion or pressure.",
      theme: "principled reasoning and intellectual authority",
      advice: "Base your decision on clear reasoning and your principles. Explain your logic so others can follow it.",
      question: "What does a fair, logical view of this situation suggest?",
    },
    reversed: {
      keywords: ["manipulation", "rigidity", "abuse of power"],
      meaning:
        "Reversed, intellect is misused. Reasoning may become cold, rigid, or manipulative, and authority may be used to dominate rather than to clarify.",
      theme: "reasoning bent toward control, coldness, or manipulation",
      advice: "Check whether your logic is serving the truth or just your position. Invite someone to challenge it.",
      question: "Is your reasoning serving the truth, or protecting your position?",
    },
    areas: {
      work: "strategy, expertise, and leadership based on clear thinking",
      love: "rational communication, or emotional distance in a relationship",
      self: "mental discipline and integrity of thought",
    },
  },
];
