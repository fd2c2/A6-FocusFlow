# 🎯 FocusFlow
> A gamified productivity dashboard for students and professionals.

Built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no dependencies.

---

## 📁 Project Structure

```
FocusFlow/
├── index.html              # App shell — loads all pages dynamically
├── assets/
│   ├── css/
│   │   └── global.css      # Shared styles, variables, animations
│   └── js/
│       └── global.js       # Shared logic — storage, routing, gamification
├── pages/
│   ├── home.html           # Live clock, quote, calendar, weekly notes
│   ├── dashboard.html      # Stats, goal bars, task preview, quick-add
│   ├── tasks.html          # Task manager with priorities and due dates
│   ├── focus.html          # Pomodoro timer, deep work mode, ambient audio
│   ├── progress.html       # Badges, weekly chart, session table
│   ├── settings.html       # Timer, theme, profile, custom quotes
│   ├── about.html          # Project info, features, team
│   ├── contact.html        # Contact form, map, project links
│   └── faq.html            # FAQ, testimonials, blog links
└── assets/
    └── media/              # Ambient audio (mp3) + deep work video (mp4)
```

---

## 🚀 Website

https://fd2c2.github.io/A6-FocusFlow/

---

## 🎮 Gamification Rules

| Action | Points |
|--------|--------|
| Complete a focus session | +10 pts |
| Complete a high priority task | +20 pts |
| Complete a medium priority task | +10 pts |
| Complete a low priority task | +5 pts |

Badges unlock at score milestones (50, 200, 1000, 5000 pts) and streak milestones (7 days).

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `H` | Go to Home |
| `D` | Go to Dashboard |
| `T` | Go to Tasks |
| `F` | Go to Focus Lab |
| `P` | Go to Progress |
| `S` | Go to Settings |
| `Space` | Start / Pause timer |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, forms, media, tables, details/summary
- **CSS3** — Custom properties, Flexbox, Grid, animations, dark mode
- **JavaScript** — DOM manipulation, localStorage, Fetch API, Web Audio API, Notifications API, Geolocation API, Drag and Drop
- **Phosphor Icons** — Icon library via CDN
- **Google Fonts** — Fredoka One + Nunito
- **Formspree** — Contact form submissions

---

