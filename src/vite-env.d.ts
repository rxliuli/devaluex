/// <reference types="svelte" />
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

declare module 'vitest/browser' {
  interface Locator {
    element(): HTMLElement
  }
  interface BrowserCommands {
    selectFile: (id: string) => Promise<void>
  }
}

export {}
