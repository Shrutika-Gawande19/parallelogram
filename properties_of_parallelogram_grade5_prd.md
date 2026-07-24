# Product Requirements Document (PRD)
## Properties of Parallelogram | Grade 5 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE)

═══════════════════════════════════════════════════════════════════════════════

## 1. EXECUTIVE SUMMARY

This document defines product requirements for the **"Properties of Parallelogram"**
interactive lesson module, delivered as **Lesson 8.3** within Intellia SG's **Grade 5
Math** program. The module targets **Singapore Primary 5 students aged 10–11** and
develops the concept of a parallelogram's properties — parallel and equal opposite
sides, equal opposite angles, and supplementary co-interior (adjacent) angles — as
the concrete-to-abstract bridge toward solving unknown-angle problems in
quadrilaterals, fully aligned with the **Singapore MOE Mathematics Framework** and
the **Primary 5 Mathematics syllabus** (strand: Measurement and Geometry — Geometry:
Angles).

The product is a standalone web page to be hosted at:
`https://intelliasg.com/courses/grade-5-math/lessons/properties-of-parallelogram/`

It is built using **React (Vite + JSX, JavaScript/CSS)** and designed to strictly
mirror the visual and UX structure established at `https://numberbound.vercel.app/`
and the repository `https://github.com/dsamyak/numberbound`.

Audio narration uses **ElevenLabs exclusively** (Voice: Alice, Voice ID:
`Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`) with pre-generated static
`.mp3` files for all phase narrations and dynamic generation for practice
questions — matching the pipeline documented in the Word Problems Using Addition
Audio & Narration Pipeline.

The module follows Intellia's 5-phase learner journey:

| Phase | Name | Purpose |
|-------|------|---------|
| Phase 1 | INTRO | Welcome screen + 5-phase progress map |
| Phase 2 | WONDER | Curiosity hook |
| Phase 3 | STORY | Narrative-based concept introduction |
| Phase 4 | SIMULATE | Sandbox-style interactive simulation (3 stations) |
| Phase 5 | PLAY | IntelliPlay™ gamified practice (100 randomised questions) |
| Phase 6 | REFLECT | Journal / LearnFlow AI prompt + completion badge |

═══════════════════════════════════════════════════════════════════════════════

## 2. PRODUCT VISION & GOALS

### Vision
To make the properties of a parallelogram intuitive, visual, and joyful for 10–11
year old Singapore learners — building a concrete-pictorial-abstract (CPA) bridge
toward solving unknown angles in quadrilaterals through hands-on angle
manipulation, story narration, and adaptive gamified challenge.

### Goals

| Goal | Metric |
|------|--------|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 10 practice questions |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥15 minutes per session |
| Curriculum Alignment | 100% aligned to Singapore MOE Primary 5 (Lesson 8.3) |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |

═══════════════════════════════════════════════════════════════════════════════

## 3. TARGET USERS

### Primary: Grade 5 Students (Age 10–11)
- Transitioning from concrete shape recognition to reasoning with angle facts
- Learn concretely first (C → P → A: Concrete-Pictorial-Abstract)
- Comfortable with multi-step problems but need scaffolded diagrams
- Singapore context: familiar with HDB estate structures, playgrounds, void deck
  fences, school bag straps, kite-flying at the park

### Secondary: Parents & Teachers
- Assign as classwork or enrichment homework
- Expect strict MOE curriculum alignment
- Monitor via phase completion indicators embedded in lesson page

═══════════════════════════════════════════════════════════════════════════════

## 4. CURRICULUM ALIGNMENT — Singapore MOE Primary 5

**Topic:** Properties of Parallelogram (Lesson 8.3)
**Programme:** Intellia SG Grade 5 Math — Section 8: Geometry — Angles in Quadrilaterals
**Lesson URL:** `https://intelliasg.com/courses/grade-5-math/lessons/properties-of-parallelogram/`

### Source References
- Singapore MOE Primary Mathematics Syllabus (Primary 1–6), 2013 (Revised)
  → Strand: Measurement and Geometry
  → Sub-strand: Geometry — Angles
  → Primary 5 anchor: "use properties of parallelogram, rhombus and trapezium to
    find unknown angles"
