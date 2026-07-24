# Technical Requirements Document (TRD)
## Parallelogram — Properties & Angle Relationships | Grade 5 Math
**Intellia SG | Singapore Primary Mathematics Curriculum (MOE)**

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the "Parallelogram — Properties & Angle Relationships" interactive lesson module (Lesson 6.2) within Intellia SG's Grade 5 Math program.

The module is a React 18 application (Vite + JSX), structured identically to the reference repository **https://github.com/dsamyak/numberbound**, and styled to match the deployed reference instance **https://equal-tau.vercel.app/**. It will be embedded in WordPress at:

```
https://intelliasg.com/courses/grade-5-math/lessons/parallelogram/
```

Audio narration uses ElevenLabs exclusively (no browser Web Speech API fallback), mirroring the pipeline from the Equal Groups module, adapted for this lesson's scripts.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 (JSX, Vite) | Matches numberbound repo structure |
| State Management | useState + useReducer | Sufficient for single-module complexity |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact environment |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG Diagrams | Inline SVG (React) | For parallelogram/angle diagrams and geoboard |
| Persistence | localStorage | Session state, no backend needed |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice (Alice) |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Math | Vanilla JS | No library required |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

---

## 3. Project Structure (mirrors numberbound repo)

```
parallelogram/
├── public/
│   └── assets/
│       └── audio/                       # Pre-generated .mp3 files (ElevenLabs)
│           ├── audio_wonder_hook_0.mp3
│           ├── audio_story_panel1_0.mp3
│           ├── audio_story_panel2_0.mp3
│           ├── audio_story_panel3_0.mp3
│           ├── audio_story_panel4_0.mp3
│           ├── audio_story_panel5_0.mp3
│           ├── audio_story_panel6_0.mp3
│           ├── audio_station_a_instruction_0.mp3
│           ├── audio_station_b_instruction_0.mp3
│           ├── audio_station_c_instruction_0.mp3
│           ├── audio_correct_0.mp3
│           ├── audio_reflect_prompt_0.mp3
│           └── ... (all phase phrases pre-generated)
│       └── images/
│           ├── mascot-idle.svg
│           ├── mascot-happy.svg
│           ├── mascot-thinking.svg
│           ├── mascot-celebrate.svg
│           └── world-map-bg.svg
├── src/
│   ├── main.jsx                         # React entry point
│   ├── App.jsx                          # Root component, global state (useReducer)
│   ├── App.css                          # Global styles (mirrors reference CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx              # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx              # 5-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx          # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx           # Phase 2: Illustrated narrative panels
│   │   │   ├── SimulatePhase.jsx        # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx            # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx         # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── BuildFrameStation.jsx    # Station A: Drag vertices to build a parallelogram
│   │   │   ├── SpotParallelogramStation.jsx # Station B: Visual shape discrimination
│   │   │   └── AngleSentenceStation.jsx # Station C: Fill in the missing angle(s)
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx     # Polymorphic dispatcher → type-specific component
│   │   │   ├── IdentifyShapeQ.jsx       # Q1: Tap the true parallelogram
│   │   │   ├── OppositeAngleQ.jsx       # Q2: Find missing opposite angle
│   │   │   ├── CoInteriorAngleQ.jsx     # Q3: Find missing co-interior angle
│   │   │   ├── MissingSideQ.jsx         # Q4: Find missing side length
│   │   │   ├── TrueFalsePropertyQ.jsx   # Q5: True/False — property statement
│   │   │   ├── WordProbAngleQ.jsx       # Q6: Word problem (angle context)
│   │   │   ├── WordProbSideQ.jsx        # Q7: Word problem (side/perimeter context)
│   │   │   ├── AlgebraicAngleQ.jsx      # Q8: Algebraic unknown angle
│   │   │   ├── DiagonalBisectQ.jsx      # Q9: Diagonal bisection — find segment
│   │   │   ├── MultiStepReasoningQ.jsx  # Q10: Multi-step, combine 2 properties
│   │   │   └── HintOverlay.jsx          # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx            # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx           # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx           # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx        # Fire streak counter
│   │   │   └── WorldMap.jsx             # 10-world progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mascot.jsx               # LearnFlow robot with mood states
│   │       ├── ParallelogramDiagram.jsx # Reusable SVG: labelled parallelogram
│   │       ├── Geoboard.jsx             # Dot-grid draggable vertex canvas
│   │       ├── VertexHandle.jsx         # Single draggable vertex point
│   │       ├── NumberPad.jsx            # Large tap-friendly digit input (0–9)
│   │       └── FeedbackOverlay.jsx      # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js              # 100 question objects (all types)
│   │   └── storyContent.js              # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                  # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js              # Gamification state hook
│   │   └── useLocalStorage.js           # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                  # AUTO-GENERATED: text → .mp3 path map
│       ├── shuffle.js                   # Fisher-Yates randomisation
│       ├── scoring.js                   # XP + star calculation + distractor gen
│       ├── geometryEngine.js            # Property validation (parallel/equal/bisect checks)
│       └── badgeEngine.js               # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                   # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                    # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```js
const initialState = {
  // Navigation
  phase: 'intro',          // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,            // 0–5 (6 story panels)
  currentSimStation: 0,     // 0=BuildFrame, 1=SpotParallelogram, 2=AngleSentence
  simStationsComplete: [false, false, false],
  simRound: 0,               // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],           // 100 shuffled Question objects
  currentQuestion: 0,        // 0–99
  currentWorld: 0,           // 0–9 (10 worlds)
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,            // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                // Array of unlocked badge IDs
  stationBPerfect: false,     // Tracks Station B "no wrong pick" run
  diagonalCorrect: 0,          // Tracks Q9 correct count (for Diagonal Detective badge)

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,        // ElevenLabs narration on/off
  musicEnabled: false,       // Background ambient music (off by default)
};
```

### 4.2 Reducer Action Types

```js
const ACTIONS = {
  SET_PHASE:              'SET_PHASE',
  NEXT_STORY_PANEL:       'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION:    'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION:   'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND:         'NEXT_SIM_ROUND',
  LOAD_QUESTIONS:         'LOAD_QUESTIONS',
  ANSWER_CORRECT:         'ANSWER_CORRECT',
  ANSWER_INCORRECT:       'ANSWER_INCORRECT',
  USE_HINT:               'USE_HINT',
  NEXT_QUESTION:          'NEXT_QUESTION',
  UNLOCK_BADGE:           'UNLOCK_BADGE',
  COMPLETE_PHASE:         'COMPLETE_PHASE',
  TOGGLE_AUDIO:           'TOGGLE_AUDIO',
  TOGGLE_MUSIC:           'TOGGLE_MUSIC',
  RESTORE_SESSION:        'RESTORE_SESSION',
  RESET_SESSION:          'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```js
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = Math.floor(state.currentQuestion / 10);
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}
```

---

## 5. Question Data Model

### 5.1 Question Schema

```ts
interface Question {
  id:            string;        // e.g. "Q2_003", "Q9_008"
  type:          QuestionType;  // One of 10 enum values (see below)
  world:         number;        // 0–9 (which world this belongs to)
  difficulty:    1 | 2 | 3;    // 1=easy, 2=medium, 3=hard

