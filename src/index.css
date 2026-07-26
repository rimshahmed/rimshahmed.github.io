@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0c0c0c;
  --surface: #141419;
  --ink: #d7e2ea;
  --muted: #8a929b;
  --monitor: #4fc9ff;
  --monitor-2: #a8e8ff;
  --pop: #b600a8;
  --line: rgba(215, 226, 234, 0.12);

  /* cursor position, written by <CursorLight /> */
  --mx: 50vw;
  --my: 50vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#root {
  background: var(--bg);
  font-family: 'Kanit', sans-serif;
  color: var(--ink);
}

html {
  scroll-behavior: smooth;
}

/* Gradient display type used on every major heading */
.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #bbccd7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* The page-level cyan wash that follows the cursor.
   The sentinel's light appears to spill onto the page itself. */
.cursor-light {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: radial-gradient(
    circle 380px at var(--mx) var(--my),
    rgba(79, 201, 255, 0.1),
    transparent 70%
  );
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .cursor-light {
    display: none;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
