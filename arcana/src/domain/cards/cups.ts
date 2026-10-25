import type { CardContent } from "@/domain/types";

/** Cups — water: feeling, relationships, intuition. Ace … Ten, Page, Knight, Queen, King. */
export const CUPS: readonly CardContent[] = [
  {
    tone: 2,
    upright: {
      keywords: ["new feelings", "openness", "compassion"],
      meaning:
        "The Ace of Cups overflows. It marks the beginning of something emotional: a new relationship, a renewed capacity for love or creativity, or a wave of compassion that arrives freely and asks to be received.",
      theme: "an emotional beginning and a heart open to receiving",
      advice: "Let yourself feel what is arriving without immediately analysing it. Say yes to an invitation that warms you.",
      question: "What would it mean to receive without first earning it?",
    },
    reversed: {
      keywords: ["blocked emotion", "emptiness", "guardedness"],
      meaning:
        "Reversed, the cup is tipped or held closed. Feelings may be suppressed, love may be withheld out of fear, or you may be pouring yourself out without being refilled.",
      theme: "feelings held back, or a heart emptied without being refilled",
      advice: "Name one emotion you have been holding down. Give it a safe place to be expressed: a conversation, a page, a long walk.",
      question: "What feeling have you been trying not to feel?",
    },
    areas: {
      work: "creative inspiration, or work that genuinely moves you",
      love: "a new romance, or a fresh openness in an existing bond",
      self: "emotional renewal and self-compassion",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["partnership", "mutual respect", "attraction"],
      meaning:
        "In the Two of Cups, two people meet as equals and exchange something real. It signals mutual attraction, partnership, reconciliation, or a connection built on recognition and respect.",
      theme: "a mutual connection built on equality and recognition",
      advice: "Meet the other person halfway. Make the gesture that shows you value the connection.",
      question: "What does this connection offer you, and what do you offer it?",
    },
    reversed: {
      keywords: ["imbalance", "disconnection", "misunderstanding"],
      meaning:
        "Reversed, the exchange falters. One side may be giving more than the other, communication may have broken down, or a partnership is drifting out of alignment.",
      theme: "a partnership out of balance or drifting apart",
      advice: "Ask, rather than assume, what the other person needs. Share plainly what you need in return.",
      question: "Where has the give-and-take in this relationship become uneven?",
    },
    areas: {
      work: "a promising partnership, a collaborator, or a reconciliation with a colleague",
      love: "mutual attraction, a new couple, or a deepening bond",
      self: "harmony between what you feel and how you act",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["celebration", "friendship", "community"],
      meaning:
        "The Three of Cups raises a toast. It celebrates friendship, community, and shared joy: the support of people who are glad you exist, and moments that are better because they are shared.",
      theme: "shared celebration and the support of friends and community",
      advice: "Reach out to your people. Share the good news, or create a reason to gather.",
      question: "Who celebrates you, and when did you last celebrate them?",
    },
    reversed: {
      keywords: ["overindulgence", "isolation", "gossip"],
      meaning:
        "Reversed, the gathering loses its warmth. It can point to overindulgence, social friction, a third party creating tension, or feeling left out of a circle you once belonged to.",
      theme: "social friction, excess, or a sense of being left out",
      advice: "Choose depth over volume: spend time with one person who truly knows you instead of trying to keep up with everyone.",
      question: "Which relationships nourish you, and which simply fill your time?",
    },
    areas: {
      work: "team success, collaboration, and networking that feels genuine",
      love: "joyful times together, and the wider circle of friends around you",
      self: "belonging, play, and the healing power of community",
    },
  },
  {
    tone: -0.5,
    upright: {
      keywords: ["apathy", "contemplation", "missed offers"],
      meaning:
        "In the Four of Cups, someone sits with arms crossed, unmoved by what is offered. It describes withdrawal, boredom, or dissatisfaction: a period of turning inward that can be restorative, but that may also let an opportunity pass unnoticed.",
      theme: "inward withdrawal that may be overlooking what is being offered",
      advice: "Look again at what is already in front of you. Something you dismissed may deserve a second look.",
      question: "What are you not seeing because you have already decided it will not help?",
    },
    reversed: {
      keywords: ["re-engagement", "awareness", "new motivation"],
      meaning:
        "Reversed, the stillness breaks. You may be emerging from apathy, noticing an opportunity you previously ignored, or deciding that you are ready to engage with life again.",
      theme: "renewed interest after a period of withdrawal",
      advice: "Act on the first spark of interest you feel, even if it is small. Momentum will build from there.",
      question: "What has recently caught your attention after a long while of feeling flat?",
    },
    areas: {
      work: "disengagement, boredom, or an offer that deserves another look",
      love: "emotional distance, or taking a partner for granted",
      self: "a period of reflection that risks becoming stagnation",
    },
  },
  {
    tone: -1.5,
    upright: {
      keywords: ["grief", "regret", "loss"],
      meaning:
        "The Five of Cups mourns what has spilled. It describes loss, disappointment, and regret, while reminding you, quietly, that two cups still stand behind you, waiting to be noticed.",
      theme: "grief over what was lost, with something of value still remaining",
      advice: "Allow yourself to grieve honestly. When you are ready, turn around and take stock of what is still standing.",
      question: "What remains that you have not yet allowed yourself to see?",
    },
    reversed: {
      keywords: ["acceptance", "recovery", "moving on"],
      meaning:
        "Reversed, the mourning begins to ease. Acceptance arrives, forgiveness becomes possible, and attention gradually returns to what remains and what can still be built.",
      theme: "acceptance after loss, and a gradual turn toward what remains",
      advice: "Honour the loss with one deliberate act of closure, then make one small plan for what comes next.",
      question: "What have you learned from this loss that you want to carry forward?",
    },
    areas: {
      work: "a setback, a failed project, or disappointment about how things turned out",
      love: "heartbreak, regret, or the need to forgive",
      self: "grief work and the slow return of hope",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["nostalgia", "innocence", "kindness"],
      meaning:
        "The Six of Cups offers a gift from the past. It evokes nostalgia, childhood memories, and simple kindness: the return of an old friend, a familiar place, or a gentler way of being.",
      theme: "the comfort of memory and simple, uncomplicated kindness",
      advice: "Reconnect with something that once made you happy without effort. Offer a small kindness without expecting anything in return.",
      question: "What from your past is worth bringing into your present?",
    },
    reversed: {
      keywords: ["living in the past", "idealisation", "outgrowing"],
      meaning:
        "Reversed, nostalgia may be holding you back. The past can become an idealised refuge from the present, or this may be the moment to finally outgrow an old story about who you are.",
      theme: "a past that is either idealised or ready to be outgrown",
      advice: "Notice whether looking back is comforting you or keeping you stuck. Keep the memory, and release the expectation.",
      question: "Are you remembering the past as it was, or as you wish it had been?",
    },
    areas: {
      work: "returning to an old skill, a former employer, or the work you loved as a child",
      love: "an old flame, shared memories, or tenderness in a long bond",
      self: "reconnecting with simple joys and your younger self",
    },
  },
  {
    tone: -0.5,
    upright: {
      keywords: ["wishful thinking", "options", "illusion"],
      meaning:
        "The Seven of Cups floats many tempting visions at once. It speaks of choice, imagination, and wishful thinking: a moment when possibilities multiply, though not all of them are as solid as they look.",
      theme: "many tempting options, some of them more fantasy than substance",
      advice: "Test your favourite option against reality: what would it cost, and what would the first week of it actually look like?",
      question: "Which of these possibilities would still appeal if you knew all the details?",
    },
    reversed: {
      keywords: ["clarity", "decision", "disillusionment"],
      meaning:
        "Reversed, the fog of options clears. You may be cutting through distraction to make a real choice, or experiencing the disappointment of seeing an illusion for what it is.",
      theme: "the clarity that comes from cutting through illusion and choosing",
      advice: "Commit to one option and close the others, at least for now. Focus will reward you more than possibility.",
      question: "Now that the illusions have fallen away, what do you really want?",
    },
    areas: {
      work: "too many projects, career fantasies, or a decision between attractive options",
      love: "idealising a partner, or uncertainty about what you really want",
      self: "daydreaming, distraction, and the need for grounded choices",
    },
  },
  {
    tone: 0,
    upright: {
      keywords: ["walking away", "searching", "letting go"],
      meaning:
        "The Eight of Cups leaves a carefully arranged life behind to look for something deeper. It describes the difficult, often quiet decision to walk away from what no longer fulfils you, even when nothing is obviously wrong.",
      theme: "walking away from what no longer fulfils you, in search of something deeper",
      advice: "Be honest about whether this situation still nourishes you. If it does not, begin preparing your exit with care.",
      question: "What are you staying for, and is it enough?",
    },
    reversed: {
      keywords: ["fear of leaving", "indecision", "returning"],
      meaning:
        "Reversed, you may be torn between staying and leaving: afraid to walk away from something unfulfilling, or returning to it out of habit. It can also mean realising that what you were searching for was closer than you thought.",
      theme: "hesitation between staying and leaving",
      advice: "Write down what would need to change for you to stay wholeheartedly. If nothing realistic comes to mind, that is your answer.",
      question: "What fear is keeping you in place?",
    },
    areas: {
      work: "leaving a job, abandoning a project, or seeking more meaningful work",
      love: "walking away from a relationship that no longer meets your needs",
      self: "a search for a deeper sense of purpose",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["contentment", "satisfaction", "wishes fulfilled"],
      meaning:
        "The Nine of Cups is often called the wish card. It portrays contentment, pleasure, and emotional satisfaction: the experience of getting what you hoped for and allowing yourself to enjoy it.",
      theme: "contentment and the satisfaction of a wish fulfilled",
      advice: "Enjoy what you have achieved, and be specific about what you wish for next.",
      question: "If your wish came true, how would you know it was enough?",
    },
    reversed: {
      keywords: ["dissatisfaction", "excess", "unmet expectations"],
      meaning:
        "Reversed, satisfaction proves elusive. Getting what you wanted may feel empty, expectations may be too high, or pleasure may be standing in for deeper fulfilment.",
      theme: "satisfaction that proves hollow or just out of reach",
      advice: "Separate what you want from what you think you should want. Let go of one wish that belongs to someone else.",
      question: "What would genuinely fulfil you, as opposed to impress others?",
    },
    areas: {
      work: "achieving a goal, recognition, or a well-earned sense of success",
      love: "emotional fulfilment, ease, and enjoyment together",
      self: "gratitude, pleasure, and quiet satisfaction",
    },
  },
  {
    tone: 2,
    upright: {
      keywords: ["harmony", "belonging", "fulfilment"],
      meaning:
        "The Ten of Cups paints a rainbow over home. It represents lasting happiness, family or chosen family, and emotional fulfilment: the sense of belonging in a life that reflects your deepest values.",
      theme: "lasting harmony and a deep sense of belonging",
      advice: "Invest in the relationships that make you feel at home. Make room for the people who matter.",
      question: "What does a fulfilled life look like for you, beyond achievement?",
    },
    reversed: {
      keywords: ["disharmony", "disconnection", "unrealistic ideals"],
      meaning:
        "Reversed, the ideal and the reality are not matching. There may be tension at home, misaligned values, or pressure to maintain an image of harmony that does not reflect how things actually feel.",
      theme: "a gap between the ideal of harmony and how things actually feel",
      advice: "Let go of the picture-perfect version. Have the honest conversation that makes real closeness possible.",
      question: "Whose idea of happiness are you trying to live up to?",
    },
    areas: {
      work: "a supportive team, shared values, and a sustainable balance with home",
      love: "commitment, family, and long-term emotional security",
      self: "contentment rooted in your values and relationships",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["curiosity", "creative spark", "sensitivity"],
      meaning:
        "The Page of Cups is surprised by a fish leaping out of its cup. It represents emotional curiosity, imaginative ideas, and messages from the heart: a gentle invitation to stay open to the unexpected.",
      theme: "emotional curiosity and an unexpected creative spark",
      advice: "Follow an intuitive idea, however whimsical. Express a feeling you would normally keep to yourself.",
      question: "What surprising feeling or idea is asking for your attention?",
    },
    reversed: {
      keywords: ["insecurity", "creative block", "immaturity"],
      meaning:
        "Reversed, the Page's sensitivity turns inward. It can indicate emotional immaturity, creative block, insecurity, or a message that is withheld for fear of how it might be received.",
      theme: "sensitivity turned into insecurity or creative block",
      advice: "Make something small and imperfect, purely for yourself. Let it be bad on purpose.",
      question: "What would you express if you were not afraid of being judged?",
    },
    areas: {
      work: "a new creative idea, an inspiring opportunity, or an offer that touches the heart",
      love: "a sweet message, a crush, or innocent affection",
      self: "intuition, dreams, and creative play",
    },
  },
  {
    tone: 1,
    upright: {
      keywords: ["romance", "imagination", "following the heart"],
      meaning:
        "The Knight of Cups advances slowly, his cup held forward like an offering. He embodies romance, charm, and idealism: someone who acts from the heart and invites others to follow an inspiring vision.",
      theme: "a heartfelt offer made with romance and imagination",
      advice: "Follow what genuinely moves you, but let your actions match your words.",
      question: "What would you pursue if you trusted your heart to lead?",
    },
    reversed: {
      keywords: ["moodiness", "unrealistic ideals", "unreliability"],
      meaning:
        "Reversed, the knight's idealism becomes unreliable. Promises may outrun commitment, moods may set the direction, and romance may be more about the fantasy than the person.",
      theme: "idealism that drifts into moodiness or broken promises",
      advice: "Before committing, ask yourself, or the other person, what this looks like on an ordinary Tuesday.",
      question: "Are you in love with the person, or with the story?",
    },
    areas: {
      work: "a creative proposal, an inspiring idea, or a charming but unreliable collaborator",
      love: "a romantic gesture, an invitation, or an idealistic suitor",
      self: "following an artistic or emotional calling",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["empathy", "emotional depth", "care"],
      meaning:
        "The Queen of Cups sits at the water's edge, holding an ornate, closed cup. She represents compassion, emotional intelligence, and intuitive understanding: the capacity to hold other people's feelings without losing your own centre.",
      theme: "compassion and emotional depth held with a steady centre",
      advice: "Listen with your full attention, to others and to yourself. Offer care that is warm but has clear edges.",
      question: "How can you care deeply without losing yourself?",
    },
    reversed: {
      keywords: ["overwhelm", "codependence", "insecurity"],
      meaning:
        "Reversed, the Queen's empathy is flooded. You may be absorbing other people's emotions, neglecting your own needs, or seeking reassurance from outside instead of trusting your feelings.",
      theme: "empathy that has turned into overwhelm or self-neglect",
      advice: "Before you take care of anyone else today, ask what you need, and give at least some of it to yourself.",
      question: "Whose feelings are you carrying that are not yours to carry?",
    },
    areas: {
      work: "caring work, emotional intelligence in leadership, or creative intuition",
      love: "emotional support, devotion, and deep understanding",
      self: "self-compassion and trusting your feelings",
    },
  },
  {
    tone: 1.5,
    upright: {
      keywords: ["emotional balance", "diplomacy", "calm"],
      meaning:
        "The King of Cups sits steady on his throne amid moving water. He embodies emotional maturity: the ability to stay calm, compassionate, and wise in turbulent situations without denying what he feels.",
      theme: "emotional maturity and calm leadership amid turbulence",
      advice: "Respond rather than react. Take a breath, acknowledge what you feel, and then decide how to act.",
      question: "What would a calm, compassionate response look like here?",
    },
    reversed: {
      keywords: ["suppressed feelings", "volatility", "manipulation"],
      meaning:
        "Reversed, the calm surface hides turbulence. Emotions may be suppressed until they break out, or used to control others, and composure becomes a mask rather than a strength.",
      theme: "composure that masks suppressed or volatile feelings",
      advice: "Find a safe outlet for what you are holding back before it finds its own way out.",
      question: "What are you feeling beneath the composure you show?",
    },
    areas: {
      work: "diplomatic leadership, counselling, or steady management under pressure",
      love: "a mature, supportive partner, or emotional steadiness in a relationship",
      self: "emotional balance and wise self-governance",
    },
  },
];
