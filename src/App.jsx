import { useReducer, useEffect, useCallback, useRef } from 'react';
import './index.css';
import FloatingShapes from './components/FloatingShapes';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';
import ProgressMap from './components/ProgressMap';
import BadgePanel from './components/gamification/BadgePanel';
import { checkBadges } from './utils/badgeEngine';
import { generateSessionQuestions, partitionIntoWorlds } from './utils/shuffle';
import { questionBank } from './data/questionBank';
import { stopNarration } from './utils/audio';

// ===== CONSTANTS =====
export const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect', 'complete'];

export const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

const PHASE_ORDER = ['wonder', 'story', 'simulate', 'play', 'reflect'];

const SESSION_KEY = 'intellia_parallelogram_v1';

// ===== INITIAL STATE =====
function makeInitialState() {
  const sessionQuestions = generateSessionQuestions(questionBank);
  const worlds = partitionIntoWorlds(sessionQuestions);
  return {
    phase: 'intro',
    storyPanel: 0,
    currentSimStation: 0,
    simStationsComplete: 0,
    buildStationComplete: false,
    stationBPerfect: true,
    currentWorld: 0,
    worldQuestions: worlds,
    worldScores: {},
    worldCompleted: {},
    currentQuestion: 0,
    hintsUsed: 0,
    attemptCount: 0,
    xp: 0,
    streak: 0,
    maxStreak: 0,
    badges: [],
    newBadge: null,
    diagonalCorrect: false,
    audioEnabled: true,
    sessionId: Date.now(),
  };
}

// ===== REDUCER =====
function reducer(state, action) {
  let next = { ...state };

  switch (action.type) {
    case 'SET_PHASE':
      if (action.payload === 'simulate' && state.phase !== 'simulate') {
        next.currentSimStation = 0;
        next.simStationsComplete = 0;
      }
      if (action.payload === 'story' || action.payload === 'wonder') {
        next.storyPanel = 0;
      }
      next.phase = action.payload;
      next.newBadge = null;
      break;

    case 'NEXT_STORY_PANEL':
      next.storyPanel = Math.min(5, state.storyPanel + 1);
      if (next.storyPanel >= 5) next.storyPanelDone = true;
      break;

    case 'PREV_STORY_PANEL':
      next.storyPanel = Math.max(0, state.storyPanel - 1);
      break;

    case 'COMPLETE_SIM_STATION': {
      const completedStation = action.payload;
      next.simStationsComplete = Math.max(state.simStationsComplete, completedStation + 1);
      if (completedStation === 0) next.buildStationComplete = true;
      if (completedStation === 1 && action.perfect === false) next.stationBPerfect = false;
      next.currentSimStation = Math.min(2, completedStation + 1);
      break;
    }

    case 'SET_SIM_STATION':
      next.currentSimStation = action.payload;
      break;

    case 'ANSWER_CORRECT': {
      const { xpEarned, questionType } = action.payload;
      next.xp = state.xp + xpEarned;
      next.streak = state.streak + 1;
      next.maxStreak = Math.max(state.maxStreak, next.streak);
      next.hintsUsed = 0;
      next.attemptCount = 0;
      if (questionType === 'diagonal_bisect') next.diagonalCorrect = true;

      // World score tracking
      const wIdx = state.currentWorld;
      const prevScore = state.worldScores[wIdx] || 0;
      next.worldScores = { ...state.worldScores, [wIdx]: prevScore + 1 };
      break;
    }

    case 'ANSWER_INCORRECT':
      next.streak = 0;
      next.attemptCount = state.attemptCount + 1;
      break;

    case 'USE_HINT':
      next.hintsUsed = state.hintsUsed + 1;
      break;

    case 'NEXT_QUESTION': {
      const wIdx = state.currentWorld;
      const wQs = state.worldQuestions[wIdx] || [];
      const nextQ = state.currentQuestion + 1;
      if (nextQ >= wQs.length) {
        // World complete — try to advance
        next.worldCompleted = { ...state.worldCompleted, [wIdx]: true };
        next.currentQuestion = 0;
        next.hintsUsed = 0;
        next.attemptCount = 0;
        // Don't auto-advance world; WorldMap handles navigation
      } else {
        next.currentQuestion = nextQ;
        next.hintsUsed = 0;
        next.attemptCount = 0;
      }
      break;
    }

    case 'SET_WORLD':
      next.currentWorld = action.payload;
      next.currentQuestion = 0;
      next.hintsUsed = 0;
      next.attemptCount = 0;
      break;

    case 'UNLOCK_BADGE': {
      const badgeId = action.payload;
      if (!state.badges.includes(badgeId)) {
        next.badges = [...state.badges, badgeId];
        next.newBadge = badgeId;
      }
      break;
    }

    case 'CLEAR_NEW_BADGE':
      next.newBadge = null;
      break;

    case 'TOGGLE_AUDIO':
      next.audioEnabled = !state.audioEnabled;
      break;

    case 'RESTORE_SESSION':
      return { ...makeInitialState(), ...action.payload, newBadge: null };

    default:
      break;
  }

  // Auto badge check after every action
  const newBadgeIds = checkBadges(next);
  if (newBadgeIds.length > 0) {
    next.badges = [...new Set([...next.badges, ...newBadgeIds])];
    next.newBadge = next.newBadge || newBadgeIds[0];
  }

  return next;
}

