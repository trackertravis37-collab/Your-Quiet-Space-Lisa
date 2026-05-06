export type OverwhelmChoice = "overwhelmed" | "tired" | "numb";

export type MusicTrack = {
  id: string;
  title: string;
  fileName: string;
  credit: string;
  license: string;
};

export type QuietContent = {
  title: string;
  music: {
    label: string;
    defaultTrackId: string;
    tracks: MusicTrack[];
    byChoice: Partial<Record<OverwhelmChoice, string>>; // maps choice -> trackId
    note: string;
  };
  steps: {
    landing: { intro: string[]; cta: string };
    hug: { title: string; text: string[]; cta: string };
    notYourWeight: { text: string[] };
    familyTrying: { text: string[] };
    feelsLikeYou: {
      prompt: string;
      buttons: { key: OverwhelmChoice; label: string; response: string[] }[];
    };
    grounding: {
      title: string;
      intro: string[];
      prompts: { key: string; label: string; hint: string }[];
      done: string[];
    };
    memoryLights: { hint: string; reveals: string[] };
    invisibleMessage: { prompt: string; hiddenLines: string[] };
    journal: {
      title: string;
      intro: string[];
      placeholder: string;
      afterSave: string[];
    };
    ambience: { title: string; subtitle: string };
    window: { title: string; text: string[] };
    trip: { title: string; text: string[] };
    sitWithMe: { cta: string; after: string[] };
    openWhen: {
      title: string;
      items: { title: string; body: string[] }[];
    };
    timeBased: {
      title: string;
      morning: string[];
      night: string[];
    };
    final: { text: string[] };
    ending: { text: string[]; cta: string };
    bridge: { text: string[] };
  };
};

