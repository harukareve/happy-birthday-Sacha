# Ni-chome Birthday — opening prototype

Open `index.html` directly, or run `python3 -m http.server 8000 --bind 127.0.0.1` and visit http://127.0.0.1:8000.

Implemented: title → only DJ enabled → exact DJ dialogue → only cat enabled → exact cat quest → bar exploration → drag queen close-up → return to bar. The drag queen hotspot stays locked until the cat quest is accepted. The original close-up artwork contains the 6001 clue; Jasmine Wind says “Psst… I’ll let you in on a secret: here’s the winning number for tonight’s party.” on entry. Continue dismisses her dialogue; clicking her again repeats it. Back to bar (or Escape) returns without resetting the quest or inventory. Reload starts a new game.

`game.js` stores hat, candle and glass flags (all initially false). After accepting the cat quest, Leave the bar leads to the bar entrance. Outdoor navigation follows a fixed non-looping order: bar entrance ↔ parking lot ↔ restaurant entrance. Right arrows advance, left arrows go back; there is no left arrow at the bar entrance or right arrow at the restaurant. Click the bar door to return inside. Travel preserves quest and inventory state. Outdoor detail interactions, collection, beer preparation, console and ending are deferred. All supplied artwork remains unchanged. Images are contained within a 4:3 stage, without cropping or stretching.

## Asset audit

The supplied design document is `Ni-chome Birthday Game Design Doc.md`.

Filename differences from section 6 (expected → actual):

- `parking-lot-overview.png` → `parkinglot-overview.png`
- `restaurant-entrance-locker-closeup.png` → `restaurant-entrance-locker-closed.png`
- `restaurant-entrance-locker-opened.png` → `restaurant entrance-locker-opened.png`
- All four `dining-table-*.png` → `dinning-table-*.png`
- `dj-drinking.png` → `dj-driking.png`
- `dj-disappeared.png` → `dj-disappear.png`
- All six `item-*.png` → `item-*.PNG` (uppercase extension)

These are candidate filename correspondences for future chapters; their image content must be checked before use. The three backgrounds used in this prototype exactly match the design document. No replacement artwork was invented.

Dimensions: 17 backgrounds are 1440×1080; bar-overview and bartender-cat-closeup are 1440×1082; bar-overview-party is 1448×1086. All six item icons are 2048×2048. September.mp3 is present. No distinct asset category appears absent from the file inventory, but the exact filenames listed above do not exist as written in section 6.

Railing: click the right-hand post at the bar entrance to inspect the supplied close-up. It displays “looks pretty familiar...” and a return button; Escape also returns. The close-up has no item collection or bottle-opening interaction at this stage.

Parking lot: the man toggles a gibberish bubble without leaving the scene. Click fox → butterfly → birthday hat; All three outlines appear together only while the pointer hovers over any graffiti target, and disappear together when it leaves. Correctly clicked targets keep their green completion color while hovered. Progress lights appear after the first graffiti click. All three targets remain clickable until collection. Correct clicks advance the lights in fox → butterfly → hat order; any wrong click resets all progress and target colors, with unlimited retries. On collection the progress lights disappear immediately. “You found a birthday hat!” stays for 3 seconds, then fades out over 0.5 seconds. Leaving the scene dismisses this one-time message; the inventory icon remains. Completing the sequence awards the hat once. Its icon stays at the top right in every scene for the current playthrough; reloading starts a new game. Partial sequence progress survives scene travel.

Locker 05: click its door at the restaurant entrance, then click the artwork keypad digits. Four digits submit automatically; 6001 opens the locker. Wrong codes flash red crosses and clear for unlimited retries. The original five-dash screen is covered with a four-digit display. Click the supplied candle icon inside to collect it once. The collection message stays 3 seconds and fades over 0.5 seconds. Hat and candle are displayed horizontally across all scenes; the locker remains open and empty after collection. Return button/Escape leads back outside.

All item collection messages share the same top-center placement, with 3 seconds visible followed by a 0.5-second fade.

Restaurant: click the entrance door to enter the interior. Click the right-hand table/guest area to open the dining-table close-up. Back buttons or Escape return one scene at a time. Click the foreground glass, then Cheers: drinking for 2 seconds → disgusted with 1 second of shake → Finish the drink → drinking for 2 seconds → finished. Click the empty glass held by the guest to collect it once. The glass is baked into the finished artwork, so the artwork remains after collection but its hotspot is removed. Timed scenes temporarily hide navigation; revisiting preserves the current stable dining phase. Inventory remains visible throughout.

After all three quest items (hat, candle, glass) are collected in any order, the original top task prompt changes to “Go ask the black cat for an Orange-Gris.” and stays visible while exploring. The wine-glasses collection message reads “You found the wine glasses!”.

After collecting all three quest items, the cat becomes clickable again in the bar. The DJ stays locked until the cat reward dialogue is completed and the beer is received. Completing the cat reward dialogue gives one beer and a standard collection notification; repeat conversations do not duplicate the reward. The DJ suggests looking outside and trying some magic. Receiving the beer updates the task prompt. Beer opening/preparation is still deferred.

Completing the cat reward dialogue turns in the hat, candle and wine glasses: their inventory icons disappear, while collection records remain complete to prevent collecting them again. The beer remains visible.

Beer preparation: after the cat reward, the post close-up offers Open the beer. A 2.1-second counterclockwise bottle animation replaces beer with opened beer and displays “you opened the beer”. The parking-lot man offers Give him the beer, disabled with “the beer is not opened yet.” until opened beer is held. Giving it consumes opened beer and shows “.......” in the dialogue for 6 seconds. The dialogue then closes and Orange-Gris appears in the center; clicking it adds it to inventory. Leaving before collecting preserves the pending pickup. Repeating the cat dialogue cannot restore or duplicate consumed beer.

With Orange-Gris collected, clicking the DJ asks whether you got it. Give her the Orange-Gris consumes it and shows drinking with “Glug...” for 2 seconds, then the supplied drunk frame and requested thank-you line. Continue shows the disappeared frame. The console is then clickable to inspect its close-up; Back/Escape returns to the unattended booth. The console puzzle and birthday ending are implemented.

Finale: left cycles dog → cat → turtle, right cycles robot → wizard → dancer, independently. Defaults are cat/wizard. Play is enabled only for dog/robot; clicking it starts local September.mp3 and reveals the party scene with birthday dedication to Sacha, signed from Jiawen. Music can be paused or resumed. For local finale-only testing visit http://127.0.0.1:8000/?preview=console (this entry is ignored on non-local hosts).

Ending choreography: Play starts music and slowly returns to the original bar. Four centered mementos (hat, candles, wine glasses, Orange-Gris) appear in turn. The birthday title appears in the center as the party background crossfades over 3.2 seconds, then settles down into the final dedication layout. The signature fades in, followed by music controls.
