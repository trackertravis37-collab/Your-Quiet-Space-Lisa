@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/*
Design philosophy: Nocturne Minimalism
- Soft contrast, deep night inks, gentle teal highlights
- Slow transitions, no sharp movement
- Small grain + particles to feel alive, not busy
*/

:root {
  --radius: 0.8rem;

  /* Core palette from spec */
  --ink-0: #0b0f1a; /* dark blue/black */
  --ink-1: #1c2541; /* soft blue */
  --glow: #5bc0be; /* gentle highlight */

  /* Theme tokens (OKLCH for Tailwind v4 @theme) */
  --background: oklch(0.15 0.02 260);
  --foreground: oklch(0.97 0.01 255);

  --card: oklch(0.18 0.03 260);
  --card-foreground: var(--foreground);

  --popover: oklch(0.18 0.03 260);
  --popover-foreground: var(--foreground);

  --primary: oklch(0.78 0.08 190); /* teal-ish */
  --primary-foreground: oklch(0.17 0.02 260);

  --secondary: oklch(0.22 0.03 260);
  --secondary-foreground: var(--foreground);

  --muted: oklch(0.22 0.03 260);
  --muted-foreground: oklch(0.78 0.02 255);

  --accent: oklch(0.22 0.03 260);
  --accent-foreground: var(--foreground);

  --destructive: oklch(0.64 0.19 25);
  --border: oklch(0.33 0.02 260 / 55%);
  --input: oklch(0.33 0.02 260 / 55%);
  --ring: oklch(0.78 0.08 190 / 60%);

  --chart-1: oklch(0.78 0.08 190);
  --chart-2: oklch(0.72 0.07 200);
  --chart-3: oklch(0.67 0.06 210);
  --chart-4: oklch(0.62 0.05 220);
  --chart-5: oklch(0.57 0.04 230);

  --sidebar: var(--card);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--secondary);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}

.dark {
  /* We keep the same palette in dark mode (site is night by default) */
  --background: oklch(0.15 0.02 260);
  --foreground: oklch(0.97 0.01 255);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  html,
  body {
    height: 100%;
  }

  body {
    @apply bg-background text-foreground;
    font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  }

  h1,
  h2,
  h3 {
    font-family: "Playfair Display", ui-serif, Georgia, serif;
    letter-spacing: 0.01em;
  }
}

/* subtle film grain */
.grain::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  opacity: 0.08;
}

/* ambient gradient */
.night-gradient {
  background: radial-gradient(900px 500px at 20% 20%, rgba(91, 192, 190, 0.12), transparent 60%),
    radial-gradient(700px 420px at 80% 20%, rgba(91, 192, 190, 0.08), transparent 55%),
    radial-gradient(900px 700px at 50% 100%, rgba(28, 37, 65, 0.8), rgba(11, 15, 26, 0.92) 55%, rgba(11, 15, 26, 1) 100%);
}

/* breathing */
@keyframes breathe {
  0% {
    transform: scale(0.92);
    opacity: 0.35;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.65;
  }
  100% {
    transform: scale(0.92);
    opacity: 0.35;
  }
}

.breathe {
  animation: breathe 6s ease-in-out infinite;
}

/* slow fade utility */
@keyframes softFadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.soft-enter {
  animation: softFadeUp 1.4s ease-out both;
}
