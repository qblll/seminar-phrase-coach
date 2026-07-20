"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useRef, useState } from "react";

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
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = useMemo(
    () => getSuggestions(input, situation, tone),
    [input, situation, tone]
  );

  const selectedSituation = situations.find((item) => item.id === situation);
  const selectedTone = tones.find((item) => item.id === tone);

  function clearGeneratedResults() {
    setHasGenerated(false);
    setCopiedId(null);
    setCopyMessage("");
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (value.trim().length > 0) {
      setValidationError("");
    }
    if (hasGenerated) {
      clearGeneratedResults();
    }
  }

  function handleSituationChange(nextSituation: SituationId) {
    setSituation(nextSituation);
    if (hasGenerated && nextSituation !== situation) {
      clearGeneratedResults();
    }
  }

  function handleToneChange(nextTone: ToneId) {
    setTone(nextTone);
    if (hasGenerated && nextTone !== tone) {
      clearGeneratedResults();
    }
  }

  function generateSuggestions() {
    if (input.trim().length === 0) {
      setValidationError("Enter a sentence, idea, or rough note before generating suggestions.");
      clearGeneratedResults();
      textareaRef.current?.focus();
      return;
    }

    setValidationError("");
    setCopiedId(null);
    setCopyMessage("");
    setHasGenerated(true);
  }

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
    <main className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <img
                src="/editorial-mark.svg"
                alt=""
                aria-hidden="true"
                className="mt-1 h-12 w-12 shrink-0"
              />
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-[var(--color-accent)]">
                  Seminar Phrase Coach
                </p>
                <h1 className="font-editorial-serif mt-1 text-3xl leading-tight text-[var(--color-text)] sm:text-4xl">
                  Speak up with seminar-ready English
                </h1>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border-l-2 border-[var(--color-ochre)] pl-3 text-sm font-semibold text-[var(--color-accent)]">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-ochre)]"
              />
              Mock practice mode
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:divide-x lg:divide-[var(--color-result-border)]">
          <section
            aria-labelledby="coach-form-title"
            className="bg-[var(--color-surface)] p-4 sm:p-6 lg:p-7"
          >
            <div className="mb-5 border-b border-[var(--color-border)] pb-4">
              <h2
                id="coach-form-title"
                className="font-editorial-serif text-2xl leading-tight text-[var(--color-text)]"
              >
                Your seminar moment
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Chinese, English, or rough notes are fine.
              </p>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ochre)]">
              1 Write
            </p>
            <label
              htmlFor="idea"
              className="mt-3 block text-sm font-semibold text-[var(--color-text)]"
            >
              Sentence or idea
            </label>
            <textarea
              ref={textareaRef}
              id="idea"
              value={input}
              onChange={(event) => handleInputChange(event.target.value)}
              placeholder="Type the idea you want to express in the seminar."
              aria-invalid={validationError.length > 0}
              aria-describedby={validationError.length > 0 ? "idea-error" : undefined}
              className={`mt-2 min-h-36 w-full resize-y rounded-[4px] border bg-[var(--color-surface)] px-3 py-3 text-base leading-7 text-[var(--color-text)] placeholder:text-[#7A7268] ${
                validationError.length > 0
                  ? "border-[var(--color-error-border)]"
                  : "border-[var(--color-accent)]"
              }`}
            />
            {validationError.length > 0 ? (
              <p
                id="idea-error"
                role="alert"
                className="mt-2 border-l-2 border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3 py-2 text-sm font-semibold leading-6 text-[var(--color-error)]"
              >
                {validationError}
              </p>
            ) : null}

            <div className="mt-7 border-t border-[var(--color-border)] pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ochre)]">
                2 Choose
              </p>
              <p id="situation-label" className="mt-3 text-sm font-semibold text-[var(--color-text)]">
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
                      onClick={() => handleSituationChange(item.id)}
                      className={`min-h-12 rounded-[4px] border border-l-4 px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-[var(--color-accent)] border-l-[var(--color-accent)] bg-[var(--color-accent-tint)] text-[var(--color-accent)]"
                          : "border-[var(--color-border)] border-l-transparent bg-transparent text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-tint)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p id="tone-label" className="text-sm font-semibold text-[var(--color-text)]">
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
                      onClick={() => handleToneChange(item.id)}
                      className={`min-h-12 rounded-[4px] border border-b-4 px-3 py-2 text-center text-sm font-semibold transition-colors ${
                        isSelected
                          ? "border-[var(--color-accent)] border-b-[var(--color-accent)] bg-[var(--color-accent-tint)] text-[var(--color-accent)]"
                          : "border-[var(--color-border)] border-b-transparent bg-transparent text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-tint)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 border-t border-[var(--color-border)] pt-5">
              <p
                id="prototype-note"
                className="border-l-2 border-[var(--color-ochre)] bg-[var(--color-ochre-tint)] px-3 py-2 text-sm leading-6 text-[var(--color-muted)]"
              >
                Prototype mode: suggestions currently respond to the selected situation and tone,
                not the exact meaning of your sentence.
              </p>
              <button
                type="button"
                onClick={generateSuggestions}
                aria-describedby="prototype-note"
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-[4px] border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#172D4A] active:bg-[#10233D] disabled:cursor-not-allowed disabled:border-[var(--color-border)] disabled:bg-[var(--color-border)] disabled:text-[var(--color-muted)] sm:w-auto"
              >
                Generate expressions
              </button>
            </div>
          </section>

          <section
            aria-labelledby="suggestions-title"
            className="border-t border-[var(--color-result-border)] bg-[var(--color-result-surface)] p-4 sm:p-6 lg:border-t-0 lg:p-7"
          >
            <div
              className={`pb-5 ${
                hasGenerated
                  ? "border-b border-[var(--color-result-border)]"
                  : "border-l-2 border-[var(--color-ochre)] pl-4"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ochre)]">
                3 Review
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-accent)]">
                {hasGenerated ? `${selectedSituation?.label} | ${selectedTone?.label}` : "Results"}
              </p>
              <h2
                id="suggestions-title"
                className="font-editorial-serif mt-1 text-2xl leading-tight text-[var(--color-text)]"
              >
                {hasGenerated
                  ? "Suggested expressions"
                  : "Your seminar-ready expressions will appear here."}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--color-muted)]">
                {hasGenerated
                  ? "Each option is ready to copy and adapt in your own voice."
                  : "Enter your idea, choose a situation and tone, then generate suggestions."}
              </p>
            </div>

            {hasGenerated ? (
              <div className="divide-y divide-[var(--color-result-border)]">
                {suggestions.map((suggestion, index) => {
                  const isCopied = copiedId === suggestion.id;
                  const expressionNumber = String(index + 1).padStart(2, "0");

                  return (
                    <article
                      key={suggestion.id}
                      className="bg-[var(--color-surface)] px-3 py-5 first:mt-5 first:pt-5 last:pb-5 sm:px-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-ochre)]">
                            Expression {expressionNumber}
                          </p>
                          <blockquote className="mt-3 border-l-2 border-[var(--color-ochre)] pl-4">
                            <p className="font-editorial-serif text-xl leading-8 text-[var(--color-text)]">
                              "{suggestion.expression}"
                            </p>
                          </blockquote>
                        </div>
                        <button
                          type="button"
                          onClick={() => copySuggestion(suggestion)}
                          className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[3px] border border-[var(--color-accent)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-tint)] sm:w-auto"
                          aria-label={`Copy expression ${index + 1}`}
                        >
                          {isCopied ? (
                            <Check aria-hidden="true" size={18} />
                          ) : (
                            <Copy aria-hidden="true" size={18} />
                          )}
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="mt-5 border-t border-[var(--color-border)] pt-3 text-sm leading-6 text-[var(--color-muted)]">
                        <span className="font-semibold text-[var(--color-text)]">
                          Editor's note:
                        </span>{" "}
                        {suggestion.explanation}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : null}

            <p
              role="status"
              aria-live="polite"
              className="min-h-6 pt-4 text-sm font-medium text-[var(--color-accent)]"
            >
              {copyMessage}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