- Targeting Mathematics Primary 5B (Casco Publications)
  → Chapter on Angles: Properties of Parallelogram, Rhombus and Trapezium
- My Pals Are Here! Maths Primary 5B (Marshall Cavendish)
  → Unit on Angles in Geometric Figures

### MOE Learning Objectives Covered (Lesson 8.3)
| # | Objective |
|---|-----------|
| LO1 | Identify a parallelogram and describe its properties (opposite sides parallel and equal, opposite angles equal) |
| LO2 | State that adjacent (co-interior) angles in a parallelogram are supplementary (add up to 180°) |
| LO3 | Distinguish a parallelogram from other quadrilaterals (rectangle, rhombus, trapezium) using its properties |
| LO4 | Apply parallelogram properties together with angle facts (angles on a straight line, angles at a point, vertically opposite angles) to find unknown angles |
| LO5 | Solve word problems involving unknown angles in parallelograms |
| LO6 | Use language: "parallel", "opposite sides/angles", "adjacent angles", "co-interior angles", "supplementary" |
| LO7 | Represent parallelogram properties using labelled diagrams with tick marks and arrows |

### Singapore Syllabus CPA Progression for This Lesson
| Stage | Description |
|-------|--------------|
| Concrete | Geoboard/paper parallelogram cut-outs; folding along the diagonal to show opposite sides and angles match |
| Pictorial | Diagrams with arrow marks for parallel sides, tick marks for equal sides, arcs for equal angles |
| Abstract | "∠a + 130° = 180°, so ∠a = ___"; solving for unknown angle x° using angle-sum relationships |

### Angle Ranges
| Level | Range |
|-------|-------|
| Easy | Single-step, angles given directly (e.g. opposite angle = 65°) |
| Medium | Two-step, uses supplementary pair + one other angle fact |
| Hard | Multi-step, combines parallelogram properties with angles on a straight line / at a point / vertically opposite angles; includes algebraic unknowns (e.g. 2x°) |

### Vocabulary Focus (age-appropriate)
"parallelogram", "opposite sides", "opposite angles", "adjacent angles",
"co-interior angles", "supplementary", "parallel", "vertically opposite angles",
"angles on a straight line", "angles at a point"

═══════════════════════════════════════════════════════════════════════════════

## 5. THE 5-PHASE LEARNER JOURNEY (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INTRO SCREEN → Progress Map (5-step visual tracker, top bar)              │
│  Welcome: "Hello! Today we're going to explore Parallelograms! 📐"         │
│  Lesson badge shown (locked). 5 glowing phase dots visible.                │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — WONDER  (≈ 1–2 min)                                             │
│                                                                            │
│  Hook: "Look at this sliding gate at the playground 🚪. It leans over,    │
│  but the two long bars are always the same length and never cross.       │
│  What shape do the bars make when the gate tilts?"                       │
│                                                                            │
│  Visual: Animated gate tilting side to side, bars highlighted             │
│  Animation: Gate shape morphs between rectangle and slanted parallelogram │
│  Narration (ElevenLabs): Alice voice reads the hook warmly                │
│  → Mascot (LearnFlow robot) appears with a curious expression             │
│  → "Let's discover the secrets of the PARALLELOGRAM!"                    │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — STORY  (≈ 2–3 min)                                              │
│                                                                            │
│  Narrative: Mei Ling visits her uncle's carpentry workshop.               │
│  Panel 1: "Uncle Tan is building a folding clothes rack. 🧺"             │
│  Panel 2: "Its two side bars are always parallel and equal in length!"   │
│  Panel 3: Diagram appears — a parallelogram ABCD with arrows on AB//DC    │
│           and tick marks on AB = DC, AD = BC                             │
│  Panel 4: "The angle at A is 60°. The angle at C, opposite it, is also   │
│           60°! Opposite angles are equal."                              │
│  Panel 5: "The angle at B is next to A. 60° + ∠B = 180°, so ∠B = 120°.   │
│           Adjacent angles add up to 180° — they are supplementary!"     │
│  Panel 6: "Now you know the secrets of the parallelogram! 📐"           │
│                                                                            │
│  → Illustrated story panels (animated slide-in), ElevenLabs narration     │
│  → Key vocabulary highlighted: "parallel", "opposite angles",             │
│    "supplementary"                                                        │
│  → Labelled angle diagram introduced visually (arcs + degree labels)     │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — SIMULATE  (≈ 5–6 min)                                           │
│                                                                            │
│  3 Interactive Stations — student must complete all 3 to advance          │
│                                                                            │
│  Station A — "The Folding Frame" (Concrete)                               │
│    Drag a corner of an on-screen parallelogram to tilt it; the app       │
│    highlights matching opposite sides and angles as they change.         │
│                                                                            │
│  Station B — "Sort the Quadrilaterals" (Pictorial)                        │
│    Show 4 quadrilaterals on screen. Student taps only those that are     │
│    TRUE parallelograms based on marked sides/angles.                     │
│                                                                            │
│  Station C — "Solve for the Angle" (Abstract)                            │
│    "∠a = ___°" — fill the blank using a number pad, given one angle      │
│    and the parallelogram property needed (opposite or adjacent).        │
│                                                                            │
│  → Mascot reacts to each completed station                                │
│  → ElevenLabs narrates each station instruction and feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — PLAY  (≈ 6–8 min)                                               │
│                                                                            │
│  IntelliPlay™ Level: 100 randomised questions across 10 worlds            │
│  10 questions per world, world unlocks at ≥6/10 correct                  │
│  Stars (1–3), XP, badges, and streak fire counter active                 │
│  → Mastery gates the world map; encouragement-first feedback             │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5 — REFLECT  (≈ 1–2 min)                                            │
│                                                                            │
│  Journal prompt: "Can you draw a parallelogram and label one pair of     │
│  equal angles and one pair of supplementary angles?"                    │
│  Or: LearnFlow AI chat — type/speak your understanding                   │
│  Lesson complete badge unlocks here. Summary of XP + badges shown.       │
│  → "Share with your teacher!" button (screenshot / export)               │
└────────────────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════

