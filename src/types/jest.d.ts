
/// <reference types="jest" />

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> extends import('@testing-library/jest-dom/matchers').TestingLibraryMatchers<R> {}
  }
}
