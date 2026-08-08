/**
 * Every step used to wrap its save in `if (sessionId)`. When the session had
 * never been created that check silently skipped the request while the UI still
 * reported success — a student could finish a whole ILS with zero network
 * calls. Steps now go through `withSession`, which lazily creates the session
 * on demand and throws when one genuinely can't be established, so a failed
 * save can never look like a successful one.
 */

export class SessionUnavailableError extends Error {
  constructor() {
    super("No learning session is available");
    this.name = "SessionUnavailableError";
  }
}

export type EnsureSession = () => Promise<string | null>;

export async function withSession<T>(
  sessionId: string | undefined,
  ensureSession: EnsureSession | undefined,
  fn: (sessionId: string) => Promise<T>,
): Promise<T> {
  const id = sessionId || (ensureSession ? await ensureSession() : null);
  if (!id) throw new SessionUnavailableError();
  return fn(id);
}

export function saveErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof SessionUnavailableError) {
    return "Your answer was not saved — no active session. Please reopen the learning space.";
  }
  const apiMessage = (err as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return apiMessage || fallback;
}

export interface AlreadySubmittedResult {
  score: number;
  feedback?: string;
  badgeAwarded: boolean;
  completedAt?: string;
  /** Server closed the attempt itself, e.g. when a time limit expired. */
  autoSubmitted?: boolean;
}

/**
 * A 409 from the assessment endpoint isn't really a failure — the body carries
 * the result that was already recorded. Pull it out so the student sees their
 * score instead of an error.
 */
export function readAlreadySubmitted(
  err: unknown,
): AlreadySubmittedResult | null {
  const response = (err as { response?: { status?: number; data?: unknown } })
    ?.response;
  if (response?.status !== 409) return null;

  const data = response.data as Partial<AlreadySubmittedResult> | undefined;
  if (!data || typeof data !== "object") return null;
  if (typeof data.score !== "number") return null;

  return {
    score: data.score,
    feedback: data.feedback,
    badgeAwarded: !!data.badgeAwarded,
    completedAt: data.completedAt,
    autoSubmitted: !!data.autoSubmitted,
  };
}

/** Falls back to the persisted session when context hasn't hydrated yet. */
export function readStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.userId ?? parsed?.id ?? null;
  } catch {
    return null;
  }
}
