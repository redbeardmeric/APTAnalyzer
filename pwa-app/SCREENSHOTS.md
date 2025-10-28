# RAPTOR PWA - Screenshots & Visual Guide

Visual documentation of the RAPTOR Progressive Web App interface and features.

## Table of Contents

- [Application Overview](#application-overview)
- [Main Interface](#main-interface)
- [Selection Process](#selection-process)
- [Analysis Results](#analysis-results)
- [Group Details](#group-details)
- [PWA Features](#pwa-features)
- [Mobile Experience](#mobile-experience)

---

## Application Overview

### Landing Page / Home

```
┌─────────────────────────────────────────────────────────────────────┐
│  🛡️ R.A.P.T.O.R.                              [Home] [GitHub] [ATT&CK]│
│  Ranking Advanced Persistent Threat Ontological Report              │
│  ATT&CK v18.0 • 150 Groups • 800 Techniques • 700 Software         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐ │
│  │  Selection Panel │  │                                         │ │
│  │                  │  │        Welcome to RAPTOR                │ │
│  │  Filter by Tactic│  │                                         │ │
│  │  ┌─────────────┐ │  │  Select techniques and software you've  │ │
│  │  │[All Tactics]│ │  │  observed to identify potential APT     │ │
│  │  └─────────────┘ │  │  groups behind an attack.              │ │
│  │                  │  │                                         │ │
│  │  Techniques      │  │  Getting Started:                      │ │
│  │  ┌───────────┐  │  │  1. Select observed techniques         │ │
│  │  │ 🔍 Search │  │  │  2. Add identified software            │ │
│  │  └───────────┘  │  │  3. Adjust match threshold             │ │
│  │  • Phishing     │  │  4. Click Analyze                      │ │
│  │  • PowerShell   │  │                                         │ │
│  │  • Credential   │  │                                         │ │
│  │    Dumping      │  │                                         │ │
│  │  ...            │  │                                         │ │
│  │                  │  │                                         │ │
│  │  Software        │  │                                         │ │
│  │  ┌───────────┐  │  │                                         │ │
│  │  │ 🔍 Search │  │  │                                         │ │
│  │  └───────────┘  │  │                                         │ │
│  │  • Cobalt Strike│  │                                         │ │
│  │  • Mimikatz     │  │                                         │ │
│  │  ...            │  │                                         │ │
│  │                  │  │                                         │ │
│  │  ─────────────  │  │                                         │ │
│  │  Threshold: 50% │  │                                         │ │
│  │  ━━━━━━━━━━━━  │  │                                         │ │
│  │                  │  │                                         │ │
│  │  Potential: 0   │  │                                         │ │
│  │  [▶ Analyze]    │  │                                         │ │
│  └──────────────────┘  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Dark theme (#282C2E background)
- Logo with colored letters (R.A.P.T.O.R.)
- Data source info in header
- Clean two-panel layout

---

## Main Interface

### Selection Panel (Left Sidebar)

```
┌──────────────────────────┐
│  Selection               │
│  Select observed         │
│  techniques and software │
├──────────────────────────┤
│  Filter by Tactic        │
│  ┌─────────────────────┐ │
│  │ [All Techniques]  ▼ │ │  ← Dropdown shows 14 MITRE tactics
│  └─────────────────────┘ │
├──────────────────────────┤
│  Techniques              │
│  ┌─────────────────────┐ │
│  │ 🔍 Search...        │ │  ← Live search filter
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │ Phishing            │ │  ← Click to add
│  │ T1566               │ │
│  ├─────────────────────┤ │
│  │ PowerShell          │ │
│  │ T1059.001           │ │
│  ├─────────────────────┤ │
│  │ Credential Dumping  │ │
│  │ T1003               │ │
│  └─────────────────────┘ │
├──────────────────────────┤
│  Software                │
│  ┌─────────────────────┐ │
│  │ 🔍 Search...        │ │
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │ Cobalt Strike       │ │
│  │ malware • S0154     │ │
│  ├─────────────────────┤ │
│  │ Mimikatz            │ │
│  │ tool • S0002        │ │
│  └─────────────────────┘ │
├──────────────────────────┤
│  Selected            [×] │  ← Clear all
│  Techniques:             │
│  [Phishing ×]           │  ← Click × to remove
│  [PowerShell ×]         │
│                          │
│  Software:               │
│  [Cobalt Strike ×]      │
├──────────────────────────┤
│  Match Threshold         │
│  ━━━━━━━━━━━━━━━ 75%   │  ← Slider (50-100%)
│  50%      75%      100%  │
│                          │
│  Potential Matches: 12   │  ← Real-time count
│  ┌────────────────────┐  │
│  │  ▶ Analyze    [↻]  │  │  ← Primary action
│  └────────────────────┘  │
└──────────────────────────┘
```

**Features:**
- Scrollable lists with custom scrollbars
- Badge system for IDs and types
- Disabled state for already-selected items
- Real-time counter updates

---

## Selection Process

### Step 1: Filter by Tactic

```
┌─────────────────────────┐
│ Filter by Tactic        │
│ ┌─────────────────────┐ │
│ │ Execution         ▼ │ │  ← Click opens dropdown
│ └─────────────────────┘ │
```

**Dropdown Options:**
```
┌─────────────────────────┐
│ All Techniques          │  ← Shows all 800+
├─────────────────────────┤
│ Reconnaissance          │
│ Resource Development    │
│ Initial Access          │
│ Execution              │  ← Selected
│ Persistence             │
│ Privilege Escalation    │
│ Defense Evasion         │
│ Credential Access       │
│ Discovery               │
│ Lateral Movement        │
│ Collection              │
│ Command and Control     │
│ Exfiltration            │
│ Impact                  │
└─────────────────────────┘
```

### Step 2: Search and Select

```
Techniques List (Execution tactic selected):

┌─────────────────────────────┐
│ 🔍 powershell              │  ← Type to search
└─────────────────────────────┘

Results (filtered):
┌─────────────────────────────┐
│ PowerShell                  │  ← Matches highlighted
│ T1059.001                   │
├─────────────────────────────┤
│ Windows PowerShell Profile  │
│ T1546.013                   │
└─────────────────────────────┘

After clicking:
┌─────────────────────────────┐
│ PowerShell              [✓] │  ← Disabled, added
│ T1059.001                   │
└─────────────────────────────┘
```

### Step 3: Adjust Threshold

```
Match Threshold Slider:

50%           75%           100%
 │━━━━━━━━━━━○━━━━━━━━━━━━│
             ↑
         Current: 75%

Potential Matches above 75%: 5
```

**Threshold Tiers:**
- 50-59%: Low confidence
- 60-69%: Medium
- 70-79%: Medium-High
- 80-89%: High
- 90-100%: Critical

---

## Analysis Results

### Results Panel (Right Side)

```
┌───────────────────────────────────────────────────┐
│  Analysis Results                                  │
│  Found 12 potential APT groups                     │
├───────────────────────────────────────────────────┤
│                                                    │
│  90%+ Match                                        │
│  ┌─────────────────────────────────────────────┐ │
│  │ APT29                               95% 🔴  │ │
│  │                                              │ │
│  │ Matched Techniques (4):                     │ │
│  │ [Phishing] [PowerShell] [WMI] [+1 more]    │ │
│  │                                              │ │
│  │ Matched Software (2):                       │ │
│  │ [Cobalt Strike] [Mimikatz]                 │ │
│  │                                         →   │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ APT28                               92% 🔴  │ │
│  │ ...                                     →   │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  80-89% Match                                      │
│  ┌─────────────────────────────────────────────┐ │
│  │ Lazarus Group                       85% 🟠  │ │
│  │ ...                                     →   │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  70-79% Match                                      │
│  ┌─────────────────────────────────────────────┐ │
│  │ APT1                                72% 🟡  │ │
│  │ ...                                     →   │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Color Coding:**
- 🔴 90%+: Red/Danger (Critical threat)
- 🟠 80-89%: Orange/Warning (High threat)
- 🟡 70-79%: Yellow (Medium-high)
- 🟢 60-69%: Green (Medium)
- 🔵 50-59%: Blue (Low-medium)

### Loading State

```
┌───────────────────────────────┐
│                               │
│       ⟳  Loading...          │
│                               │
│  Analyzing threat patterns... │
│  Ranking APT groups by match  │
│                               │
└───────────────────────────────┘
```

---

## Group Details

### APT Group Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  🛡️ R.A.P.T.O.R.                        [Home] [GitHub]     │
├─────────────────────────────────────────────────────────────┤
│  ← Back to Analysis                                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  APT29                                     [G0016] 🔗 │  │
│  │  Also known as: Cozy Bear, The Dukes, CozyDuke       │  │
│  │                                                        │  │
│  │  APT29 is a threat group believed to be associated   │  │
│  │  with the Russian government. It has been active     │  │
│  │  since at least 2008, targeting government,          │  │
│  │  diplomatic, and research organizations...           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Software (12)                                        │  │
│  │                                                        │  │
│  │  ┃ Cobalt Strike                        [malware]    │  │
│  │  ┃ A commercial, full-featured remote access tool... │  │
│  │  ┃                                                    │  │
│  │  ┃ Mimikatz                             [tool]       │  │
│  │  ┃ Credential dumper for Windows systems...          │  │
│  │  ...                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Techniques (47)                                      │  │
│  │                                                        │  │
│  │  ┃ Phishing                           [T1566]        │  │
│  │  ┃ Adversaries may send phishing messages...         │  │
│  │  ┃ [Show Mitigations ▼]                             │  │
│  │  ┃                                                    │  │
│  │  ┃   ┃ User Training                                 │  │
│  │  ┃   ┃ Users can be trained to identify...          │  │
│  │  ┃   ┃                                               │  │
│  │  ┃   ┃ Anti-virus/Anti-malware                      │  │
│  │  ┃   ┃ Anti-virus can be used to automatically...   │  │
│  │  ┃                                                    │  │
│  │  ┃ PowerShell                         [T1059.001]   │  │
│  │  ┃ Adversaries may abuse PowerShell commands...      │  │
│  │  ┃ [Show Mitigations ▼]                             │  │
│  │  ...                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Expandable mitigation sections
- Color-coded categories (techniques=yellow, software=orange)
- External links to MITRE ATT&CK
- Aliases and known associations
- Full descriptions with formatting

---

## PWA Features

### Installation Prompt (Desktop)

```
Chrome/Edge Address Bar:
┌─────────────────────────────────────┐
│ https://raptor-app.vercel.app  [⊕] │  ← Install icon
└─────────────────────────────────────┘

Click [⊕] shows:
┌──────────────────────────┐
│ Install RAPTOR?          │
│                          │
│ This site can be         │
│ installed as an app      │
│                          │
│ [Install]  [Cancel]      │
└──────────────────────────┘
```

### Installed App

```
Desktop:
┌─────────────────────┐
│ 🛡️ RAPTOR          │  ← Standalone window
│ (No browser chrome) │
├─────────────────────┤
│ Full app content    │
│ ...                 │
└─────────────────────┘

Taskbar/Dock:
[🛡️] RAPTOR  ← App icon
```

### Offline Mode

```
┌──────────────────────────────────┐
│ ⚠️ You are offline               │
│                                   │
│ Using cached data from:          │
│ October 28, 2025                 │
│                                   │
│ Analysis will work with cached   │
│ APT group data. Some features    │
│ may be limited.                  │
│                                   │
│ [Dismiss]                        │
└──────────────────────────────────┘
```

---

## Mobile Experience

### Mobile Home (iPhone/Android)

```
┌─────────────────────────┐
│ 🛡️ R.A.P.T.O.R.     ☰ │  ← Hamburger menu
├─────────────────────────┤
│                         │
│ Selection               │
│                         │
│ Filter by Tactic        │
│ [All Techniques    ▼]  │
│                         │
│ Techniques              │
│ [🔍 Search...      ]   │
│                         │
│ • Phishing              │
│ • PowerShell            │
│ • Credential Dump       │
│                         │
│ Software                │
│ [🔍 Search...      ]   │
│                         │
│ • Cobalt Strike         │
│ • Mimikatz              │
│                         │
│ ─────────────────       │
│ Selected (3)            │
│ [Phishing ×]           │
│ [PowerShell ×]         │
│ [Cobalt Strike ×]      │
│                         │
│ Threshold: 75%          │
│ ━━━━━━━━━━━━━━━       │
│                         │
│ Potential: 5            │
│ [▶ Analyze         ]   │
│                         │
└─────────────────────────┘
```

### Mobile Results

```
┌─────────────────────────┐
│ ← Results               │
├─────────────────────────┤
│ 12 potential APT groups │
│                         │
│ 90%+ Match              │
│ ┌─────────────────────┐ │
│ │ APT29        95% 🔴 │ │
│ │                     │ │
│ │ [Phishing]          │ │
│ │ [PowerShell]        │ │
│ │ [+2 more]           │ │
│ │                  →  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ APT28        92% 🔴 │ │
│ │ ...              →  │ │
│ └─────────────────────┘ │
│                         │
│ 80-89% Match            │
│ ...                     │
│                         │
└─────────────────────────┘
```

### Add to Home Screen (iOS)

```
Safari Share Menu:
┌──────────────────────┐
│ [↗] Share            │
│ ─────────────────    │
│ 📋 Copy              │
│ 🔖 Add Bookmark      │
│ ⊕ Add to Home Screen │  ← Tap this
│ ✉️ Mail              │
└──────────────────────┘

Result:
┌───────────────┐
│ 🛡️            │
│ RAPTOR        │  ← Icon on home screen
└───────────────┘
```

---

## Color Palette Reference

```
Background Colors:
━━━━━━━━━━━━━━━━━━
#282C2E  ██████  Dark Background (main)
#1E2224  ██████  Dark Surface (cards)
#3A3F42  ██████  Dark Border

Text Colors:
━━━━━━━━━━━━━━━━━━
#E8E8E8  ██████  Light Text (primary)
#9CA3AF  ██████  Muted Text (secondary)

Accent Colors:
━━━━━━━━━━━━━━━━━━
#10B981  ██████  Primary Green (success, links)
#EF4444  ██████  Danger Red (critical threats)
#F59E0B  ██████  Warning Orange (high threats)
```

---

## UI States

### Button States

```
Primary Button:
Default:    [▶ Analyze     ]  ← Green background
Hover:      [▶ Analyze     ]  ← Darker green
Disabled:   [▶ Analyze     ]  ← Gray, 50% opacity
Loading:    [⟳ Analyzing...] ← Spinner animation

Secondary Button:
Default:    [   Reset      ]  ← Dark surface
Hover:      [   Reset      ]  ← Border highlight
```

### Input States

```
Search Input:
Empty:      [🔍 Search techniques...        ]
Focused:    [🔍 powershell|                 ]  ← Green border
With text:  [🔍 powershell                  ]  ← Results filter
```

### Badge States

```
Technique:  [Phishing]       ← Primary green
Software:   [Cobalt Strike]  ← Warning orange
ID:         [T1566]          ← Muted gray
Type:       [malware]        ← Info blue
```

---

## Accessibility Features

- ✓ High contrast dark theme
- ✓ Keyboard navigation support
- ✓ Screen reader friendly labels
- ✓ Focus indicators on interactive elements
- ✓ Loading states with announcements
- ✓ Error messages with context
- ✓ Touch-friendly tap targets (44x44px minimum)

---

## Performance Indicators

### Lighthouse Scores (Target)

```
Performance:  95+ ━━━━━━━━━━━━━━━ 🟢
Accessibility: 95+ ━━━━━━━━━━━━━━━ 🟢
Best Practices: 95+ ━━━━━━━━━━━━━━━ 🟢
SEO:          95+ ━━━━━━━━━━━━━━━ 🟢
PWA:         100  ━━━━━━━━━━━━━━━ 🟢
```

---

## Notes for Screenshot Generation

When creating actual screenshots:

1. **Use real data** from the MITRE ATT&CK database
2. **Show realistic scenarios**:
   - Select 3-5 techniques
   - Add 2-3 software items
   - Set threshold to 70-80%
   - Show 10-15 results

3. **Capture key moments**:
   - Empty state
   - Loading state
   - Results displayed
   - Group detail page
   - Mobile responsive view

4. **Highlight features**:
   - Real-time counter updating
   - Threshold slider in action
   - Badge removal interaction
   - Expandable mitigations

5. **Browser/Device Matrix**:
   - Desktop: Chrome, Firefox, Safari, Edge
   - Mobile: iOS Safari, Chrome Android
   - Tablet: iPad landscape/portrait

---

**For actual screenshot generation, use a tool like:**
- Puppeteer (automated)
- Manual capture with browser dev tools
- Figma mockups for documentation

This document serves as a visual specification guide.
