# Seminar Phrase Coach

An interactive mock prototype designed to help international postgraduate students prepare seminar-ready English expressions.

> **Status: Interactive mock prototype**
> This version uses predefined suggestion sets based on the selected seminar situation and tone. It does not yet interpret the exact meaning of the user's input and is not connected to a live AI service.

## The problem

International postgraduate students may have ideas they want to contribute in English-medium seminars but find it difficult to formulate appropriate spoken English quickly and confidently in the moment.

## Target users

International postgraduate students participating in English-medium academic seminars.

## What the prototype does

Users can enter a Chinese sentence, an English sentence, or a rough idea before selecting a seminar situation and tone. The prototype then displays three predefined expressions for rehearsal and adaptation.

Each expression includes:

- a seminar-ready phrase;
- a short explanation of why the wording may be useful;
- a copy action for further adaptation.

### Available seminar situations

- Expressing an opinion
- Agreeing
- Politely disagreeing
- Asking for clarification
- Responding to another student
- Asking for thinking time

### Available tones

- Natural
- Academic
- Simple and confident

## User flow

1. Enter a sentence, note, or rough idea.
2. Select a seminar situation.
3. Select a tone.
4. Generate three mock expressions.
5. Review the explanation accompanying each expression.
6. Copy and adapt a preferred option.

## Interaction and accessibility features

- Empty and whitespace input validation
- Accessible inline error feedback
- Keyboard-operable controls
- Visible focus states
- Old results cleared when the input or selections change
- Copy confirmation feedback
- Responsive desktop and mobile layouts
- No horizontal overflow at approximately 390px width
- Reduced-motion consideration

## Design approach

The interface uses an **Editorial Academic** visual direction inspired by seminar handouts, publications, and academic annotation rather than generic AI SaaS styling.

The design includes:

- a warm writing surface and a cool review surface;
- serif headings and expression excerpts with readable sans-serif body text;
- a unified quotation and page-margin identity mark;
- restrained borders and minimal shadows;
- clear visual stages for writing, choosing, and reviewing.

## Technical stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Git

## Development and iteration

The project began as one feature within a broader seminar-support platform concept. It was reduced to a focused standalone prototype so that the core interaction could be designed, tested, and refined independently.

The development process included:

- building an initial static prototype;
- adding an explicit generation and validation flow;
- conducting functional, keyboard, and responsive checks;
- refining selected states, error feedback, and result presentation;
- redesigning the original generic AI-tool appearance as the Editorial Academic system;
- using Git commits and a separate visual branch to preserve stable versions.

## Current limitations

- Suggestions are predefined mock outputs.
- Outputs respond to the selected situation and tone, not the exact meaning of the user's sentence.
- There is no live AI API integration.
- There is no login, database, or user-data storage.
- Previous inputs and results are not saved.
- The prototype has not yet been evaluated through formal testing with target users.

## Potential next steps

- Add secure server-side AI integration.
- Ground suggestions in the user's intended meaning.
- Add loading and API error states.
- Conduct usability testing with international postgraduate students.
- Refine the interaction based on observed use.
- Explore optional voice rehearsal in a later version.

## Running locally

This repository uses `pnpm`.

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local address shown in the terminal, usually:

```text
http://localhost:3000
```

Run TypeScript checking:

```bash
pnpm typecheck
```

Create a production build:

```bash
pnpm build
```

## Project structure

- `app/page.tsx` — interactive prototype, mock suggestion data, and UI states
- `app/globals.css` — global styles, design tokens, typography, and focus styling
- `app/layout.tsx` — application metadata and root layout
- `app/icon.svg` — browser favicon and identity mark
- `public/editorial-mark.svg` — header identity mark
- `package.json` — scripts and project dependencies
- `tailwind.config.ts` — Tailwind CSS configuration

## Authorship and AI-assisted development

Product framing, target-user definition, design direction, content review, manual testing, iteration decisions, and final acceptance were led by **Qianbing Li**.

Codex was used as an AI coding assistant to support implementation, code editing, automated testing, and build checks.
