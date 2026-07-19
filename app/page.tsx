"use client";

import { Check, Copy, GraduationCap, Lightbulb } from "lucide-react";
import { useMemo, useState } from "react";

const situations = [
  { id: "opinion", label: "Expressing an opinion" },
  { id: "agreeing", label: "Agreeing" },
  { id: "disagreeing", label: "Politely disagreeing" },
  { id: "clarification", label: "Asking for clarification" },
  { id: "response", label: "Responding to another student" },
  { id: "thinkingTime", label: "Asking for thinking time" }
] as const;

const tones = [
  { id: "natural", label: "Natural" },
  { id: "academic", label: "Academic" },
  { id: "simple", label: "Simple and confident" }
] as const;

type SituationId = (typeof situations)[number]["id"];
type ToneId = (typeof tones)[number]["id"];

type Suggestion = {
  id: string;
  expression: string;
  explanation: string;
};

type SuggestionTemplate = {
  expression: (idea: string) => string;
  explanation: string;
};

const suggestionLibrary = {
  opinion: {
    natural: [
      {
        expression: (idea) => `I tend to see ${idea} a little differently.`,
        explanation:
          "It sounds thoughtful and conversational, so you can share a view without sounding too forceful."
      },
      {
        expression: (idea) => `For me, the main issue is how we interpret ${idea}.`,
        explanation:
          "It gives your opinion a clear focus and invites others to discuss the interpretation."
      },
      {
        expression: (idea) => `I wonder if we could also look at ${idea} from another angle.`,
        explanation:
          "It offers an opinion as an opening for discussion, which works well in seminars."
      }
    ],
    academic: [
      {
        expression: (idea) => `I would argue that ${idea} needs a more nuanced reading.`,
        explanation:
          "It uses academic phrasing while showing that your claim is measured rather than absolute."
      },
      {
        expression: (idea) => `One possible interpretation is that ${idea} has wider implications.`,
        explanation:
          "It frames your point as analysis, which is useful when contributing to a scholarly discussion."
      },
      {
        expression: (idea) => `From my perspective, ${idea} raises an important question.`,
        explanation:
          "It makes your stance clear and naturally leads the group toward deeper discussion."
      }
    ],
    simple: [
      {
        expression: (idea) => `I think ${idea} is important here.`,
        explanation:
          "It is direct, clear, and easy to say when you want to enter the conversation confidently."
      },
      {
        expression: (idea) => `My view is that ${idea} changes the discussion.`,
        explanation:
          "It gives your opinion a clear structure without using complicated language."
      },
      {
        expression: (idea) => `I would say ${idea} is the key point.`,
        explanation:
          "It sounds confident and concise, which helps your contribution land quickly."
      }
    ]
  },
  agreeing: {
    natural: [
      {
        expression: () => "I agree with you on that, and I would add one small point.",
        explanation:
          "It shows agreement while giving you space to continue the discussion in your own words."
      },
      {
        expression: (idea) => `That makes sense to me, especially in relation to ${idea}.`,
        explanation:
          "It sounds engaged because you connect your agreement to a specific part of the topic."
      },
      {
        expression: () => "Yes, I see it in a similar way.",
        explanation:
          "It is natural and compact, so it works well when you want to support another speaker."
      }
    ],
    academic: [
      {
        expression: () => "I agree with that interpretation, particularly because it highlights the main tension.",
        explanation:
          "It gives your agreement an analytical reason, which makes it sound more academic."
      },
      {
        expression: (idea) => `I find that point convincing, especially when we consider ${idea}.`,
        explanation:
          "It sounds seminar-ready because it evaluates the point rather than only saying yes."
      },
      {
        expression: () => "That reading seems persuasive to me, and it connects well with the wider argument.",
        explanation:
          "It uses academic vocabulary while keeping the sentence clear and usable."
      }
    ],
    simple: [
      {
        expression: () => "I agree, and I think that point is useful.",
        explanation:
          "It is easy to say and gives a clear positive response to another student."
      },
      {
        expression: () => "That makes sense to me.",
        explanation:
          "It is short, natural, and confident when you want to agree without adding too much."
      },
      {
        expression: () => "Yes, I had a similar thought.",
        explanation:
          "It lets you join the discussion smoothly and prepares the group for your next point."
      }
    ]
  },
  disagreeing: {
    natural: [
      {
        expression: () => "I see your point, but I wonder if there is another way to read it.",
        explanation:
          "It acknowledges the other person first, which keeps the disagreement polite."
      },
      {
        expression: () => "I am not fully sure about that, because the evidence might also suggest something else.",
        explanation:
          "It softens disagreement by showing uncertainty and referring to evidence."
      },
      {
        expression: () => "That is interesting, although I might see the issue slightly differently.",
        explanation:
          "It keeps a respectful tone while making your different view clear."
      }
    ],
    academic: [
      {
        expression: () => "I would be cautious about accepting that conclusion too quickly.",
        explanation:
          "It sounds analytical and careful, which is useful when challenging an argument."
      },
      {
        expression: () => "I take the point, but I think the evidence could be interpreted differently.",
        explanation:
          "It separates respect for the speaker from critique of the evidence."
      },
      {
        expression: () => "I am not entirely convinced by that reading, mainly because it leaves out another factor.",
        explanation:
          "It gives a precise reason for disagreement instead of sounding personal."
      }
    ],
    simple: [
      {
        expression: () => "I see what you mean, but I think there is another point to consider.",
        explanation:
          "It is polite, clear, and easy to use when you want to disagree calmly."
      },
      {
        expression: () => "I am not sure I agree with that.",
        explanation:
          "It is direct enough to be clear, but the phrase 'not sure' makes it softer."
      },
      {
        expression: () => "I understand that view, but I see it differently.",
        explanation:
          "It balances respect and confidence in a simple sentence."
      }
    ]
  },
  clarification: {
    natural: [
      {
        expression: (idea) => `Could you say a little more about what you mean by ${idea}?`,
        explanation:
          "It sounds friendly and gives the speaker a clear chance to explain further."
      },
      {
        expression: () => "Can I check that I have understood you correctly?",
        explanation:
          "It is polite because it puts the focus on your understanding rather than on their clarity."
      },
      {
        expression: () => "When you say that, are you referring to the argument or the example?",
        explanation:
          "It asks a focused question, which helps the seminar move forward."
      }
    ],
    academic: [
      {
        expression: () => "Could you clarify how that point connects to the wider argument?",
        explanation:
          "It uses academic language and asks for the relationship between ideas."
      },
      {
        expression: () => "Would you mind expanding on that distinction?",
        explanation:
          "It sounds formal and respectful, especially when discussing concepts or categories."
      },
      {
        expression: () => "Could you specify which part of the reading you are drawing on?",
        explanation:
          "It encourages evidence-based discussion without sounding confrontational."
      }
    ],
    simple: [
      {
        expression: () => "Could you explain that again in a different way?",
        explanation:
          "It is clear and polite, and it gives the speaker a practical request."
      },
      {
        expression: () => "Sorry, could I check what you mean?",
        explanation:
          "It is natural for seminars and helps you ask for help without losing confidence."
      },
      {
        expression: () => "Do you mean the idea itself, or the example?",
        explanation:
          "It offers two options, which makes the clarification easier for others to answer."
      }
    ]
  },
  response: {
    natural: [
      {
        expression: (idea) => `Building on what you said, I think ${idea} connects to the wider topic.`,
        explanation:
          "It credits the previous speaker and then links your contribution to the discussion."
      },
      {
        expression: () => "That makes me think about the question from another perspective.",
        explanation:
          "It sounds collaborative because your response grows from another student's comment."
      },
      {
        expression: () => "I like that point, and I think it also raises a further question.",
        explanation:
          "It responds positively while opening a new direction for the seminar."
      }
    ],
    academic: [
      {
        expression: () => "Building on that contribution, I would connect this to the broader debate.",
        explanation:
          "It is formal enough for academic discussion and shows continuity between ideas."
      },
      {
        expression: () => "That point helps frame the issue in terms of evidence and interpretation.",
        explanation:
          "It names the academic work the previous comment is doing."
      },
      {
        expression: () => "I think that observation complicates the argument in a useful way.",
        explanation:
          "It sounds analytical and shows that you are responding to the substance of the comment."
      }
    ],
    simple: [
      {
        expression: () => "I want to build on that point.",
        explanation:
          "It is short and confident, and it clearly signals that you are responding to someone else."
      },
      {
        expression: () => "That connects with what I was thinking.",
        explanation:
          "It lets you join the conversation naturally without sounding abrupt."
      },
      {
        expression: () => "I think your point also shows another issue.",
        explanation:
          "It is easy to adapt and helps you move from response to analysis."
      }
    ]
  },
  thinkingTime: {
    natural: [
      {
        expression: () => "Let me think about that for a moment.",
        explanation:
          "It is natural, calm, and gives you time without making the room feel awkward."
      },
      {
        expression: () => "That is a good question. I am just trying to organize my thoughts.",
        explanation:
          "It acknowledges the question and explains the pause in a confident way."
      },
      {
        expression: () => "Could I take a second and come back to that?",
        explanation:
          "It is polite and realistic when you need a short pause before answering."
      }
    ],
    academic: [
      {
        expression: () => "That is an important question. I would like a moment to think through the implications.",
        explanation:
          "It sounds thoughtful and academic because it treats the question as complex."
      },
      {
        expression: () => "Before I answer, I want to consider how the evidence fits together.",
        explanation:
          "It signals careful reasoning and helps you avoid rushing your response."
      },
      {
        expression: () => "I need a moment to formulate that more precisely.",
        explanation:
          "It is concise, formal, and useful when you know the idea but need better wording."
      }
    ],
    simple: [
      {
        expression: () => "Can I have a moment to think?",
        explanation:
          "It is simple, clear, and perfectly acceptable in a seminar discussion."
      },
      {
        expression: () => "I know what I mean, but I need a second to say it clearly.",
        explanation:
          "It sounds honest and confident while giving you time to choose your words."
      },
      {
        expression: () => "I will answer in a second. I am thinking about the best way to explain it.",
        explanation:
          "It keeps the conversation moving while making your pause feel intentional."
      }
    ]
  }
} satisfies Record<SituationId, Record<ToneId, SuggestionTemplate[]>>;

