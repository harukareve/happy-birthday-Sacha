'use strict';
(() => {
  const $ = id => document.getElementById(id);
  // Future chapters use these flags to gate the cat's reward; no items start collected.
  const state = { stage: 'title', scene: 'bar', explorationUnlocked: false,
    graffitiStep: 0, graffitiStarted: false, hatRewardVisible: false, drunkSpeaking: false,
    lockerCode: '', lockerOpen: false, lockerError: false, candleRewardVisible: false,
    diningPhase: 'ready', cheersVisible: false, glassRewardVisible: false,
    beerRewardVisible: false, questTurnedIn: false, drinkReward: '', drunkDialogue: false, orangeReady: false, djGone: false, leftIcon: 1, rightIcon: 1,
    inventory: { hat: false, candle: false, glass: false, beer: false, opened: false, orange: false } };
  const questComplete = () => ['hat', 'candle', 'glass'].every(item => state.inventory[item]);
  const leftIcons = [['🐶', 'Dog'], ['🐱', 'Cat'], ['🐢', 'Turtle']];
  const rightIcons = [['🤖', 'Robot'], ['🧙', 'Wizard'], ['💃', 'Dancer']];
  const lines = {
    'dj-offer': 'Did you get the Orange-Gris?',
    'dj-sipping': 'Glug... glug... glug...',
    'dj-thanks': 'Perfect, it takes just as Orange-Gris. Thank you!!!',

    'cat-reward': "One beer, as promised! ...What do you mean it's not Orange-Gris? That's your problem now.",
    'dj-hint': "I want ORANGE-GRIS, NOT A FUCKING BEER!!! Go take a look outside. You'll have to figure it out yourself. Maybe you need some magic.",
    'drag-queen': "Psst… I’ll let you in on a secret: here’s the winning number for tonight’s party.",
    dj: 'Ugh, I need a drink. Orange-Gris. Go bug the cat — he owes me one.',
    cat: "An Orange-Gris, huh? Fine. Bring me a hat, some candles, and wine glasses first. Then we'll talk."
  };
  const outdoorScenes = {
    'bar-entrance': 'Bar entrance',
    'parking-lot': 'Parking lot',
    'restaurant-entrance': 'Restaurant entrance'
  };
  const graffitiOrder = ['fox', 'butterfly', 'hat'];
  const outdoorOrder = Object.keys(outdoorScenes);
  function render() {
    for (const scene of document.querySelectorAll('.scene')) {
      const active = scene.id === state.scene;
      scene.classList.toggle('active', active);
      scene.setAttribute('aria-hidden', String(!active));
    }
    $('console-puzzle').hidden = !(state.stage === 'console-explore' && state.scene === 'dj-console');
    $('left-emoji').textContent = leftIcons[state.leftIcon][0];
    $('left-emoji').setAttribute('aria-label', leftIcons[state.leftIcon][1]);
    $('right-emoji').textContent = rightIcons[state.rightIcon][0];
    $('right-emoji').setAttribute('aria-label', rightIcons[state.rightIcon][1]);
    $('play-music').disabled = state.leftIcon !== 0 || state.rightIcon !== 0;
    $('birthday-ending').hidden = !['ending-reveal', 'ending'].includes(state.stage);
    // Reveal both effects with the birthday title, before the party backdrop fades in.
    $('party-effects').hidden = $('birthday-ending').hidden;
    $('ending-mementos').hidden = state.stage !== 'ending-mementos';
    $('console-hotspot').hidden = !(state.stage === 'console-explore' && state.scene === 'dj-gone');
    $('back-to-dj-booth').hidden = !(state.stage === 'console-explore' && state.scene === 'dj-console');
    $('title-screen').hidden = state.stage !== 'title';
    const exploring = state.stage === 'explore' && state.explorationUnlocked;
    const allQuestItemsCollected = questComplete();
    $('restaurant-door').hidden = !(exploring && state.scene === 'restaurant-entrance');
    $('table-hotspot').hidden = !(exploring && state.scene === 'restaurant-interior');
    $('leave-restaurant').hidden = !(exploring && state.scene === 'restaurant-interior');
    $('back-to-interior').hidden = !(exploring && ['dining-table', 'table-disgusted', 'table-finished'].includes(state.scene));
    $('toast-glass').hidden = !(exploring && state.scene === 'dining-table' && !state.cheersVisible);
    $('cheers').hidden = !(exploring && state.scene === 'dining-table' && state.cheersVisible);
    $('finish-drink').hidden = !(exploring && state.scene === 'table-disgusted');
    $('collect-glass').hidden = !(exploring && state.scene === 'table-finished' && !state.inventory.glass);
    $('glass-reward').hidden = !(state.scene === 'table-finished' && state.glassRewardVisible);
    $('table-disgusted').classList.toggle('shaking', state.stage === 'drink-reaction');
    $('inventory-opened').hidden = !state.inventory.opened;
    $('inventory-orange').hidden = !state.inventory.orange;
    $('open-beer').hidden = !(exploring && state.scene === 'railing' && state.inventory.beer);
    $('opening-bottle').hidden = state.stage !== 'opening-beer';
    $('drink-reward').hidden = !state.drinkReward;
    $('drink-reward').textContent = state.drinkReward;
    const makingOrange = state.stage === 'making-orange';
    $('drunk-dialogue').hidden = !((exploring || makingOrange) && state.scene === 'parking-lot' && state.drunkDialogue);
    $('drunk-line').textContent = makingOrange ? '.......' : 'im writing your name on the wall... it feels like magic!';
    $('give-beer').hidden = makingOrange;
    $('close-drunk').hidden = makingOrange;
    $('collect-orange').hidden = !(exploring && state.scene === 'parking-lot' && state.orangeReady);
    $('give-beer').disabled = !state.inventory.opened;
    $('unopened-hint').hidden = makingOrange || state.inventory.opened;
    $('drunk-hotspot').hidden = state.drunkDialogue || state.orangeReady;
    $('inventory-beer').hidden = !state.inventory.beer;
    $('beer-reward').hidden = !exploring || !state.beerRewardVisible;
    $('inventory-glass').hidden = !state.inventory.glass || state.questTurnedIn;
    const lockerClosed = exploring && state.scene === 'locker-closed';
    const lockerOpen = exploring && state.scene === 'locker-open';
    $('locker-hotspot').hidden = !(exploring && state.scene === 'restaurant-entrance');
    $('locker-controls').hidden = !lockerClosed;
    $('back-to-restaurant').hidden = !lockerClosed && !lockerOpen;
    $('collect-candle').hidden = !lockerOpen || state.inventory.candle;
    $('candle-reward').hidden = !lockerOpen || !state.candleRewardVisible;
    $('locker-display').textContent = state.lockerError ? '× × × ×' : (state.lockerCode + '_'.repeat(4 - state.lockerCode.length)).split('').join(' ');
    $('locker-display').classList.toggle('code-error', state.lockerError);
    const parking = exploring && state.scene === 'parking-lot';
    $('parking-interactions').hidden = !parking;
    $('drunk-bubble').hidden = !parking || !state.drunkSpeaking;
    $('inventory').hidden = state.stage.startsWith('ending') || !Object.entries(state.inventory).some(([item, owned]) => owned && (!state.questTurnedIn || !['hat', 'candle', 'glass'].includes(item)));
    $('inventory-candle').hidden = !state.inventory.candle || state.questTurnedIn;
    $('inventory-hat').hidden = !state.inventory.hat || state.questTurnedIn;
    graffitiOrder.forEach((name, index) => {
      const target = $(name + '-hotspot');
      target.disabled = state.inventory.hat;
      target.classList.toggle('activated', index < state.graffitiStep);
    });
    $('hat-reward').hidden = !parking || !state.hatRewardVisible;
    const progress = $('graffiti-progress');
    progress.hidden = !state.graffitiStarted || state.inventory.hat;
    progress.setAttribute('aria-label', 'Graffiti sequence: ' + state.graffitiStep + ' of 3' + (state.inventory.hat ? ', birthday hat collected' : ''));
    [...progress.children].forEach((dot, index) => dot.classList.toggle('lit', index < state.graffitiStep));
    const outdoors = exploring && Object.hasOwn(outdoorScenes, state.scene);
    $('leave-bar').hidden = !(exploring && state.scene === 'bar');
    $('railing-hotspot').hidden = !(exploring && state.scene === 'bar-entrance');
    $('railing-caption').hidden = !(exploring && state.scene === 'railing' && !state.questTurnedIn);
    $('back-to-entrance').hidden = !(exploring && state.scene === 'railing');
    $('enter-bar').hidden = !(exploring && state.scene === 'bar-entrance');
    $('outdoor-navigation').hidden = !outdoors;
    $('location-label').hidden = !outdoors || allQuestItemsCollected;
    $('location-label').textContent = outdoors ? outdoorScenes[state.scene] : '';
    const locationIndex = outdoorOrder.indexOf(state.scene);
    $('previous-scene').hidden = !outdoors || locationIndex <= 0;
    $('next-scene').hidden = !outdoors || locationIndex >= outdoorOrder.length - 1;
    if (outdoors && locationIndex > 0) {
      $('previous-scene').setAttribute('aria-label', 'Go to ' + outdoorScenes[outdoorOrder[locationIndex - 1]]);
    }
    if (outdoors && locationIndex < outdoorOrder.length - 1) {
      $('next-scene').setAttribute('aria-label', 'Go to ' + outdoorScenes[outdoorOrder[locationIndex + 1]]);
    }
    $('drag-queen-hotspot').hidden = !(exploring && state.scene === 'bar');
    $('jasmine-hotspot').hidden = !(exploring && state.scene === 'drag-queen');
    $('back-to-bar').hidden = !(exploring && state.scene === 'drag-queen');
    $('dj-hotspot').hidden = state.stage !== 'meet-dj' && !(exploring && state.scene === 'bar' && state.questTurnedIn);
    $('cat-hotspot').hidden = state.stage !== 'meet-cat' && !(exploring && state.scene === 'bar' && allQuestItemsCollected);
    const speaking = state.stage === 'dj-dialogue' || state.stage === 'cat-dialogue' || state.stage === 'jasmine-dialogue' || state.stage === 'cat-reward' || state.stage === 'dj-hint' || ['dj-offer', 'dj-sipping', 'dj-thanks'].includes(state.stage);
    $('dialogue').hidden = !speaking;
    $('continue').hidden = state.stage === 'dj-sipping';
    $('continue').textContent = state.stage === 'dj-offer' ? 'Give her the Orange-Gris.' : 'Continue →';
    if (speaking) {
      $('speaker').textContent = ['dj', 'dj-drinking', 'dj-drunk'].includes(state.scene) ? 'DJ' : state.scene === 'drag-queen' ? 'Jasmine Wind' : 'THE BLACK CAT';
      $('line').textContent = lines[state.stage] || lines[state.scene];
    }
    $('prompt').hidden = !['meet-dj', 'meet-cat'].includes(state.stage) && !(exploring && (state.scene === 'bar' || allQuestItemsCollected));
    $('prompt').textContent = state.stage === 'meet-dj' ? 'Get the DJ to play some music.' : state.stage === 'meet-cat' ? 'Ask the black cat for an Orange-Gris.' : state.inventory.orange ? 'Bring the Orange-Gris to the DJ.' : state.questTurnedIn ? 'Look outside. Find a way to make an Orange-Gris.' : allQuestItemsCollected ? 'Go ask the black cat for an Orange-Gris.' : 'Find a hat, some candles, and wine glasses.';
    $('game').dataset.scene = state.scene;
    $('game').dataset.stage = state.stage;
    $('game').dataset.explorationUnlocked = String(state.explorationUnlocked);
  }
  function move(stage, scene, focusId) {
    if (scene !== state.scene) {
      state.drunkSpeaking = false;
      state.drunkDialogue = false;
      state.drinkReward = '';
      state.hatRewardVisible = false;
      state.candleRewardVisible = false;
      state.glassRewardVisible = false;
      state.beerRewardVisible = false;
      state.lockerCode = '';
      state.lockerError = false;
    }
    state.stage = stage; state.scene = scene; render(); if (focusId) $(focusId).focus({preventScroll:true});
  }
  const audio = $('september');
  function playSeptember() {
    $('music-error').hidden = true;
    audio.play().catch(() => {
      $('music-error').hidden = false;
      $('music-toggle').textContent = 'Play music';
    });
  }
  for (const side of ['left', 'right']) {
    $('cycle-' + side).addEventListener('click', () => {
      if (state.stage !== 'console-explore' || state.scene !== 'dj-console') return;
      state[side + 'Icon'] = (state[side + 'Icon'] + 1) % 3;
      render();
    });
  }
  // Staggered glitter flakes stay behind the dedication and controls.
  for (let i = 0; i < 150; i++) {
    const spark = document.createElement('i');
    spark.style.cssText = `--x:${(i * 37 + 11) % 100}%;--drift:${(i % 2 ? 1 : -1) * (25 + i % 55)}px;--duration:${10 + i % 10}s;--delay:-${i * 1.73}s;--size:${8 + i % 11}px;--tone:${i % 3 === 0 ? '#edb6c5' : '#f6dba5'}`;
    $('party-glitter').appendChild(spark);
  }
  const endingWait = ms => new Promise(resolve => setTimeout(resolve, ms));
  function schedulePartyDance() {
    setTimeout(() => {
      if (state.scene !== 'party' || !state.stage.startsWith('ending')) return;
      $('game').classList.add('party-dancing');
      state.scene = 'party-dance';
      render();
    }, 3000);
  }
  async function birthdaySequence() {
    $('game').classList.add('ending-transition');
    move('ending-mementos', 'bar');
    await endingWait(3200);
    for (const item of $('ending-mementos').children) {
      item.classList.add('show-memento');
      await endingWait(1500);
      item.classList.remove('show-memento');
      await endingWait(650);
    }
    move('ending-reveal', 'bar');
    const title = $('birthday-title');
    const gameBounds = $('game').getBoundingClientRect();
    const titleBounds = title.getBoundingClientRect();
    const offset = gameBounds.top + gameBounds.height / 2 - (titleBounds.top + titleBounds.height / 2);
    title.style.transform = 'translateY(' + offset + 'px)';
    title.animate([{opacity:0, transform:'translateY(' + offset + 'px) scale(.75)'}, {opacity:1, transform:'translateY(' + offset + 'px) scale(1)'}], {duration:700,easing:'cubic-bezier(.2,.8,.2,1)'});
    move('ending-reveal', 'party');
    schedulePartyDance();
    await endingWait(900);
    const descent = title.animate([{transform:'translateY(' + offset + 'px)'},{transform:'translateY(0)'}], {duration:2600,easing:'ease-in-out',fill:'forwards'});
    await descent.finished;
    title.style.transform = '';
    descent.cancel();
    $('birthday-ending').classList.add('show-signature');
    await endingWait(1800);
    state.stage = 'ending';
    render();
    $('birthday-ending').classList.add('show-music');
    $('music-toggle').inert = false;
    title.focus({preventScroll:true});
  }
  $('music-toggle').inert = true;
  $('play-music').addEventListener('click', () => {
    if (state.stage !== 'console-explore' || state.scene !== 'dj-console' || state.leftIcon !== 0 || state.rightIcon !== 0) return;
    playSeptember(); // Directly within the user gesture, for browser audio permissions.
    birthdaySequence();
  });
  $('music-toggle').addEventListener('click', () => {
    if (state.stage !== 'ending') return;
    if (audio.paused) playSeptember(); else audio.pause();
  });
  for (const event of ['play', 'pause', 'ended']) {
    audio.addEventListener(event, () => { $('music-toggle').textContent = audio.paused ? 'Play music' : 'Pause music'; });
  }
  $('console-hotspot').addEventListener('click', () => {
    if (state.djGone && state.stage === 'console-explore' && state.scene === 'dj-gone') {
      move('console-explore', 'dj-console', 'back-to-dj-booth');
    }
  });
  function returnToDJBooth() {
    if (state.djGone && state.stage === 'console-explore' && state.scene === 'dj-console') {
      move('console-explore', 'dj-gone', 'console-hotspot');
    }
  }
  $('back-to-dj-booth').addEventListener('click', returnToDJBooth);
  $('start').addEventListener('click', () => {
    if (state.stage === 'title') move('meet-dj', 'bar', 'dj-hotspot');
  });
  $('dj-hotspot').addEventListener('click', () => {
    if (state.stage === 'meet-dj') move('dj-dialogue', 'dj', 'continue');
    else if (state.stage === 'explore' && state.scene === 'bar' && state.questTurnedIn) move(state.inventory.orange ? 'dj-offer' : 'dj-hint', 'dj', 'continue');
  });
  $('cat-hotspot').addEventListener('click', () => {
    if (state.stage === 'meet-cat') move('cat-dialogue', 'cat', 'continue');
    else if (state.stage === 'explore' && state.scene === 'bar' && questComplete()) move('cat-reward', 'cat', 'continue');
  });
  $('continue').addEventListener('click', () => {
    if (state.stage === 'dj-offer' && state.inventory.orange) {
      state.inventory.orange = false;
      move('dj-sipping', 'dj-drinking');
      setTimeout(() => move('dj-thanks', 'dj-drunk', 'continue'), 2000);
      return;
    }
    if (state.stage === 'dj-thanks') {
      state.djGone = true;
      move('console-explore', 'dj-gone', 'console-hotspot');
      return;
    }
    if (state.stage === 'cat-reward') {
      const firstBeer = !state.questTurnedIn;
      if (firstBeer) state.inventory.beer = true;
      state.questTurnedIn = true;
      move('explore', 'bar', 'dj-hotspot');
      if (firstBeer) {
        state.beerRewardVisible = true;
        render();
        setTimeout(() => { state.beerRewardVisible = false; render(); }, 3500);
      }
      return;
    }
    if (state.stage === 'dj-hint') {
      move('explore', 'bar', 'leave-bar');
      return;
    }
    if (state.stage === 'jasmine-dialogue') move('explore', 'drag-queen', 'back-to-bar');
    else if (state.stage === 'dj-dialogue') move('meet-cat', 'bar', 'cat-hotspot');
    else if (state.stage === 'cat-dialogue') {
      state.explorationUnlocked = true;
      move('explore', 'bar', 'drag-queen-hotspot');
    }
  });
  $('drag-queen-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'bar') {
      move('jasmine-dialogue', 'drag-queen', 'continue');
    }
  });
  $('jasmine-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'drag-queen') {
      move('jasmine-dialogue', 'drag-queen', 'continue');
    }
  });
  let drinkRewardTimer;
  function showDrinkReward(message) {
    clearTimeout(drinkRewardTimer);
    state.drinkReward = message;
    render();
    drinkRewardTimer = setTimeout(() => { state.drinkReward = ''; render(); }, 3500);
  }
  $('open-beer').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'railing' || !state.inventory.beer) return;
    move('opening-beer', 'railing');
    setTimeout(() => {
      state.inventory.beer = false;
      state.inventory.opened = true;
      move('explore', 'railing', 'back-to-entrance');
      showDrinkReward('you opened the beer');
    }, 1600);
  });
  $('give-beer').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'parking-lot' || !state.drunkDialogue || !state.inventory.opened) return;
    state.inventory.opened = false;
    state.stage = 'making-orange';
    render();
    setTimeout(() => {
      state.drunkDialogue = false;
      state.orangeReady = true;
      move('explore', 'parking-lot', 'collect-orange');
    }, 2000);
  });
  $('collect-orange').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'parking-lot' || !state.orangeReady) return;
    state.orangeReady = false;
    state.inventory.orange = true;
    showDrinkReward('You found an Orange-Gris!');
    $('drunk-hotspot').focus({preventScroll:true});
  });
  $('close-drunk').addEventListener('click', () => { state.drunkDialogue = false; render(); $('drunk-hotspot').focus({preventScroll:true}); });
  $('drunk-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'parking-lot') {
      if (state.questTurnedIn && !state.inventory.orange) state.drunkDialogue = true;
      else state.drunkSpeaking = !state.drunkSpeaking;
      render();
    }
  });
  graffitiOrder.forEach(name => {
    $(name + '-hotspot').addEventListener('click', () => {
      if (!state.explorationUnlocked || state.stage !== 'explore' || state.scene !== 'parking-lot' || state.inventory.hat) return;
      state.drunkSpeaking = false;
      state.graffitiStarted = true;
      // Every incorrect click resets the sequence, including repeated earlier targets.
      state.graffitiStep = name === graffitiOrder[state.graffitiStep] ? state.graffitiStep + 1 : 0;
      if (state.graffitiStep === graffitiOrder.length) {
        state.inventory.hat = true;
        state.hatRewardVisible = true;
        setTimeout(() => {
          state.hatRewardVisible = false;
          render();
        }, 3500);
      }
      render();
      if (state.inventory.hat) $('next-scene').focus({preventScroll:true});
    });
  });
  $('restaurant-door').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'restaurant-entrance') {
      move('explore', 'restaurant-interior', 'table-hotspot');
    }
  });
  $('table-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'restaurant-interior') {
      const scene = state.diningPhase === 'finished' ? 'table-finished' : state.diningPhase === 'disgusted' ? 'table-disgusted' : 'dining-table';
      move('explore', scene, 'back-to-interior');
    }
  });
  $('toast-glass').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'dining-table') return;
    state.cheersVisible = true;
    render();
    $('cheers').focus({preventScroll:true});
  });
  $('cheers').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'dining-table' || !state.cheersVisible) return;
    state.cheersVisible = false;
    move('drinking', 'table-drinking');
    setTimeout(() => {
      move('drink-reaction', 'table-disgusted');
      setTimeout(() => {
        state.diningPhase = 'disgusted';
        move('explore', 'table-disgusted', 'finish-drink');
      }, 1000);
    }, 2000);
  });
  $('finish-drink').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'table-disgusted') return;
    move('drinking', 'table-drinking');
    setTimeout(() => {
      state.diningPhase = 'finished';
      move('explore', 'table-finished', 'collect-glass');
    }, 2000);
  });
  $('collect-glass').addEventListener('click', () => {
    if (state.stage !== 'explore' || state.scene !== 'table-finished' || state.inventory.glass) return;
    state.inventory.glass = true;
    state.glassRewardVisible = true;
    render();
    $('back-to-interior').focus({preventScroll:true});
    setTimeout(() => { state.glassRewardVisible = false; render(); }, 3500);
  });
  function backFromRestaurantRoom() {
    if (!state.explorationUnlocked || state.stage !== 'explore') return;
    if (['dining-table', 'table-disgusted', 'table-finished'].includes(state.scene)) move('explore', 'restaurant-interior', 'table-hotspot');
    else if (state.scene === 'restaurant-interior') move('explore', 'restaurant-entrance', 'restaurant-door');
  }
  $('leave-restaurant').addEventListener('click', backFromRestaurantRoom);
  $('back-to-interior').addEventListener('click', backFromRestaurantRoom);
  $('locker-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'restaurant-entrance') {
      move('explore', state.lockerOpen ? 'locker-open' : 'locker-closed', 'back-to-restaurant');
    }
  });
  let lockerErrorTimer;
  for (const key of document.querySelectorAll('[data-digit]')) {
    key.addEventListener('click', () => {
      if (!state.explorationUnlocked || state.stage !== 'explore' || state.scene !== 'locker-closed') return;
      clearTimeout(lockerErrorTimer);
      state.lockerError = false;
      state.lockerCode += key.dataset.digit;
      if (state.lockerCode.length === 4) {
        if (state.lockerCode === '6001') {
          state.lockerOpen = true;
          move('explore', 'locker-open', 'collect-candle');
          return;
        }
        state.lockerCode = '';
        state.lockerError = true;
        lockerErrorTimer = setTimeout(() => { state.lockerError = false; render(); }, 650);
      }
      render();
    });
  }
  $('collect-candle').addEventListener('click', () => {
    if (!state.explorationUnlocked || state.stage !== 'explore' || state.scene !== 'locker-open' || state.inventory.candle) return;
    state.inventory.candle = true;
    state.candleRewardVisible = true;
    render();
    $('back-to-restaurant').focus({preventScroll:true});
    setTimeout(() => { state.candleRewardVisible = false; render(); }, 3500);
  });
  function returnToRestaurant() {
    if (state.stage === 'explore' && ['locker-closed', 'locker-open'].includes(state.scene)) {
      move('explore', 'restaurant-entrance', 'locker-hotspot');
    }
  }
  $('back-to-restaurant').addEventListener('click', returnToRestaurant);
  // All outdoor routes share the quest gate and preserve inventory/progression.
  function travel(destination) {
    if (!state.explorationUnlocked || state.stage !== 'explore') return;
    const outdoors = Object.hasOwn(outdoorScenes, state.scene);
    const allowed = (state.scene === 'bar' && destination === 'bar-entrance') ||
      (outdoors && Object.hasOwn(outdoorScenes, destination) &&
        Math.abs(outdoorOrder.indexOf(destination) - outdoorOrder.indexOf(state.scene)) === 1) ||
      (state.scene === 'bar-entrance' && destination === 'bar');
    if (!allowed || destination === state.scene) return;
    const focusId = destination === 'bar' ? 'leave-bar' :
      destination === 'bar-entrance' ? 'enter-bar' :
      destination === 'restaurant-entrance' ? 'previous-scene' :
      outdoorOrder.indexOf(destination) > outdoorOrder.indexOf(state.scene) ? 'next-scene' : 'previous-scene';
    move('explore', destination, focusId);
  }
  $('leave-bar').addEventListener('click', () => travel('bar-entrance'));
  $('enter-bar').addEventListener('click', () => travel('bar'));
  $('previous-scene').addEventListener('click', () => travel(outdoorOrder[outdoorOrder.indexOf(state.scene) - 1]));
  $('next-scene').addEventListener('click', () => travel(outdoorOrder[outdoorOrder.indexOf(state.scene) + 1]));
  $('railing-hotspot').addEventListener('click', () => {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'bar-entrance') {
      move('explore', 'railing', 'back-to-entrance');
    }
  });
  function returnToEntrance() {
    if (state.explorationUnlocked && state.stage === 'explore' && state.scene === 'railing') {
      move('explore', 'bar-entrance', 'railing-hotspot');
    }
  }
  $('back-to-entrance').addEventListener('click', returnToEntrance);
  function returnToBar() {
    if (state.explorationUnlocked && ['explore', 'jasmine-dialogue'].includes(state.stage) && state.scene === 'drag-queen') {
      move('explore', 'bar', 'drag-queen-hotspot');
    }
  }
  $('back-to-bar').addEventListener('click', returnToBar);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      returnToDJBooth();
      backFromRestaurantRoom();
      returnToBar();
      returnToEntrance();
      returnToRestaurant();
    }
  });
  for (const image of document.querySelectorAll('.scene')) {
    image.addEventListener('error', () => { $('asset-error').hidden = false; });
    if (image.complete && !image.naturalWidth) $('asset-error').hidden = false;
  }
  // Local-only entry for testing the finale without replaying earlier chapters.
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === 'console') {
    state.djGone = true;
    state.stage = 'console-explore';
    state.scene = 'dj-console';
  }
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === 'ending') {
    state.stage = 'ending';
    state.scene = 'party';
    schedulePartyDance();
    $('birthday-ending').classList.add('show-signature', 'show-music');
    $('music-toggle').inert = false;
    $('music-toggle').textContent = 'Play music';
  }
  render();
})();