## 6. PHASE 3 — SIMULATION DESIGN (Detailed)

### 6.1 Station A — The Folding Frame (Concrete)

**Visual:**
- An on-screen hinged parallelogram frame with a draggable vertex
- Opposite sides shown with matching arrow marks (parallel) and tick marks (equal length)
- "Drag the corner and watch the angles change together!" instruction narrated by Alice (ElevenLabs)

**Interaction:**
- Student drags one vertex; the shape tilts while remaining a parallelogram
- OR taps preset tilt buttons (accessibility mode)
- Opposite angle pair highlights and animates to show they stay equal
- Adjacent angle pair highlights and shows the sum staying at 180°

**Feedback:**
- Correctly identifies which angles stay equal → mascot cheers, "Yes! Opposite angles are always equal!" 🎉
- Wrong pair selected on submit → gentle shake + "Look again — which angles are opposite each other?"

**Variants per round (randomised):**
- Round 1: Identify the opposite angle pair (given ∠A = 70°, find ∠C)
- Round 2: Identify the adjacent angle pair (given ∠A = 70°, find ∠B)
- Round 3: Tilt the frame and predict the new ∠B after ∠A changes
- Round 4: Frame with one angle unlabelled — student estimates before checking

### 6.2 Station B — Sort the Quadrilaterals (Pictorial)

**Visual:**
- 4 quadrilateral cards displayed on screen (2×2 grid)
- Each card shows a shape with tick marks (equal sides) and arrow marks (parallel sides)
- Some cards are true parallelograms; some are trapeziums, kites, or irregular quadrilaterals

**Interaction:**
- Student taps the card(s) that show a true parallelogram
- Multi-select: correct cards glow green, wrong cards glow red on submit
- Diagrams are shown with marks only (no angle numbers) — pure property discrimination

**Teaching goal:**
- Parallelogram vs. other quadrilaterals — reinforcing the defining properties
- Encourages careful reading of parallel/equal-side marks rather than "looks similar"

**Distractor design:**
- One distractor has only one pair of parallel sides (trapezium)
- One distractor has equal sides but not parallel (kite-like shape)
- One distractor looks tilted like a parallelogram but marks show unequal sides

**3 rounds with increasing visual complexity:**
- Round 1: Upright vs. tilted shapes (easy visual split)
- Round 2: Mixed parallelograms and trapeziums (medium)
- Round 3: Mixed parallelograms, rhombuses, kites and irregular shapes (hard)

