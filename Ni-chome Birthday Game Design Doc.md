# Ni-Chome Birthday Point-and-Click Game
## Final Design Document

**Game UI Language: English**
**Visual Style: Hand-drawn illustrated adventure game style (Cube Escape / Rusty Lake), cel-shaded coloring, vignette framing, 4:3 aspect ratio**

---

## 1. Overview

A short point-and-click puzzle game set in Tokyo's Ni-chome nightlife district. The player helps a DJ get a drink (Orange-Gris) by completing tasks for a cat bartender, ultimately leading to a birthday celebration reveal at the end.

---

## 2. Asset Inventory (already created)

**Backgrounds / Scenes:**
- Bar overview (default state)
- Bar overview (party version — decorated, final state)
- Drag queen close-up
- DJ close-up
- DJ drinking sequence: drinking / drunk / disappeared
- Bar entrance overview
- Bar entrance railing close-up
- Parking lot overview
- Restaurant entrance overview
- Restaurant entrance locker close-up
- Restaurant entrance locker (opened)
- Restaurant interior overview
- Dining table close-up
- Drinking sequence at table: drinking / disgusted reaction / finished
- Bartender (black cat) close-up
- DJ control console (with icon display screen for toggle buttons)

**Collectible items:**
- Birthday hat
- Cup/glass
- Candle
- Beer (unopened)
- Beer (opened)
- Orange-Gris (doctored beer, final state)

---

## 3. Interaction Lock/Unlock Logic

This is the core progression gate — most of the map is locked at the start and unlocks in stages:

| Stage | What's clickable |
|---|---|
| Game start (Bar Overview) | Only the DJ is clickable. Title and "Start" button overlay this screen. |
| After DJ dialogue (back at Bar Overview) | Only the black cat (bartender) is clickable. |
| After receiving the quest from the cat | Everything unlocks: scene navigation, all three item locations, railing, etc. |

---

## 4. Full Game Flow

### Step 1 — Opening
- Game opens directly on **Bar Overview**. Title and "Start" button are overlaid on this scene.
- On-screen prompt text (example): *"Get the DJ to play some music."*
- Only the DJ is interactive at this point.

### Step 2 — Talk to the DJ
- Click DJ → cut to **DJ Close-up**.
- DJ says he wants a drink — specifically an Orange-Gris — and tells the player to go ask the black cat behind the bar.
- **DJ line:** *"Ugh, I need a drink. Orange-Gris. Go bug the cat — he owes me one."*
- Dialogue ends → return to **Bar Overview**.

### Step 3 — Talk to the Cat (unlock gate)
- Now only the **black cat** is clickable.
- Click cat → cut to **Bartender (Black Cat) Close-up**.
- Cat gives a quest: bring three items, and he'll consider it.
- **Cat line:** *"An Orange-Gris, huh? Fine. Bring me a hat, some candles, and wine glasses first. Then we'll talk."*
- Once the quest is received, **all scenes and interactions unlock**.

### Step 4 — Explore & Collect (any order)

**① Birthday Hat — Parking Lot**
- Scene: **Parking Lot Overview**
- A young man is seen from behind near the wall (graffiti wall on one side).
- Player clicks directly on the graffiti (hidden birthday hat shape) on the wall to collect it — no separate search minigame, straightforward click-to-collect.

**② Candle — Restaurant Entrance Locker**
- Scene: **Restaurant Entrance Overview** → **Locker Close-up**
- Password source: go to **Drag Queen Close-up** — the code is shown/hidden on the ball she's holding.
- Return to the locker, input the code (**6001**) → **Locker (Opened)** state → collect the candle.

**③ Cup/Glass — Restaurant Table**
- Scene: **Restaurant Interior Overview** → **Dining Table Close-up**
- Player toasts with the NPC seated at the table.
- Drinking sequence plays: drinking → disgusted reaction → the two share a look and drink again anyway → finished.
- Empty glass is left on the table — collect it.

### Step 5 — Return to the Cat, the Cat Cheats
- Once all three items (hat, candle, cup) are collected, return to the **Bartender (Black Cat) Close-up**.
- Instead of giving Orange-Gris as promised, the cat only hands over a **plain beer**, telling the player to figure out how to turn it into Orange-Gris themselves.
- **Cat line:** *"One beer, as promised! ...What do you mean it's not Orange-Gris? That's your problem now."*

