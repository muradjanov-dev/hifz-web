"use client";

import { useEffect, useState } from "react";

const STORY_MODE_KEY = "hifz_story_mode";

/**
 * Story mode: when on (default), crossing a valley while memorizing reveals
 * its story. When off, memorization is plain — no story interludes.
 */
export function useStoryMode() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORY_MODE_KEY);
      if (v === "0") setEnabled(false);
    } catch {
      /* storage blocked */
    }
  }, []);

  function set(next: boolean) {
    setEnabled(next);
    try {
      localStorage.setItem(STORY_MODE_KEY, next ? "1" : "0");
    } catch {
      /* storage blocked */
    }
  }

  return { storyMode: enabled, setStoryMode: set, toggle: () => set(!enabled) };
}