### 6.3 Station C — Solve for the Angle (Abstract)

**Visual:**
```
∠a = ___°
(parallelogram diagram shown above, one angle labelled, ∠a marked with "?")
```

**Interaction:**
- Number pad (large, tap-friendly, 0–9 displayed)
- Labelled parallelogram diagram shown above as visual scaffold
- "Show property" hint button always visible (reveals opposite/adjacent rule)
- On submit: correct → bounce animation; incorrect → shake + hint

**Variants (which relationship is tested, rotated per round):**
- Opposite angles: ∠A = 55°, find ∠C
- Adjacent angles: ∠A = 55°, find ∠B (supplementary)
- Multi-step: ∠A = 2x°, ∠B = (x + 30)°, find x and ∠A
- Combined with straight-line/point facts: parallelogram sits on a straight line, find the exterior angle

ElevenLabs narrates each question aloud when displayed.

═══════════════════════════════════════════════════════════════════════════════

## 7. PHASE 4 — QUESTION BANK (100 Randomised Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description | Example |
|------|--------------|---------|
| Q1 | Find opposite angle | ∠A = 72°. Find ∠C. |
| Q2 | Find adjacent (supplementary) angle | ∠A = 72°. Find ∠B. |
| Q3 | Fill blank — opposite angle equation | ∠a = 48°, so ∠c = ___ |
| Q4 | Fill blank — adjacent angle equation | ∠a + ∠b = 180°, ∠a = 65°, ∠b = ___ |
| Q5 | Identify true parallelogram (pictorial MCQ) | Which shape is a parallelogram? (4 choices) |
| Q6 | Singapore word problem (opposite angles) | The gate at Mei Ling's block is shaped like a parallelogram. One angle is 110°. Find the angle opposite it. |
| Q7 | Singapore word problem (adjacent angles) | A folding table top is a parallelogram. One angle is 100°. Find the angle next to it. |
| Q8 | True or False — property check | "In a parallelogram, all four angles are equal." — True or False? |
| Q9 | Multi-step with algebra | ∠A = (2x)°, ∠B = (x + 30)°. Find x and ∠A. |
| Q10 | Combined angle facts | Parallelogram ABCD lies on a straight line at D. ∠ADC = 115°. Find the angle on the straight line next to it. |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy | Medium | Hard |
|------|-------|------|--------|------|
| Q1 | 10 | 5 | 3 | 2 |
| Q2 | 10 | 5 | 3 | 2 |
| Q3 | 10 | 4 | 4 | 2 |
| Q4 | 10 | 4 | 4 | 2 |
| Q5 | 10 | 4 | 4 | 2 |
| Q6 | 10 | 3 | 4 | 3 |
| Q7 | 10 | 3 | 4 | 3 |
| Q8 | 10 | 5 | 3 | 2 |
| Q9 | 10 | 1 | 4 | 5 |
| Q10 | 10 | 1 | 4 | 5 |
| **TOT** | **100** | **35** | **37** | **28** |

### 7.3 Angle Ranges
- Easy: single fact application, angles given as whole tens/fives (e.g. 60°, 105°)
- Medium: two-step reasoning, angles as any whole number 1°–179°
- Hard: multi-step reasoning, algebraic unknowns, combined with straight-line/point/vertically-opposite facts

### 7.4 Singapore Context Names & Objects Used in Word Problems
**Names:** Mei Ling, Wei Ming, Priya, Raju, Ahmad, Jun, Siti, Ryan, Xiao Ling, Aisha
**Objects:** playground gates, folding clothes racks, ironing boards, kites, photo
frames, bookshelves, sliding doors, ladders, roof trusses, garden trellises
**Contexts:** HDB playground, void deck, school workshop, home living room, park

### 7.5 MOE-Aligned Language Requirements
All questions use approved Singapore MOE vocabulary:
- "parallelogram", "opposite angles", "adjacent angles", "co-interior angles"
- "supplementary", "parallel sides", "angles on a straight line", "angles at a point"
- "find the unknown angle"
Sentence structures match Primary 5 Targeting Mathematics style.

═══════════════════════════════════════════════════════════════════════════════

## 8. GAMIFICATION DESIGN