  // Core geometry values
  angleA?:       number;        // Degrees, if applicable
  angleB?:       number;
  angleC?:       number;
  angleD?:       number;
  sideAB?:       number;        // cm, if applicable
  sideCD?:       number;
  property:      PropertyType;  // Which property is being tested
  missingSlot:   'angleA' | 'angleB' | 'angleC' | 'angleD' | 'sideAB' | 'sideCD' | 'x';

  // Rendering
  questionText:  string;        // Full narrated question text (ElevenLabs reads this)
  visual:        VisualType;    // 'shapeDiagram' | 'picture' | 'sentence' | 'trueFalse'
  shapeSet?:     string[];      // For Q1/Q9 picture MCQs — set of shape descriptors

  // MCQ
  options?:      (number|string)[];  // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1:         string;        // Shown after 1 wrong attempt
  hint2:         string;        // Shown after 2 wrong attempts (animation trigger)
  explanation:   string;        // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?:  string;
  objectName?:     string;      // 'kite frame', 'gate', 'trellis', 'blueprint'

  // True/False only
  isTrue?:       boolean;

  // Algebraic only
  xValue?:       number;        // Value of x in algebraic questions

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'identify_shape'       // Q1: Tap the true parallelogram
  | 'opposite_angle'       // Q2: Find missing opposite angle
  | 'co_interior_angle'    // Q3: Find missing co-interior angle
  | 'missing_side'         // Q4: Find missing side length
  | 'true_false_property'  // Q5: Is this property statement true or false?
  | 'word_problem_angle'   // Q6: angle-context word problem
  | 'word_problem_side'    // Q7: side/perimeter-context word problem
  | 'algebraic_angle'      // Q8: algebraic unknown angle
  | 'diagonal_bisect'      // Q9: diagonal bisection — find segment
  | 'multi_step_reasoning'; // Q10: combine 2 properties

type PropertyType =
  | 'opposite_sides_equal'
  | 'opposite_sides_parallel'
  | 'opposite_angles_equal'
  | 'co_interior_angles'
  | 'diagonals_bisect';

type VisualType =
  | 'shapeDiagram'          // SVG labelled parallelogram (ParallelogramDiagram)
  | 'picture'               // Static shape card set
  | 'sentence'              // "∠A = ___°" with highlighted blank
  | 'trueFalse';            // Statement + True/False buttons
```

### 5.2 Sample Question Objects

```js
// Q2 — Opposite Angle
{
  id: "Q2_001",
  type: "opposite_angle",
  world: 0,
  difficulty: 1,
  angleA: 70, angleC: null,
  property: "opposite_angles_equal",
  missingSlot: "angleC",
  questionText: "In parallelogram ABCD, angle A is 70 degrees. What is angle C?",
  visual: "shapeDiagram",
  hint1: "Opposite angles in a parallelogram are always equal.",
  hint2: "Angle A and angle C are opposite each other. They are the same!",
  explanation: "Opposite angles are equal, so angle C = angle A = 70°.",
  options: [70, 100, 110, 140],
  correctAnswer: 70,
}

// Q6 — Word Problem (Angle Context)
{
  id: "Q6_004",
  type: "word_problem_angle",
  world: 3,
  difficulty: 2,
  angleA: 55, angleB: null,
  property: "co_interior_angles",
  missingSlot: "angleB",
  questionText: "Ryan's kite frame is shaped like a parallelogram. One angle is 55 degrees. What is the angle right next to it?",
  visual: "picture",
  characterName: "Ryan",
  objectName: "kite frame",
  hint1: "Angles next to each other on a parallelogram add up to 180 degrees.",
  hint2: "180 minus 55. Count with me: 125!",
  explanation: "Co-interior angles add up to 180°, so the angle next to it is 180 − 55 = 125°.",
  options: [55, 115, 125, 135],
  correctAnswer: 125,
}

// Q9 — Diagonal Bisection
{
  id: "Q9_002",
  type: "diagonal_bisect",
  world: 5,
  difficulty: 2,
  sideAB: null,
  property: "diagonals_bisect",
  missingSlot: "x",
  questionText: "The diagonals of parallelogram PQRS meet at point O. PO is 6 centimetres. How long is OR?",
  visual: "shapeDiagram",
  hint1: "The diagonals of a parallelogram cut each other exactly in half.",
  hint2: "PO and OR are the two halves of the same diagonal. They must be equal!",
  explanation: "Diagonals bisect each other, so OR = PO = 6 cm.",
  options: [3, 6, 9, 12],
  correctAnswer: 6,
}

// Q8 — Algebraic Unknown Angle
{
  id: "Q8_005",
  type: "algebraic_angle",
  world: 7,
  difficulty: 3,
  angleA: null, angleC: 80,
  property: "opposite_angles_equal",
  missingSlot: "x",
  questionText: "In parallelogram ABCD, angle A = 2x degrees and angle C = 80 degrees. Find x.",
  visual: "sentence",
  hint1: "Opposite angles are equal, so 2x must equal 80.",
  hint2: "Divide 80 by 2. What do you get?",
  explanation: "2x = 80, so x = 40.",
  options: [20, 40, 60, 80],
  correctAnswer: 40,
}
```

---

## 6. Parallelogram Diagram SVG Component

```jsx
// ParallelogramDiagram.jsx — reusable SVG for a labelled parallelogram

const ParallelogramDiagram = ({
  angleA, angleB, angleC, angleD,
  missingSlot,
  showDiagonals = false,
  animated = false,
  size = 'medium',  // 'small' | 'medium' | 'large'
}) => {

  const w = size === 'large' ? 320 : size === 'medium' ? 260 : 200;
  const h = size === 'large' ? 200 : size === 'medium' ? 160 : 120;
  const skew = w * 0.22;

  // Vertices: A (top-left), B (top-right), C (bottom-right), D (bottom-left)
  const A = { x: skew, y: 0 };
  const B = { x: w, y: 0 };
  const C = { x: w - skew, y: h };
  const D = { x: 0, y: h };

  const labelFor = (slot, value) =>
    missingSlot === slot ? '?' : `${value}°`;

  return (
    <svg viewBox={`-20 -20 ${w + 40} ${h + 40}`}
         xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto' }}>

      {/* Parallelogram outline */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
        fill="hsl(210, 70%, 94%)"
        stroke="hsl(210, 70%, 55%)"
        strokeWidth="3"
      />

      {/* Parallel-side arrows: AB / DC single arrow, AD / BC double arrow */}
      <text x={(A.x + B.x) / 2} y={A.y - 8} textAnchor="middle" fontSize="14">›</text>
      <text x={(D.x + C.x) / 2} y={C.y + 18} textAnchor="middle" fontSize="14">›</text>
      <text x={A.x - 14} y={(A.y + D.y) / 2} textAnchor="middle" fontSize="14">»</text>
      <text x={B.x + 14} y={(B.y + C.y) / 2} textAnchor="middle" fontSize="14">»</text>

      {/* Angle labels at each vertex */}
      <text x={A.x + 14} y={A.y + 20} fontSize="14" fontWeight="600">{labelFor('angleA', angleA)}</text>
      <text x={B.x - 34} y={B.y + 20} fontSize="14" fontWeight="600">{labelFor('angleB', angleB)}</text>
      <text x={C.x - 34} y={C.y - 10} fontSize="14" fontWeight="600">{labelFor('angleC', angleC)}</text>
      <text x={D.x + 14} y={D.y - 10} fontSize="14" fontWeight="600">{labelFor('angleD', angleD)}</text>

      {/* Vertex point labels */}
      <text x={A.x - 12} y={A.y - 6} fontSize="13" fill="#555">A</text>
      <text x={B.x + 6} y={B.y - 6} fontSize="13" fill="#555">B</text>
      <text x={C.x + 6} y={C.y + 16} fontSize="13" fill="#555">C</text>
      <text x={D.x - 12} y={D.y + 16} fontSize="13" fill="#555">D</text>

      {/* Optional diagonals */}
      {showDiagonals && (
        <>
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#999" strokeDasharray="4,3" />
          <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#999" strokeDasharray="4,3" />
          <circle cx={(A.x + C.x) / 2} cy={(A.y + C.y) / 2} r="3.5" fill="#555" />
          <text x={(A.x + C.x) / 2 + 8} y={(A.y + C.y) / 2 - 6} fontSize="12" fill="#555">O</text>
        </>
      )}
    </svg>
  );
};
```

**Animation variants:**
- `animated=true` → CSS `groupCirclePop`-style keyframe: outline and labels fade/scale in with 100ms stagger
- `shake` variant → CSS `shake` keyframe applied to `<svg>` wrapper on wrong answer
- `bounce` variant → CSS `bounceIn` keyframe applied to `<svg>` wrapper on correct answer

---

## 7. Simulation Station Component Specs

### 7.1 `BuildFrameStation.jsx` — Station A (Concrete)

**State:**
```js
const [target, setTarget] = useState(getStationARound(state.simRound));
// target: { base: 4, height: 2, skew: 1.5 }  (grid units)
const [vertices, setVertices] = useState(getInitialVertices(target));
// vertices: { A: {x,y}, B: {x,y}, C: {x,y}, D: {x,y} } — draggable grid points
```

**Interaction (Drag):**
- `VertexHandle` renders a draggable circular handle at each vertex on `Geoboard`
- Dragging a vertex updates its `{x, y}`; opposite vertex offset auto-tracks to preserve a valid quadrilateral silhouette
- Live property badges render below: "AB ∥ DC ✓/✗", "AB = DC ✓/✗", "AD ∥ BC ✓/✗", "AD = BC ✓/✗"

**Interaction (Tap fallback):**
- Tap a vertex → handle becomes "selected" (glows)
- Tap a target grid point → vertex moves there

**Completion Check:**
- `geometryEngine.isParallelogram(vertices)` → checks opposite-side vectors are equal & parallel
- Submit button appears once all 4 property checks read ✓
- On submit correct: mascot celebrates, ElevenLabs plays celebration audio
- On submit incorrect: shake + narration "Not quite a parallelogram yet — check the sides!"

**Station A Rounds (4 rounds, randomised order):**
```js
{ base: 4, height: 2, skew: 1 }
{ base: 6, height: 2, skew: 0.5 }
{ base: 3, height: 5, skew: 2 }
{ base: 3, height: 3, skew: 1.5 }   // rhombus-like
```

### 7.2 `SpotParallelogramStation.jsx` — Station B (Pictorial)

**State:**
```js
const [shapeCards, setShapeCards] = useState(generateShapeCards(round));
const [selected, setSelected] = useState([]);   // Indices of tapped cards
const [submitted, setSubmitted] = useState(false);
const [wrongPickMade, setWrongPickMade] = useState(false); // for Sharp Eye badge
```

**Card Generation (`generateShapeCards`):**
- Creates 4 shape cards: 1–2 are true parallelograms, 2–3 are distractors (trapezium, kite, irregular quadrilateral)
- Each card rendered as an SVG polygon with no angle/side labels (pure visual discrimination)
- Distractor shapes constructed with one non-parallel or unequal side pair (plausible, not obvious)

**Interaction:**
- Tap a card → border highlights (selected state)
- Multi-select allowed (student picks all true parallelograms)
- "Check" button submits selection
- On submit: correct cards glow green, wrong cards glow red (1.5s)
- If any wrong card selected → `wrongPickMade = true` (blocks Sharp Eye badge for this station run)
- Then advance to next round or next station

**Rounds (3 rounds per station):**
- Round 1: Parallelogram vs. rectangle vs. trapezium (easy visual split)
- Round 2: Parallelogram vs. kite vs. rhombus (medium)
- Round 3: Mixed rotated/tilted shapes (hard — attention required)

### 7.3 `AngleSentenceStation.jsx` — Station C (Abstract)

**State:**
```js
const [problem, setProblem] = useState(getAngleProblem(state.simRound));
// problem: { angleA, missingSlots: ['angleB','angleC','angleD'] }
const [inputValues, setInputValues] = useState({});
const [showDiagram, setShowDiagram] = useState(false);
```

**Layout:**
```jsx
<div className="angle-sentence-row">
  <span className="given-value">∠A = {problem.angleA}°</span>
  {problem.missingSlots.map(slot => (
    <BlankInput key={slot} label={`∠${slot.slice(-1)}`}
                value={inputValues[slot]} />
  ))}
</div>
<NumberPad max={180} value={activeInput} onChange={setActiveInput} onSubmit={handleSubmit} />
<button onClick={() => setShowDiagram(!showDiagram)}>Show me the property 📐</button>
{showDiagram && <ParallelogramDiagram angleA={problem.angleA}
                  missingSlot={activeSlot} showDiagonals={false} animated />}
```

**Variants (rotated across 3 rounds):**
- Round 1: Find opposite angle only → ∠A = 65°, find ∠C
- Round 2: Find co-interior angle only → ∠A = 65°, find ∠B
- Round 3: Find all three remaining angles → ∠A = 65°, find ∠B, ∠C, ∠D

ElevenLabs reads the full sentence aloud when displayed:
> "Angle A is sixty-five degrees. What is angle B? Type the answer!"

---

## 8. Audio Pipeline (ElevenLabs — Matching Reference Architecture)

### 8.1 Voice Configuration

| Setting | Value |
|---|---|
| Voice Name | Alice |
| Voice ID | `Xb7hH8MSUJpSbSDYk0k2` |
| Model | `eleven_multilingual_v2` |
| API Key Var | `VITE_ELEVENLABS_API_KEY` (in `.env.local`) |

### 8.2 Speech Style Settings (per style type)

| Style | stability | similarity_boost | style_exaggeration |
|---|---|---|---|
| statement | 0.75 | 0.75 | 0.0 |
| instruction | 0.80 | 0.75 | 0.0 |
| question | 0.60 | 0.80 | 0.3 |
| encouragement | 0.55 | 0.85 | 0.6 |
| emphasis | 0.85 | 0.70 | 0.1 |
| thinking | 0.65 | 0.80 | 0.2 |
| celebration | 0.45 | 0.90 | 0.8 |

### 8.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```js
const phrases = [
  // Phase 1 — Wonder
  { text: "Ryan is flying a kite shaped like a slanted box.", style: 'thinking' },
  { text: "He notices the opposite corners look the same. Are they really equal?", style: 'question' },
  { text: "Let us discover the secret properties of a parallelogram!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "Mei Ling helps her father build a sliding gate at their garden.", style: 'statement' },
  { text: "The gate frame is shaped like a parallelogram.", style: 'statement' },
  { text: "Opposite sides of the frame are the same length and never meet — they are parallel!", style: 'emphasis' },
  { text: "Opposite angles are equal too. Angle A equals angle C, and angle B equals angle D!", style: 'statement' },
  { text: "Angles next to each other add up to one hundred and eighty degrees. That is co-interior angles!", style: 'emphasis' },
  { text: "The two diagonals cross and cut each other exactly in half. They bisect each other!", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Drag the corners to build a parallelogram!", style: 'instruction' },
  { text: "Make sure opposite sides stay equal and parallel. Can you do it?", style: 'question' },
  { text: "Look at these shapes. Which ones are true parallelograms? Tap to choose!", style: 'instruction' },
  { text: "Now fill in the missing angle. Angle A is sixty-five degrees. What is angle B?", style: 'question' },

  // Phase 4 — Feedback
  { text: "Amazing! You found the property! You are a geometry star!", style: 'celebration' },
  { text: "Not quite! Let us look at the properties again.", style: 'encouragement' },
  { text: "Watch how the angles work together! Can you follow along?", style: 'thinking' },

  // Phase 5 — Reflect
  { text: "Wow, what a journey today! Can you tell me one property of a parallelogram you learned?", style: 'thinking' },
  { text: "Lesson complete! You are a Parallelogram Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! You are a Shape Explorer!", style: 'celebration' },
  { text: "Badge unlocked! Parallelogram Builder! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Angle Champion! You scored over eighty percent!", style: 'celebration' },
];

// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
```

### 8.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)
```

```js
const elevenLabsCache = new Map();  // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  // 1. Static map check (fastest path)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation (requires API key)
  if (!apiKey) return null;  // Silent skip — no fallback

  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue;  // Silent skip if no audio available

    // Eager preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }

    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);  // Resolves on 'ended' event
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve;  // Silent fail — never block UX
    audio.play().catch(resolve);
  });
}
```

### 8.5 Audio Cleanup (`scripts/clean_audio.js`)

- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 8.6 Narration Synchronisation Rules (1:1 Parity)

**CRITICAL:** Every on-screen text string that is narrated must match `narration.js` EXACTLY (same words, same punctuation, same capitalisation). Any UI text change requires:
1. Update `generate_audio.js` phrases array
2. Re-run: `node scripts/generate_audio.js`
3. Update corresponding text in the React UI component
4. Optionally run: `node scripts/clean_audio.js`

---

## 9. Randomisation Engine

### 9.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```js
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  // Pick 10 from each type (shuffled), then shuffle the combined 100
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}
```

### 9.2 MCQ Distractor Generation (`utils/scoring.js`)

```js
export function generateAngleDistractors(correct, min = 10, max = 170, count = 3) {
  const distractors = new Set();
  // Strategy: offsets of ±10°, ±20°, ±30° — plausible wrong angle values
  const offsets = [-30, -20, -10, 10, 20, 30];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count)
      distractors.add(d);
  });
  // Ensure always 4 options
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * 10;
    if (d <= max && d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}
```

### 9.3 Session Persistence (24-hour resume)

```js
const SESSION_KEY = 'intellia_parallelogram_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    worldScores: state.worldScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

---

## 10. Gamification Implementation

### 10.1 XP Calculation (`utils/scoring.js`)

```js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 10.2 Star Rating (per world of 10 questions)

```js
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;    // Gold: ≥90%
  if (correct >= 7) return 2;    // Silver: ≥70%
  if (correct >= 5) return 1;    // Bronze: ≥50% (world unlock gate)
  return 0;                       // Try again
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 10.3 Badge Engine (`utils/badgeEngine.js`)

```js
export const BADGES = [
  {
    id: 'shape_explorer',
    label: '🏅 Shape Explorer',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'parallelogram_builder',
    label: '🥈 Parallelogram Builder',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'angle_champion',
    label: '🥇 Angle Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_parallelogram',
    label: '💎 Perfect Parallelogram',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B without any wrong selection',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'diagonal_detective',
    label: '📐 Diagonal Detective',
    description: 'Answer 5 diagonal-bisection questions correctly',
    condition: (s) => (s.diagonalCorrect || 0) >= 5,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

---

## 11. CSS Animation Keyframes (matching equal-tau.vercel.app style)

```css
@keyframes bounceIn {
  0%   { transform: scale(0.3); opacity: 0; }
  50%  { transform: scale(1.05); opacity: 1; }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}

@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0%   { transform: rotate(-5deg) scale(1); }
  25%  { transform: rotate(5deg) scale(1.1); }
  50%  { transform: rotate(-3deg) scale(1.05); }
  75%  { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

@keyframes vertexPop {
  /* Applied to each draggable vertex handle with staggered delay */
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@keyframes shapeOutlinePop {
  0%   { stroke-dashoffset: 400; }
  100% { stroke-dashoffset: 0; }
}

/* Stagger: each vertex/label gets animation-delay: (index * 100ms) */
```

---

## 12. Component Prop Contracts

| Component | Props | Returns |
|---|---|---|
| `ParallelogramDiagram` | `{ angleA, angleB, angleC, angleD, missingSlot?, showDiagonals?, animated?, size? }` | SVG element (inline, responsive) |
| `Geoboard` | `{ gridSize, vertices, onVertexDrag, highlighted? }` | Dot-grid canvas with draggable vertex overlay |
| `VertexHandle` | `{ label, x, y, onDrag, onTap }` | Draggable/tappable circular handle |
| `NumberPad` | `{ max, value, onChange, onSubmit }` | Grid of digit buttons (min 44×44px), backspace, submit |
| `Mascot` | `{ mood: 'idle'\|'happy'\|'thinking'\|'celebrating'\|'encouraging' }` | img/svg + CSS animation class mapped to mood |
| `QuestionRenderer` | `{ question: Question, onAnswer: (answer: any) => void, hints: number }` | Type-specific question component |
| `FeedbackOverlay` | `{ isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }` | Animated modal overlay (bounceIn correct / shake wrong) |
| `WorldMap` | `{ worldScores: (number\|null)[], currentWorld: number, onSelectWorld: (i) => void }` | Horizontal scrollable world list with star ratings and lock icons |
| `BadgePanel` | `{ badges: string[], newBadgeId?: string }` | Badge grid with unlock toast animation for `newBadgeId` |

---

## 13. Performance Requirements

| Metric | Target |
|---|---|
| Initial load time | < 2 seconds (Vite production build) |
| Time to first meaningful paint | < 1 second |
| SVG animation frame rate | 60 fps |
| Memory usage | < 60 MB |
| Bundle size (gzipped) | < 600 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0ms (static .mp3 assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency) |

---

## 14. Browser & Device Support

| Environment | Support Level |
|---|---|
| Chrome 110+ (desktop) | Full |
| Safari 15+ (iPad) | Full — primary classroom device |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

Primary test device: iPad (768px, touch) — classroom use context
Secondary: Desktop Chrome (1280px+)
Tertiary: iPhone (375px — stacked layout)

---

## 15. WordPress Embedding (Intellia SG)

**Option A — React CDN Bundle (preferred)**
```html
<!-- In WordPress Custom HTML block at lesson page -->
<div id="parallelogram-app"></div>
<script src="https://cdn.intelliasg.com/lessons/parallelogram.js"></script>
```

**Option B — iframe Embed**
```html
<iframe
  src="https://lessons.intelliasg.com/grade5/parallelogram"
  width="100%"
  height="780px"
  frameborder="0"
  allow="autoplay; microphone"
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12);"
></iframe>
```

Dimensions: 100% width, 780px height (scrollable internally on mobile).
Page layout must match the Intellia SG lesson page structure exactly.

---

## 16. Quality Assurance Checklist

| Category | Test Case | Status |
|---|---|---|
| Audio | Pre-generated .mp3 plays for all phase narration | TBD |
| Audio | Dynamic ElevenLabs generation works with API key | TBD |
| Audio | Silent skip (no crash) when API key absent | TBD |
| Audio | Segment preloading eliminates gaps between sentences | TBD |
| Audio | No audio plays when `audioEnabled=false` | TBD |
| Questions | All 100 questions render without error | TBD |
| Questions | MCQ always includes correct answer in options | TBD |
| Questions | No duplicate options in any MCQ question | TBD |
| Questions | Randomisation produces unique order each session | TBD |
| Questions | All 10 question types appear in every session | TBD |
| Simulations | Station A: vertex drag placement works (touch + mouse) | TBD |
| Simulations | Station A: tap fallback works on touch-only devices | TBD |
| Simulations | Station A: parallelogram validity check triggers correct feedback | TBD |
| Simulations | Station B: shape identification works all rounds | TBD |
| Simulations | Station C: number pad submits and evaluates correctly | TBD |
| Simulations | ParallelogramDiagram SVG renders correctly across angle ranges | TBD |
| Phases | All 5 phases navigate end-to-end without error | TBD |
| Phases | Phase cannot be skipped (gate logic enforced) | TBD |
| Gamification | XP increments correctly (10/7/5 + streak bonus) | TBD |
| Gamification | Star rating correct (0/1/2/3 per world) | TBD |
| Gamification | All 8 badges unlock at exactly the correct conditions | TBD |
| Gamification | Streak resets to 0 on wrong answer | TBD |
| Gamification | World unlock gate (≥5/10 required) | TBD |
| Gamification | Badge audio plays on unlock | TBD |
| Persistence | localStorage saves all state correctly | TBD |
| Persistence | Restored session resumes at correct phase/question | TBD |
| Persistence | Session expires and resets after 24 hours | TBD |
| Persistence | "New Game" clears storage and re-randomises questions | TBD |
| Responsive | Layout correct on 768px tablet (primary target) | TBD |
| Responsive | Layout correct on 375px mobile (stacked) | TBD |
| Responsive | Layout correct on 1280px desktop | TBD |
| Accessibility | All tap targets ≥ 44×44px | TBD |
| Accessibility | WCAG AA colour contrast on all text | TBD |
| Accessibility | Keyboard navigation functional (Tab + Enter) | TBD |
| Accessibility | Drag fallback available for all drag interactions | TBD |
| Performance | Lighthouse Performance ≥ 90 | TBD |
| Performance | Bundle < 600KB gzipped (Vite build) | TBD |
| Performance | Animations run at 60fps on iPad | TBD |
| Curriculum | All MOE LO1–LO7 covered across phases + questions | TBD |
| Curriculum | MOE vocabulary used correctly in all question text | TBD |
| Curriculum | Word problem format matches MOE Targeting Maths style | TBD |

---

## 17. Audio File Management Workflow

| Step | Action |
|---|---|
| 1 | Add phrase to `scripts/generate_audio.js` phrases array |
| 2 | Run: `node scripts/generate_audio.js` (hits ElevenLabs API, saves .mp3) |
| 3 | Verify .mp3 playback quality matches intended speech style |
| 4 | Auto-generated `audioMap.js` is updated (maps text → `/assets/audio/*.mp3`) |
| 5 | Update matching text in React UI component (exact text match required) |
| 6 | Update matching text in `src/utils/narration.js` (1:1 parity rule) |
| 7 | Optional: `node scripts/clean_audio.js` (remove orphaned .mp3 files) |
| 8 | Commit updated `audioMap.js` + `.mp3` files + component changes together |

---

## 18. Deployment Pipeline

| Step | Action |
|---|---|
| 1 | `npm install` (Vite + React 18 + ElevenLabs dependencies) |
| 2 | `node scripts/generate_audio.js` (pre-generate all phase .mp3 files) |
| 3 | `npm run build` (Vite production bundle) |
| 4 | Upload `dist/` to CDN or Vercel (preview deploy) |
| 5 | QA pass on preview URL (full checklist above, §16) |
| 6 | Embed into WordPress via Option A or B (§15) |
| 7 | Final QA on `intelliasg.com/courses/grade-5-math/lessons/parallelogram/` |
| 8 | Set lesson status = Live in LearnPress LMS |
| 9 | Verify ElevenLabs API key is set in production environment |

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 5 Math, Lesson 6.2
**Lesson Title:** Parallelogram — Properties & Angle Relationships
**Curriculum:** Singapore MOE Primary 5 Mathematics
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/numberbound
**Audio Pipeline:** ElevenLabs — Voice: Alice (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`
**Technical Lead:** Intellia Engineering Team
**Curriculum Refs:** Targeting Mathematics Primary 5B (Casco Publications); My Pals Are Here! Maths Primary 5B (Marshall Cavendish); Singapore MOE Primary 1–6 Mathematics Syllabus (2013, Revised)
**Parent Course Page:** https://intelliasg.com/courses/grade-5-math/
**Lesson URL:** https://intelliasg.com/courses/grade-5-math/lessons/parallelogram/
