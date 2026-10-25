import type { CardContent } from "@/domain/types";

/** Wands — fire: drive, creativity, ambition. Ace … Ten, Page, Knight, Queen, King. */
export const WANDS: readonly CardContent[] = [
  {
    tone: 2,
    upright: {
      keywords: ["inspiration", "potential", "spark"],
      meaning:
        "The Ace of Wands is a spark of pure potential: a new idea, a burst of enthusiasm, or a creative or professional opportunity that wants to grow. The energy is available; the question is where you will direct it.",
      theme: "a spark of inspiration and new creative potential",
      advice: "Act on the idea while the energy is fresh. Take one concrete step toward it today.",
      question: "What idea makes you feel most alive right now?",
    },
    reversed: {
      keywords: ["delays", "lack of direction", "fizzling energy"],
      meaning:
        "Reversed, the spark struggles to catch. Enthusiasm may fade quickly, ideas may lack direction, or obstacles may be delaying a start you are eager to make.",
      theme: "a spark that struggles to catch, with energy but no direction",
      advice: "Clarify why this matters to you. A clear reason will rekindle more energy than motivation alone.",
      question: "What is getting in the way of starting?",
    },
    areas: {
      work: "a new venture, a promising opportunity, or a creative project",
      love: "fresh attraction, passion, or new energy in a relationship",
      self: "renewed motivation and a sense of purpose",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["planning", "decisions", "wider horizons"],
      meaning:
        "The Two of Wands holds the world in one hand while looking out to the horizon. It speaks of planning, ambition, and the decision to move beyond familiar territory toward a larger vision.",
      theme: "planning for a larger vision beyond familiar ground",
      advice: "Map out the bigger plan, then choose the first decision that commits you to it.",
      question: "What would you plan if you allowed yourself to think bigger?",
    },
    reversed: {
      keywords: ["fear of the unknown", "overplanning", "playing safe"],
      meaning:
        "Reversed, the horizon feels intimidating. You may be playing it safe, planning endlessly without acting, or holding back from a larger vision out of fear of the unknown.",
      theme: "a larger vision held back by fear or endless planning",
      advice: "Choose a deadline for your planning phase. After it passes, act on the best plan you have.",
      question: "What is the comfortable option costing you?",
    },
    areas: {
      work: "career planning, expansion, or a decision about future direction",
      love: "planning a future together, or deciding whether to commit",
      self: "personal vision and stepping outside your comfort zone",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["expansion", "foresight", "progress"],
      meaning:
        "In the Three of Wands, the ships are already on the water. Plans are in motion, and the card speaks of expansion, foresight, and the anticipation of results: a moment to look ahead with confidence.",
      theme: "plans in motion and confident expansion toward the horizon",
      advice: "Stay alert to the opportunities your efforts are creating. Prepare for the next stage before it arrives.",
      question: "What are you building toward, and how will you know it has arrived?",
    },
    reversed: {
      keywords: ["setbacks", "frustration", "limited vision"],
      meaning:
        "Reversed, results take longer than hoped. There may be delays, frustration, or a sense that plans are too limited, or too sprawling, to succeed as they are.",
      theme: "progress delayed, or plans that need to be rescaled",
      advice: "Review your plan against what has actually happened. Adjust the timeline instead of abandoning the goal.",
      question: "What has this delay revealed about your plan?",
    },
    areas: {
      work: "growth, long-range plans, and early results",
      love: "a relationship expanding, or planning a shared adventure",
      self: "a broader perspective and confidence about the future",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["celebration", "home", "milestones"],
      meaning:
        "The Four of Wands raises a garland between four posts. It celebrates milestones, homecomings, and stable foundations: a moment of joy and security worth sharing with the people around you.",
      theme: "a joyful milestone and the stability of a secure foundation",
      advice: "Mark this milestone. Gather people, share the moment, and enjoy the foundation you have built.",
      question: "What foundation have you built that deserves celebration?",
    },
    reversed: {
      keywords: ["instability", "transition", "lack of support"],
      meaning:
        "Reversed, the foundation feels less secure. There may be tension at home, a delayed celebration, or a sense of not belonging where you hoped you would.",
      theme: "a shaky foundation, or a celebration that feels out of reach",
      advice: "Strengthen one support structure, such as a routine, a relationship, or a living situation, before taking on anything new.",
      question: "Where do you feel most at home, and what would make it more stable?",
    },
    areas: {
      work: "a successful launch, a team milestone, or a positive working environment",
      love: "commitment, moving in together, or celebrating a bond",
      self: "a sense of home, belonging, and stability",
    },
  },
  {
    tone: -1,
    upright: {
      keywords: ["competition", "friction", "disagreement"],
      meaning:
        "The Five of Wands is a clash of energies. Everyone has a point of view and nobody is listening: it describes competition, friction, and conflict that can be creative but is often simply exhausting.",
      theme: "competing energies and friction without coordination",
      advice: "Look for the shared goal beneath the disagreement, and propose a way to coordinate rather than compete.",
      question: "What would change if everyone involved wanted the same outcome?",
    },
    reversed: {
      keywords: ["avoiding conflict", "resolution", "inner tension"],
      meaning:
        "Reversed, the conflict changes form. You may be avoiding a necessary disagreement, finding resolution after a period of friction, or struggling with conflicting desires within yourself.",
      theme: "conflict that is either resolving or being avoided",
      advice: "If the disagreement matters, address it openly and respectfully. If it does not, let it go completely.",
      question: "Which conflict are you avoiding, and why?",
    },
    areas: {
      work: "competition, clashing opinions, or a chaotic team dynamic",
      love: "petty arguments, or differing priorities",
      self: "inner conflict between competing goals",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["recognition", "victory", "confidence"],
      meaning:
        "The Six of Wands rides through the crowd wearing a laurel wreath. It represents recognition, public success, and the confidence that comes from having your efforts acknowledged by others.",
      theme: "recognised success and well-earned confidence",
      advice: "Accept the recognition graciously. Share the credit, and use the momentum to take your next step.",
      question: "How do you let yourself receive recognition?",
    },
    reversed: {
      keywords: ["self-doubt", "going unrecognised", "arrogance"],
      meaning:
        "Reversed, the parade falters. You may feel unrecognised, doubt your accomplishments, or rely too heavily on other people's approval, or success may be turning into arrogance.",
      theme: "success that is either unrecognised or overly dependent on approval",
      advice: "Define success in your own terms, and acknowledge your progress even if no one else does.",
      question: "Whose approval are you waiting for?",
    },
    areas: {
      work: "a promotion, public recognition, or a successful outcome",
      love: "pride in a relationship, or feeling appreciated",
      self: "self-confidence and acknowledging your achievements",
    },
  },
  {
    tone: 0.5,
    upright: {
      keywords: ["perseverance", "defence", "conviction"],
      meaning:
        "In the Seven of Wands, one figure holds the high ground against many. It speaks of conviction, perseverance, and the courage to defend your position when it is challenged.",
      theme: "standing your ground and defending what you believe in",
      advice: "Hold your position if you believe in it. Clarify your boundaries and stop re-arguing settled points.",
      question: "What is worth defending here, and what can you let go?",
    },
    reversed: {
      keywords: ["overwhelm", "giving up", "defensiveness"],
      meaning:
        "Reversed, the defence wears thin. You may feel overwhelmed by challenges, tempted to give up, or so defensive that you are fighting battles that do not need to be fought.",
      theme: "a defence that has become exhausting or overly defensive",
      advice: "Choose the one position that truly matters and concede the rest. Not every challenge needs a response.",
      question: "Which of these battles is actually yours?",
    },
    areas: {
      work: "competition, defending your ideas, or holding a hard-won position",
      love: "standing up for the relationship, or for your own needs within it",
      self: "conviction, resilience, and healthy boundaries",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["momentum", "speed", "swift progress"],
      meaning:
        "The Eight of Wands flies through open air. It brings speed, momentum, and swift progress: news arriving, plans accelerating, and events moving quickly toward their destination.",
      theme: "swift momentum, with events moving quickly toward their destination",
      advice: "Be ready to respond quickly. Clear your schedule enough to take advantage of the momentum.",
      question: "What is ready to move, if you stop holding it back?",
    },
    reversed: {
      keywords: ["delays", "frustration", "haste"],
      meaning:
        "Reversed, momentum stalls or turns chaotic. There may be delays, miscommunication, or haste that creates mistakes: energy without a clear target.",
      theme: "stalled momentum, or haste that creates mistakes",
      advice: "Slow down to check your direction. Clarify messages before sending them.",
      question: "Where is rushing creating more delay?",
    },
    areas: {
      work: "rapid progress, travel, or a fast-moving project",
      love: "a whirlwind romance, or quick developments",
      self: "momentum, and acting while the energy is high",
    },
  },
  {
    tone: 0,
    upright: {
      keywords: ["resilience", "persistence", "guardedness"],
      meaning:
        "The Nine of Wands leans on one staff, bandaged but still standing. It speaks of resilience and persistence near the end of a long struggle, and of a guardedness that comes from having been tested.",
      theme: "battle-worn resilience near the end of a long effort",
      advice: "Keep going, because you are closer than it feels. Protect your energy, but do not let past setbacks make you suspicious of every new step.",
      question: "What has this struggle taught you about your own endurance?",
    },
    reversed: {
      keywords: ["exhaustion", "suspicion", "giving up"],
      meaning:
        "Reversed, endurance gives way to exhaustion. You may be too worn down to continue as you are, or so guarded that you are treating help as a threat.",
      theme: "exhaustion and guardedness after a long fight",
      advice: "Accept help. Rest is not surrender, and letting someone in may be the reinforcement you need.",
      question: "What would let you lower your guard, even slightly?",
    },
    areas: {
      work: "persevering through a difficult project, or burnout after a long push",
      love: "guardedness after past hurt, or protecting what you have",
      self: "resilience, boundaries, and knowing when to rest",
    },
  },
  {
    tone: -1,
    upright: {
      keywords: ["burden", "responsibility", "overload"],
      meaning:
        "The Ten of Wands carries more than anyone should. It describes heavy responsibility and overload: the weight of commitments taken on one by one until they obscure the way forward.",
      theme: "an accumulated burden of responsibility that obscures the way forward",
      advice: "Put the load down and look at it. Delegate, postpone, or drop at least one responsibility.",
      question: "Which of these burdens were you never meant to carry alone?",
    },
    reversed: {
      keywords: ["release", "delegation", "breaking point"],
      meaning:
        "Reversed, the load is either set down or about to fall. You may be learning to delegate and release burdens, or nearing a breaking point if nothing changes.",
      theme: "a burden that is being released, or one about to collapse",
      advice: "Decide what to put down before circumstances decide for you.",
      question: "What would happen if you stopped carrying all of this?",
    },
    areas: {
      work: "overwork, too many responsibilities, or a project finishing under strain",
      love: "one partner carrying too much, or feeling burdened by obligations",
      self: "learning to ask for help and set limits",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["enthusiasm", "exploration", "free spirit"],
      meaning:
        "The Page of Wands gazes at a sprouting staff with wide-eyed enthusiasm. It represents curiosity, adventure, and the excitement of discovering a new passion: a message or idea that sets you alight.",
      theme: "enthusiastic curiosity and the excitement of a new passion",
      advice: "Explore freely. Try the new thing without needing to know where it leads.",
      question: "What excites you that you have not yet allowed yourself to explore?",
    },
    reversed: {
      keywords: ["impatience", "lack of direction", "hesitation"],
      meaning:
        "Reversed, enthusiasm burns out quickly or never takes off. There may be impatience, distraction, or many new beginnings with few follow-throughs.",
      theme: "enthusiasm that burns out quickly or lacks direction",
      advice: "Choose one passion and give it consistent attention for a month before starting anything else.",
      question: "What would you finish, if you stayed with it?",
    },
    areas: {
      work: "a new direction, an exciting opportunity, or creative exploration",
      love: "a flirtatious, adventurous beginning",
      self: "discovering a passion and following your curiosity",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["passion", "adventure", "boldness"],
      meaning:
        "The Knight of Wands charges ahead with fiery confidence. He embodies passion, adventure, and bold action: inspiring and energising, though sometimes impulsive.",
      theme: "bold, passionate action and an appetite for adventure",
      advice: "Act boldly on what excites you, but plan enough to finish what you start.",
      question: "What would you do if you were a little bolder?",
    },
    reversed: {
      keywords: ["impulsiveness", "recklessness", "frustration"],
      meaning:
        "Reversed, passion becomes impulsiveness. Haste, restlessness, or a short temper may lead to unfinished projects, rash decisions, or burnt bridges.",
      theme: "passion that has become impulsive or restless",
      advice: "Before acting on impulse, wait one day. If the idea still excites you tomorrow, go.",
      question: "Is this courage, or just restlessness?",
    },
    areas: {
      work: "a bold move, a new venture, or ambitious action",
      love: "a passionate, adventurous romance, perhaps a short-lived one",
      self: "courage, spontaneity, and energy for change",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["confidence", "warmth", "determination"],
      meaning:
        "The Queen of Wands holds a sunflower and a staff, with a black cat at her feet. She embodies confidence, charisma, and warm determination: someone who knows her worth and lights up the room without dimming anyone else.",
      theme: "warm confidence and magnetic, determined energy",
      advice: "Show up fully as yourself. Speak with confidence and let your enthusiasm lead.",
      question: "Where are you dimming your light to make others comfortable?",
    },
    reversed: {
      keywords: ["insecurity", "jealousy", "burnout"],
      meaning:
        "Reversed, confidence wavers. Insecurity, jealousy, or demandingness may surface, or you may be overextending yourself until your energy runs out.",
      theme: "confidence shaken by insecurity, jealousy, or exhaustion",
      advice: "Reconnect with what you are good at. Spend a little time doing something that makes you feel capable.",
      question: "What would restore your confidence from within?",
    },
    areas: {
      work: "leadership, visibility, and confident self-promotion",
      love: "warmth, attraction, and a vibrant partnership",
      self: "self-assurance and creative vitality",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["vision", "leadership", "enterprise"],
      meaning:
        "The King of Wands sees the big picture and inspires others to build it. He represents visionary leadership, entrepreneurial spirit, and the ability to turn bold ideas into lasting achievements.",
      theme: "visionary leadership that turns bold ideas into reality",
      advice: "Articulate your vision clearly and invite others into it. Lead by example.",
      question: "What vision are you ready to take responsibility for?",
    },
    reversed: {
      keywords: ["impulsiveness", "domineering", "unrealistic expectations"],
      meaning:
        "Reversed, vision becomes ego. Leadership may turn domineering, expectations may be unrealistic, or impulsive decisions may undermine long-term goals.",
      theme: "vision that has turned domineering or unrealistic",
      advice: "Listen to the people who will carry out your plans. Adjust the vision to what is achievable.",
      question: "Is your vision leaving room for other people?",
    },
    areas: {
      work: "entrepreneurship, visionary leadership, or taking the lead on a big project",
      love: "a passionate, protective partner, or the need to share control",
      self: "personal leadership and owning your ambitions",
    },
  },
];