### 8.1 Reward System
| Element | Rule |
|---------|------|
| Stars ⭐ | Earned per 10-question world (1–3 stars based on score) |
| XP Points | 10 XP correct first try \| 7 XP second try \| 5 XP with hint used |
| Streak 🔥 | Fire counter for consecutive correct answers |
| Streak Bonus | +5 XP per correct answer when streak ≥ 5 |

### 8.2 Badges (Unlockable)
- 🏅 "Angle Explorer" — Complete Wonder + Story phases
- 🥈 "Frame Builder" — Complete all 3 Simulation stations
- 🥇 "Parallelogram Champion" — Score ≥80% on Play phase
- 💎 "Perfect Parallelogram" — Score 10/10 in any world
- 🔥 "Streak Star" — Achieve a streak of 10 consecutive correct answers
- 🌟 "Full Journey" — Complete all 5 phases (lesson complete badge)
- 🎯 "Sharp Eye" — Get 5 correct in Station B without any wrong pick
- 📐 "Angle Master" — Answer 5 algebraic angle questions (Q9) correctly

### 8.3 Feedback Mechanics
**✅ Correct:**
- Bounce animation on answer card + mascot happy mood
- ElevenLabs celebration audio: "Fantastic! You found the angle! 🎉"
- XP floats up from answer card (+10 / +7 / +5)
- Streak fire counter increments

**❌ Incorrect (Attempt 1):**
- Gentle shake animation on answer card
- ElevenLabs gentle voice: "Not quite! Let's look at the angle facts again 📐"
- Hint 1 activates: diagram highlights the relevant angle pair

**❌ Incorrect (Attempt 2):**
- Stronger shake + Hint 2: animated arc shows the angle relationship visually
- ElevenLabs: "Watch how the angles connect! Can you try again?"

**❌ Incorrect (Attempt 3):**
- Answer revealed with animated explanation (mascot explains)
- ElevenLabs: full explanation read aloud
- No score penalty — encouragement only

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Level Progression)

| World | Theme | Coverage |
|-------|-------|----------|
| 1 | "Playground Gates" | Q1–10, opposite angles, easy |
| 2 | "Carpenter's Workshop" | Q11–20, adjacent angles, easy-med |
| 3 | "Folding Furniture" | Q21–30, mixed opposite/adjacent, medium |
| 4 | "Kite Festival" | Q31–40, pictorial sorting, medium |
| 5 | "HDB Void Deck" | Q41–50, word problems, medium-hard |
| 6 | "Garden Trellis" | Q51–60, true/false property checks, hard |
| 7 | "Rooftop Trusses" | Q61–70, algebraic unknowns, hard |
| 8 | "City Bridges" | Q71–80, combined angle facts, hard |
| 9 | "Architect's Studio" | Q81–90, mixed all types, hard |
| 10 | "Geometry Grand Hall" | Q91–100, mixed, hardest, multi-step |

Unlock gate: ≥6/10 correct (1-star minimum) required to advance to next world.
3 stars in a world unlocks a hidden "Bonus Challenge" (3 extra questions).

### 8.5 Mascot (LearnFlow AI Companion)
| Attribute | Detail |
|-----------|--------|
| Character | Friendly robot — "LearnFlow" (matching Intellia branding) |
| Mood States | idle \| curious \| happy \| thinking \| celebrating \| encouraging |
| Appearances | Wonder hook, Story narration, Simulation feedback, Reflect phase |
| Reactions | Correct answer, badge unlock, streak milestone, world completion |
| Audio | All mascot speech via ElevenLabs Alice voice (pre-generated .mp3) |

═══════════════════════════════════════════════════════════════════════════════

## 9. AUDIO & NARRATION DESIGN

### 9.1 ElevenLabs Pipeline (as per Audio & Narration Pipeline doc)
| Setting | Value |
|---------|-------|
| Voice Provider | ElevenLabs (ONLY — no browser Web Speech API fallback) |
| Voice Name | Alice (Clear, Engaging Educator) |
| Voice ID | Xb7hH8MSUJpSbSDYk0k2 |
| Model | eleven_multilingual_v2 |
| API Key Env Var | VITE_ELEVENLABS_API_KEY |

### 9.2 Speech Styles Mapped to ElevenLabs Settings

