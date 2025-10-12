import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';


const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useLocalStorage Hook', () => {
  const key = 'test-key';
  const initialValue = 'initial-value';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with initial value when no localStorage item', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toBe(initialValue);
  });

  test('initializes with stored value from localStorage', () => {
    const storedValue = 'stored-value';
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedValue));
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toBe(storedValue);
  });

  test('updates value and persists to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify('new-value'));
  });

  test('handles updater function correctly', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialValue));
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1]((prev) => `${prev}-updated`);
    });

    expect(result.current[0]).toBe('initial-value-updated');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify('initial-value-updated'));
  });

  test('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Mock error');
    });
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toBe(initialValue); 
  });
});
