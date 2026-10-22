import { useSyncExternalStore } from "react";

// Lets the module's Wave mascot act as the Ask Wave entry point, so there is one Wave on screen instead of two.
const OPEN_EVENT = "ask-wave:open";

let hostCount = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Opens the Ask Wave chat panel from anywhere. */
export function openAskWave() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenAskWave(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

/** Called by a component that already offers Ask Wave itself (the mascot); returns an unregister function. */
export function registerAskWaveHost() {
  hostCount += 1;
  emit();
  return () => {
    hostCount -= 1;
    emit();
  };
}

/** True while some other component is acting as the Ask Wave entry, so the floating pill should hide. */
export function useAskWaveHostPresent() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => hostCount > 0,
  );
}