| Style | stability | similarity_boost | style | Use case |
|-------|-----------|-------------------|-------|----------|
| statement | 0.75 | 0.75 | 0.0 | Story narration, instructions |
| instruction | 0.80 | 0.75 | 0.0 | Simulation station prompts |
| question | 0.60 | 0.80 | 0.3 | Practice question read-aloud |
| encouragement | 0.55 | 0.85 | 0.6 | Correct answer feedback |
| emphasis | 0.85 | 0.70 | 0.1 | Key vocabulary highlight |
| thinking | 0.65 | 0.80 | 0.2 | Mascot thinking moments |
| celebration | 0.45 | 0.90 | 0.8 | Badge unlock, world complete |

### 9.3 Pre-generated Audio Files (Offline — scripts/generate_audio.js)
All phase narration lines (Wonder, Story panels, Simulate instructions,
Reflect prompt, badge unlock messages, world completion) are pre-generated
offline and stored as static `.mp3` in `public/assets/audio/`.

`audioMap.js` is auto-generated and maps exact text strings → file paths.
The frontend checks `audioMap` first; dynamic generation only for play-phase
questions not in the map (using `elevenLabsCache` in memory).

### 9.4 Dynamic Generation
Practice questions (Phase 4) are generated dynamically if not pre-cached.
Requires `VITE_ELEVENLABS_API_KEY` in `.env.local`.
If key is absent, narration silently skipped (no browser TTS fallback).
Internal memory cache (`elevenLabsCache`) prevents re-fetching same text.

### 9.5 Segment Synchronisation
The audio engine parses narration as an array of segments (one per sentence).
While segment i plays, segment i+1 is eagerly preloaded via `getAudioUrl`.
This guarantees seamless, gap-free narration across multi-sentence scripts.
Uses HTML5 Audio API (`new Audio()`) for playback.

### 9.6 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
- "Look at this sliding gate at the playground."
- "The two long bars are always the same length and never cross."
- "What shape do the bars make when the gate tilts? Let us find out!"

**Phase 2 (Story, Panel 4) — style: statement**
- "The angle at A is sixty degrees."
- "The angle at C, opposite it, is also sixty degrees."
- "Opposite angles in a parallelogram are always equal!"

**Phase 3 (Station C) — style: instruction**
- "Look at the parallelogram. One angle is given."
- "Use what you know about opposite and adjacent angles to find the missing angle!"

**Phase 4 (Correct feedback) — style: celebration**
- "Fantastic! You found the angle! You are a geometry star!"

**Phase 5 (Reflect) — style: thinking**
- "Wow, what a journey today! Can you tell me one property of a parallelogram you learned?"

═══════════════════════════════════════════════════════════════════════════════

## 10. UX & VISUAL DESIGN REQUIREMENTS