// ===== APP =====
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, makeInitialState);
  const xpFloatRef = useRef(null);

  // Session restore on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const age = Date.now() - (parsed.sessionId || 0);
        if (age < 24 * 60 * 60 * 1000) {
          dispatch({ type: 'RESTORE_SESSION', payload: parsed });
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Persist on every state change
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        ...state,
        worldQuestions: undefined, // don't persist large question set
        sessionId: state.sessionId,
      }));
    } catch (e) { /* ignore */ }
  }, [state]);

  const toggleAudio = useCallback(() => {
    stopNarration();
    dispatch({ type: 'TOGGLE_AUDIO' });
  }, []);

  const goHome = useCallback(() => {
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }, []);

  const phaseIndex = PHASE_ORDER.indexOf(state.phase);
  const isInPhase = state.phase !== 'intro' && state.phase !== 'complete';

  return (
    <>
      <FloatingShapes />
      <div className="app-container">
        {/* Journey bar — only during active phases */}
        {isInPhase && (
          <ProgressMap phase={state.phase} phaseOrder={PHASE_ORDER} />
        )}

        {/* Home button */}
        {isInPhase && (
          <button className="home-btn" onClick={goHome} id="home-btn" aria-label="Go home">
            🏠 Home
          </button>
        )}

        {/* Audio toggle */}
        <button
          className="audio-toggle-btn"
          onClick={toggleAudio}
          id="audio-toggle-btn"
          aria-label={state.audioEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {state.audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Phase renderer */}
        {state.phase === 'intro' && (
          <IntroScreen
            onStart={() => dispatch({ type: 'SET_PHASE', payload: 'wonder' })}
            audioEnabled={state.audioEnabled}
          />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'story' })}
            dispatch={dispatch}
            state={state}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            panelIndex={state.storyPanel}
            onNext={() => dispatch({ type: 'NEXT_STORY_PANEL' })}
            onPrev={() => dispatch({ type: 'PREV_STORY_PANEL' })}
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'simulate' })}
            dispatch={dispatch}
            state={state}
          />
        )}

        {state.phase === 'simulate' && (
          <SimulatePhase
            currentStation={state.currentSimStation}
            simStationsComplete={state.simStationsComplete}
            onCompleteStation={(idx, perfect) =>
              dispatch({ type: 'COMPLETE_SIM_STATION', payload: idx, perfect })
            }
            onSetStation={idx => dispatch({ type: 'SET_SIM_STATION', payload: idx })}
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'play' })}
            dispatch={dispatch}
            state={state}
          />
        )}

        {state.phase === 'play' && (
          <PlayPhase
            state={state}
            dispatch={dispatch}
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
          />
        )}

        {state.phase === 'reflect' && (
          <ReflectPhase
            state={state}
            dispatch={dispatch}
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'complete' })}
          />
        )}

        {state.phase === 'complete' && (
          <ReflectPhase
            state={state}
            dispatch={dispatch}
            onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}
            isComplete
          />
        )}

        {/* Badge unlock toast removed per user request */}
      </div>
    </>
  );
}