function getIdeaReference(input: string) {
  return input.trim().length > 0 ? "your point" : "this point";
}

function getSuggestions(input: string, situation: SituationId, tone: ToneId): Suggestion[] {
  const idea = getIdeaReference(input);

  return suggestionLibrary[situation][tone].map((suggestion, index) => ({
    id: `${situation}-${tone}-${index}`,
    expression: suggestion.expression(idea),
    explanation: suggestion.explanation
  }));
}

export default function Home() {
  const [input, setInput] = useState("");
  const [situation, setSituation] = useState<SituationId>("opinion");
  const [tone, setTone] = useState<ToneId>("natural");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  const suggestions = useMemo(
    () => getSuggestions(input, situation, tone),
    [input, situation, tone]
  );

  const selectedSituation = situations.find((item) => item.id === situation);
  const selectedTone = tones.find((item) => item.id === tone);

  async function copySuggestion(suggestion: Suggestion) {
    try {
      await navigator.clipboard.writeText(suggestion.expression);
      setCopiedId(suggestion.id);
      setCopyMessage("Expression copied.");
      window.setTimeout(() => {
        setCopiedId(null);
        setCopyMessage("");
      }, 1800);
    } catch {
      setCopyMessage("Copy failed. Select the text and copy it manually.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f4]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
              <GraduationCap aria-hidden="true" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-800">Seminar Phrase Coach</p>
              <h1 className="text-2xl font-bold leading-tight text-zinc-950 sm:text-3xl">
                Speak up with seminar-ready English
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-zinc-800">
            <Lightbulb aria-hidden="true" size={18} className="text-amber-600" />
            Mock practice mode
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8">
        <section
          aria-labelledby="coach-form-title"
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft sm:p-5"
        >
          <div className="mb-5">
            <h2 id="coach-form-title" className="text-xl font-bold text-zinc-950">
              Your seminar moment
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Chinese, English, or rough notes are fine.
            </p>
          </div>

          <label htmlFor="idea" className="block text-sm font-semibold text-zinc-900">
            Sentence or idea
          </label>
          <textarea
            id="idea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type the idea you want to express in the seminar."
            className="mt-2 min-h-32 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-3 text-base leading-7 text-zinc-950 shadow-sm placeholder:text-zinc-400"
          />

          <div className="mt-6">
            <p id="situation-label" className="text-sm font-semibold text-zinc-900">
              Seminar situation
            </p>
            <div
              role="radiogroup"
              aria-labelledby="situation-label"
              className="mt-2 grid gap-2 sm:grid-cols-2"
            >
              {situations.map((item) => {
                const isSelected = item.id === situation;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSituation(item.id)}
                    className={`min-h-12 rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-teal-500 hover:bg-teal-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p id="tone-label" className="text-sm font-semibold text-zinc-900">
              Tone
            </p>
            <div
              role="radiogroup"
              aria-labelledby="tone-label"
              className="mt-2 grid gap-2 sm:grid-cols-3"
            >
              {tones.map((item) => {
                const isSelected = item.id === tone;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTone(item.id)}
                    className={`min-h-12 rounded-md border px-3 py-2 text-center text-sm font-semibold transition ${
                      isSelected
                        ? "border-amber-500 bg-amber-400 text-zinc-950"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="suggestions-title" className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-semibold text-teal-800">
                {selectedSituation?.label} | {selectedTone?.label}
              </p>
              <h2 id="suggestions-title" className="mt-1 text-xl font-bold text-zinc-950">
                Suggested expressions
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-zinc-600">
              Each option is ready to copy and adapt in your own voice.
            </p>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const isCopied = copiedId === suggestion.id;

              return (
                <article
                  key={suggestion.id}
                  className="rounded-lg border border-zinc-200 border-l-teal-700 bg-white p-4 shadow-soft"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-amber-700">Option {index + 1}</p>
                      <p className="mt-2 text-lg font-semibold leading-7 text-zinc-950">
                        "{suggestion.expression}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copySuggestion(suggestion)}
                      className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-teal-600 hover:bg-teal-50 sm:w-auto"
                      aria-label={`Copy option ${index + 1}`}
                    >
                      {isCopied ? (
                        <Check aria-hidden="true" size={18} className="text-teal-700" />
                      ) : (
                        <Copy aria-hidden="true" size={18} className="text-teal-700" />
                      )}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">
                    {suggestion.explanation}
                  </p>
                </article>
              );
            })}
          </div>

          <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium text-teal-800">
            {copyMessage}
          </p>
        </section>
      </div>
    </main>
  );
}