### 10.1 Visual Theme
| Element | Detail |
|---------|--------|
| Brand | Intellia SG — Think. Explore. Become. |
| Reference UI | `https://numberbound.vercel.app/` (mirror exactly) |
| Reference Repo | `https://github.com/dsamyak/numberbound` |
| Colours | Match numberbound.vercel.app exactly — primary blue (#4A90D9 / equivalent), accent gold/yellow for rewards and stars, soft coral/red for wrong-answer shake states, white card backgrounds with soft drop shadows, distinct phase band colours |
| Typography | Rounded, legible — Nunito or similar (slightly more mature tone than Primary 1 lessons) |
| Illustrations | Clean, geometry-styled, Singapore-context imagery (playgrounds, workshops, HDB estates) |
| Angle Diagrams | Clean SVG parallelograms with tick marks, arrow marks, and coloured angle arcs |

### 10.2 Layout Structure (mirrors numberbound.vercel.app)
| Region | Content |
|--------|---------|
| Top Bar | Intellia logo \| Lesson title "Properties of Parallelogram" \| 5-phase dot tracker |
| Main Area | Phase content (fills screen, responsive, smooth phase transitions) |
| Bottom Bar | XP counter \| Star count \| Streak fire \| Phase navigation arrows |
| Sidebar | Hidden on mobile; shown on tablet+ as vertical phase map |

### 10.3 Parallelogram Diagram Visual Component (Primary Visual)
Used throughout all phases. Visual spec:
- Labelled parallelogram (vertices A, B, C, D) with arrow marks on parallel
  sides and tick marks on equal sides
- Coloured angle arcs at each vertex, degree value shown once revealed
- Unknown angle shown as a dashed arc with "?" inside
- Angles animate in (arc-sweep animation) when diagram first renders

### 10.4 Accessibility
- Large tap targets (minimum 44×44px on all interactive elements)
- WCAG AA colour contrast on all text elements
- All narration via ElevenLabs (premium, consistent voice)
- Keyboard navigable (Tab + Enter for all interactions)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Drag interactions have touch-equivalent tap+tap fallback

### 10.5 Responsive Design
| Priority | Target |
|----------|--------|
| Primary | iPad / tablet (768px+) — classroom context |
| Secondary | Desktop browser (1024px+) |
| Tertiary | Mobile (375px+) — stacked single-column layout |

═══════════════════════════════════════════════════════════════════════════════

## 11. CONTENT REQUIREMENTS

### 11.1 Simulation Visuals
| Element | Detail |
|---------|--------|
| Angle diagrams | SVG-rendered parallelograms with labelled vertices and angle arcs |
| Shape pool | Playground gates, folding tables, kites, photo frames, roof trusses (rotated per session) |
| Station B cards | 4 quadrilateral cards, distinct layouts, clean whitespace |
| Abstract sentences | Large bold typography, one highlighted blank per round |

### 11.2 Question Bank Coverage
- All 10 question types × 10 questions = 100 unique question objects in `questionBank.js`
- Questions randomised per session using Fisher-Yates shuffle
- No two sessions present same question order
- MCQ distractors always plausible (within ±10° or a common misconception, e.g. mixing up opposite vs. adjacent)

### 11.3 Word Problem Format (MOE style)

**Opposite angle sense:**
> "[Name] notices [object] is shaped like a parallelogram. One angle measures
> [angle]°. What is the size of the angle opposite it?"

**Adjacent (supplementary) angle sense:**
> "[Name]'s [object] is shaped like a parallelogram. One angle measures
> [angle]°. What is the size of the angle next to it?"

**Let's Think Along style (extended):**
> "[Name] is building a [object] shaped like a parallelogram. One angle is
> ___°, expressed as ___. Find the value of the unknown and the size of the
> angle. Draw it and check!"

### 11.4 Audio Script Parity (1:1 Strict Parity Rule)
Every on-screen text string that is narrated must match the `narration.js` text
exactly — same words, same punctuation. This prevents confusion for young
learners who are simultaneously listening and reading. Any UI text change
requires updating both the `generate_audio.js` phrases array and the
`narration.js` file.

═══════════════════════════════════════════════════════════════════════════════

## 12. SUCCESS CRITERIA (v1.0)

| Criterion | Target |
|-----------|--------|
| All 100 questions randomised correctly | ✅ Required |
| All 3 simulation stations functional | ✅ Required |
| All 5 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 8 badges) working | ✅ Required |
| World map 10-world progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional | ✅ Required |
| Mobile/tablet responsive layout | ✅ Required |
| Singapore MOE syllabus 100% covered | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches numberbound.vercel.app structure | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL | ✅ Required |

═══════════════════════════════════════════════════════════════════════════════

## 13. OUT OF SCOPE (v1.0)

- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Lessons 8.4 (Properties of Rhombus) and 8.5 (Properties of Trapezium) — separate modules
- Area of parallelogram (covered in a separate Measurement lesson)
- Assessment against full curriculum (broader test engine)

═══════════════════════════════════════════════════════════════════════════════

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 5 Math, Lesson 8.3
**Lesson Title:** Properties of Parallelogram
**Curriculum:** Singapore MOE Primary 5 Mathematics
**Reference UI:** `https://numberbound.vercel.app/`
**Reference Repo:** `https://github.com/dsamyak/numberbound`
**Audio Pipeline:** ElevenLabs (Alice, Xb7hH8MSUJpSbSDYk0k2, eleven_multilingual_v2)
**Parent Course Page:** `https://intelliasg.com/courses/grade-5-math/`
**Lesson URL:** `https://intelliasg.com/courses/grade-5-math/lessons/properties-of-parallelogram/`