export const defaultContent: QuietContent = {
  title: "A Quiet Place for Lisa",
  music: {
    label: "Play",
    defaultTrackId: "calm",
    tracks: [
      {
        id: "calm",
        title: "The Long Dark (Ambient Neoclassical Piano)",
        fileName: "calm.mp3",
        credit: "Scott Buckley",
        license: "CC BY 3.0 (see Wikimedia Commons file page)",
      },
      {
        id: "uplift",
        title: "Soft Corporate",
        fileName: "uplift.mp3",
        credit: "MusicLFiles",
        license: "CC BY 4.0",
      },
      {
        id: "comfort",
        title: "Snowdrop",
        fileName: "comfort.mp3",
        credit: "Kevin MacLeod (incompetech.com)",
        license: "CC BY 3.0 US",
      },
    ],
    byChoice: {
      overwhelmed: "calm",
      tired: "uplift",
      numb: "comfort",
    },
    note: "Music changes depending on what she picks. Replace any MP3 in /public if you want different songs.",
  },
  steps: {
    landing: {
      intro: [
        "Hey Lisa…",
        "If this day has felt heavy, you don’t have to carry it perfectly.",
        "Not the kind of heavy you can explain in one sentence…",
        "but the kind that sits on your chest and makes everything feel louder.",
        "You don’t have to figure everything out right now.",
        "You don’t have to be strong every second.",
        "Just being here is enough for now.",
      ],
      cta: "Take a breath",
    },
    notYourWeight: {
      text: [
        "None of this is your fault.",
        "Not the parts that changed without your permission.",
        "Not the tension at home.",
        "Not the pressure your sister is under.",
        "Not the way you’re expected to keep it together when you’re still learning how.",
        "You were never meant to carry all of that.",
        "You’re allowed to just be Lisa…",
        "not the one who fixes everything.",
      ],
    },
    familyTrying: {
      text: [
        "Things feel unstable right now, I know.",
        "Your mom is hurting in her own way.",
        "Your sister is trying to hold everything together.",
        "And you… you’re right in the middle of it all, feeling everything at once.",
        "That’s not weakness.",
        "That’s someone who cares deeply.",
        "And caring deeply can be exhausting.",
      ],
    },
    hug: {
      title: "Hi Lisa — you’re gonna be fine",
      text: [
        "I’m not here to make you explain anything.",
        "Just a small reminder: you’re safe in this moment.",
        "Come here for a second.",
      ],
      cta: "Hug",
    },
    feelsLikeYou: {
      prompt: "If this feels like you…",
      buttons: [
        {
          key: "overwhelmed",
          label: "I feel overwhelmed",
          response: [
            "It makes sense.",
            "When everything stacks up at once, it can feel like you’re drowning.",
            "But you don’t have to swim the whole ocean today.",
            "Just float for a bit.",
          ],
        },
        {
          key: "tired",
          label: "I feel tired",
          response: [
            "Of course you’re tired.",
            "You’ve been holding a lot inside, quietly.",
            "Rest doesn’t mean you’re giving up.",
            "It means you’re human—and your body is asking for kindness.",
          ],
        },
        {
          key: "numb",
          label: "I feel numb",
          response: [
            "Sometimes your mind turns the volume down to protect you.",
            "That doesn’t mean you don’t care.",
            "It means you’ve been feeling too much for too long.",
            "We can start gently. No pressure.",
          ],
        },
      ],
    },
    grounding: {
      title: "Let’s come back to the room",
      intro: [
        "No big solutions—just a tiny reset.",
        "Tap each card and name one thing. Even if it’s small.",
      ],
      prompts: [
        { key: "5", label: "5 things you can see", hint: "Light, a corner, a shape, a color…" },
        { key: "4", label: "4 things you can feel", hint: "Your shirt, the chair, your hair…" },
        { key: "3", label: "3 things you can hear", hint: "A fan, birds, distant voices…" },
        { key: "2", label: "2 things you can smell", hint: "Soap, food, air…" },
        { key: "1", label: "1 thing you can tell yourself", hint: "I’m safe right now. I’m doing my best." },
      ],
      done: [
        "That’s enough.",
        "You did something kind for yourself.",
      ],
    },
    memoryLights: {
      hint: "Memory lights — tap the little glows.",
      reveals: [
        "You matter more than your situation.",
        "You are not forgotten.",
        "Even now, you’re still going… and that means something.",
        "You don’t have to earn care. You already deserve it.",
      ],
    },
    invisibleMessage: {
      prompt: "There’s something here for you… move slowly.",
      hiddenLines: [
        "You are doing better than you think.",
        "Even on the days you feel like you’re failing… you’re still here.",
      ],
    },
    journal: {
      title: "Write it out (only if you want)",
      intro: [
        "You don’t have to be polished.",
        "Just type what’s true for you right now.",
      ],
      placeholder: "Right now I feel…\n\nAnd I wish…\n\nOne small thing that might help is…",
      afterSave: [
        "Saved.",
        "You can come back and change it anytime.",
      ],
    },
    ambience: {
      title: "Sound room",
      subtitle: "Mix a little atmosphere. Keep it low. Let your shoulders drop.",
    },
    window: {
      title: "Open a window",
      text: [
        "No pressure to think.",
        "Just watch the world move for a moment.",
      ],
    },
    trip: {
      title: "A short trip",
      text: [
        "Just a gentle little journey.",
        "Hold left or right and let your brain follow something simple.",
      ],
    },
    sitWithMe: {
      cta: "Don’t say anything. Just stay.",
      after: [
        "I’m here.",
        "You don’t have to go through this moment alone.",
      ],
    },
    openWhen: {
      title: "Open when…",
      items: [
        {
          title: "Open when it’s too much",
          body: [
            "When everything feels like it’s crashing at once…",
            "pause.",
            "You are one person.",
            "You are allowed to take things one piece at a time.",
          ],
        },
        {
          title: "Open when you can’t sleep",
          body: [
            "I know your mind won’t slow down.",
            "But tonight, you don’t have to solve anything.",
            "Just rest your thoughts… even if sleep doesn’t come easily.",
          ],
        },
        {
          title: "Open when you feel alone",
          body: [
            "You might feel like no one fully understands…",
            "but you’re not invisible.",
            "You’re not alone in this.",
            "I see you.",
          ],
        },
      ],
    },
    timeBased: {
      title: "Right now",
      morning: [
        "You made it to a new day.",
        "That’s already something to be proud of.",
      ],
      night: [
        "You made it through today.",
        "Even if it was hard… you did.",
      ],
    },
    final: {
      text: [
        "I know I can’t fix what’s happening around you.",
        "I can’t take away the pressure or make things suddenly easy.",
        "But I want you to know this…",
        "You’re not alone in this, even if it feels like it sometimes.",
        "I care about you… not just when things are okay,",
        "but especially when they aren’t.",
        "You don’t have to pretend to be strong with me.",
        "If all you did today was get through it…",
        "that’s enough.",
      ],
    },
    ending: {
      text: [
        "If you made it this far…",
        "it means you stayed.",
        "And that matters more than you think.",
      ],
      cta: "Come back anytime",
    },
    bridge: {
      text: [
        "When you’re done here…",
        "text me “🌙” so I know you made it through.",
      ],
    },
  },
};
