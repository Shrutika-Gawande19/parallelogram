import { say, instruct, ask, cheer, celebrate } from './audio';
import { storyPanels } from '../data/storyContent';

export function getStoryNarration(panelIndex) {
  const panel = storyPanels[panelIndex];
  if (!panel) return [];
  return [say(panel.body)];
}

const WONDER_STEPS_TEXT = [
  "Look at this playground gate sliding open...",
  "The two long bars are always the same length and always stay parallel!",
  "What shape do the bars make when the gate tilts? Let's find out!",
];

export function wonderNarration(step = 0, revealed = false) {
  if (revealed) {
    return [say("Let's discover what shape this is! We'll explore its properties and find out!")];
  }
  const text = WONDER_STEPS_TEXT[step] || WONDER_STEPS_TEXT[0];
  return [say(text)];
}

export function simulateInstruction(stationIndex) {
  if (stationIndex === 0) {
    return [
      instruct("Welcome to the Shape Shifter! Drag the top-right corner to tilt the shape. Can you make it a parallelogram?"),
    ];
  } else if (stationIndex === 1) {
    return [
      instruct("Welcome to the Repair Shop! Use the tools to fix these broken shapes by selecting the correct missing sides or angles!"),
    ];
  } else if (stationIndex === 2) {
    return [
      instruct("Welcome to the City Builder! Adjust the base, height, and slant to create different parallelograms and watch how the area changes."),
    ];
  }
  return [];
}

export function simulateStationCompleteNarration() {
  return [cheer("Great job! Station completed!")];
}

export function playWorldMapNarration() {
  return [say("Select your world to begin!")];
}

export function playFeedbackNarration(isCorrect) {
  if (isCorrect) {
    return [cheer("Correct! Great job!")];
  } else {
    return [say("Oops! Try again!")];
  }
}

export function reflectNarration() {
  return [
    say("Great job! Let's reflect on what we've learned today about parallelograms. Think about how their properties help us in the real world."),
  ];
}
