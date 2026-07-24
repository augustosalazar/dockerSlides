import { defineShikiSetup } from '@slidev/types'

// Force a dark syntax theme so command code blocks look like a terminal
// (matching the .term output blocks), but with colored syntax highlighting.
export default defineShikiSetup(() => ({
  themes: {
    light: 'github-dark-high-contrast',
    dark: 'github-dark-high-contrast',
  },
}))
