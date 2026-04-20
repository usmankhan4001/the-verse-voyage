import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveState, AppState } from './store';

describe('saveState', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle localStorage.setItem errors gracefully and log to console', () => {
    // Arrange
    const mockError = new Error('QuotaExceededError');
    setItemSpy.mockImplementation(() => {
      throw mockError;
    });

    const mockState = {
      students: [],
      attendance: {},
      sessionProgress: {},
      studentProgress: {},
      quizSubmissions: [],
      quizzes: [],
      teacherNotes: {},
      settings: {
        theme: 'system',
        currentPhase: 1,
        unlockedPhase: 1,
        courseName: 'Test',
        teacherName: 'Test',
      },
    } as AppState;

    // Act
    // Should not throw
    expect(() => saveState(mockState)).not.toThrow();

    // Assert
    expect(setItemSpy).toHaveBeenCalledWith('juz-amma-cms', JSON.stringify(mockState));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save state:', mockError);
  });
});
