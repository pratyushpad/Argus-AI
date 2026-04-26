export interface AppPreferences {
  autoSave: boolean;
  notifications: boolean;
}

const STORAGE_KEY = "argus_preferences";

const DEFAULT_PREFERENCES: AppPreferences = {
  autoSave: true,
  notifications: true,
};

export function getPreferences(): AppPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return {
      autoSave: parsed.autoSave ?? DEFAULT_PREFERENCES.autoSave,
      notifications: parsed.notifications ?? DEFAULT_PREFERENCES.notifications,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: AppPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function resetPreferences() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