### Step 6 — Make the "Orange-Gris"
- Take the beer to **Bar Entrance Railing Close-up** → use the railing to pop the cap open.
- Take the opened beer to **Parking Lot Overview** → interact at the wall corner to "doctor" the drink (the game's stylized, non-graphic version of the classic gag — implied, not shown explicitly).

### Step 7 — Finale
- Bring the doctored drink back to the bar, give it to the DJ.
- Sequence plays: **DJ Drinking** → **DJ Drunk** → **DJ Disappeared**.
- The DJ control console appears with two independent emoji slots (left and right), each with its own toggle button below it, plus a **Play button**.
  - **Left slot** cycles through 3 emoji: 🐕 (dog), 🐈 (cat), 🐢 (turtle)
  - **Right slot** cycles through 3 emoji: 🤖 (robot), 🧙 (wizard/magician), 💃 (dancer)
  - Each toggle button press cycles its own slot forward by one (looping back to the first after the third).
  - Default displayed emoji on load must NOT be dog (left) or robot (right) — i.e. the puzzle can't start in the solved state.
  - The **Play button** is only enabled/clickable when the left slot shows 🐕 and the right slot shows 🤖 at the same time. It should appear disabled/inactive otherwise (e.g. greyed out, or simply non-functional on click with no feedback needed).
  - Clicking the Play button while the combination is correct triggers: play `September.mp3`, and cut the screen to **Bar Overview (Party Version)**.
- *"September"* by Earth, Wind & Fire plays (audio file: `September.mp3`).
- On-screen text: **"Happy Birthday."**
- **Final text:** *"HAPPY BIRTHDAY SACHA!"* — signed *"from Jiawen"*
- Game ends here — no separate cake transformation scene; the party version of the bar overview IS the ending screen.

---

## 5. Notes for Development (also see Section 6 for exact filenames)

- All on-screen text, prompts, and UI (buttons, labels) should be in **English**.
- The three collectible items (hat, candle, cup) should be tracked in a simple inventory state — no need for a visible inventory UI unless desired; they just need to gate the cat's quest completion.
- The "disgusted → drink again anyway" beat at the dining table is an important emotional detail — keep both reaction frames distinct and don't skip the "drink again" state.
- The DJ console puzzle: two independent slots (left/right), each cycling through 3 emoji via its own toggle button, no drag/rotation mechanic needed. A separate Play button only becomes active when left=dog and right=robot; clicking it plays the audio and transitions the scene. Ensure the initial/default state never starts already solved.
- Audio: use an `<audio>` element with the local file `September.mp3`, triggered on Play button click (not autoplay, since the click itself satisfies browser autoplay restrictions).
- No failure states or game overs anywhere in the flow — wrong guesses (e.g. wrong locker code, wrong DJ console icon) should simply allow retry with no penalty.
- Keep transitions simple (cross-fades between static illustrated scenes) — no complex animation required given the hand-drawn static art style.

---

## 6. Asset File Reference Table

File naming convention: lowercase, hyphen-separated, `scene-name_state.png` where applicable.

| Step in flow | Scene/asset | Filename |
|---|---|---|
| Game start / title screen | Bar overview (default) | `bar-overview.png` |
| DJ dialogue | DJ close-up | `dj-closeup.png` |
| Cat quest dialogue | Bartender (black cat) close-up | `bartender-cat-closeup.png` |
| Hat collection | Parking lot overview | `parking-lot-overview.png` |
| Hat item | Birthday hat icon | `item-hat.png` |
| Locker password source | Drag queen close-up | `drag-queen-closeup.png` |
| Locker (locked) | Restaurant entrance overview | `restaurant-entrance-overview.png` |
| Locker close-up (locked) | Locker close-up | `restaurant-entrance-locker-closeup.png` |
| Locker (opened) | Locker opened state | `restaurant-entrance-locker-opened.png` |
| Candle item | Candle icon | `item-candle.png` |
| Table scene | Restaurant interior overview | `restaurant-interior-overview.png` |
| Table close-up | Dining table close-up | `dining-table-closeup.png` |
| Drinking sequence | Drinking / disgusted / finished | `dining-table-drinking.png`, `dining-table-disgusted.png`, `dining-table-finished.png` |
| Glass item | Glass/cup icon | `item-glass.png` |
| Cat gives beer | Bartender (black cat) close-up | `bartender-cat-closeup.png` |
| Beer (unopened) | Beer icon | `item-beer.png` |
| Railing / open beer | Bar entrance overview | `bar-entrance-overview.png` |
| Railing close-up | Railing close-up | `bar-entrance-railing-closeup.png` |
| Beer (opened) | Opened beer icon | `item-beer-opened.png` |
| Parking lot / doctor the drink | Parking lot overview | `parking-lot-overview.png` |
| Orange-Gris (final) | Doctored beer icon | `item-orange-gris.png` |
| Give drink to DJ | DJ drinking sequence | `dj-drinking.png`, `dj-drunk.png`, `dj-disappeared.png` |
| DJ console interaction | DJ console background (icons rendered as emoji directly in code, no separate icon image files needed) | `dj-console.png` |
| Ending | Bar overview (party version) | `bar-overview-party.png` |
| Ending music | September by Earth, Wind & Fire | `September.mp3` |

---

## 7. Open / To-Finalize Items

All core content is finalized. Remaining work is art asset polish and development implementation.
