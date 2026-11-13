/**
 * DRAMATIC PIGEON TRANSLATOR (Barnaby "The Sourdough" Coorleone)
 * Pure HTML5, CSS3 & Procedural Web Audio API
 * Built for Bored AI Web
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL WEB AUDIO SYNTHESIZER (Avian Syrinx Acoustics)
  // =========================================================================
  class PigeonAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.masterGain = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.init();
      this.isMuted = !this.isMuted;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
      }
      return !this.isMuted;
    }

    /**
     * Synthesize a realistic, raspy street pigeon coo
     * Formed with dual modulated sine oscillators + bandpassed throat formant + flutter noise
     */
    playCoo(type = 'normal') {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;

      // Base frequencies depending on coo emotion
      let baseFreq = 260;
      let duration = 0.55;
      let sweepUp = 45;
      let sweepDown = -70;

      if (type === 'question') {
        baseFreq = 290;
        duration = 0.42;
        sweepUp = 90;
        sweepDown = 20;
      } else if (type === 'dramatic') {
        baseFreq = 230;
        duration = 0.85;
        sweepUp = 60;
        sweepDown = -110;
      } else if (type === 'indignant') {
        baseFreq = 340;
        duration = 0.35;
        sweepUp = 120;
        sweepDown = -50;
      }

      // Primary Syrinx Oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);
      // Natural avian frequency inflection
      osc1.frequency.exponentialRampToValueAtTime(baseFreq + sweepUp, now + duration * 0.35);
      osc1.frequency.exponentialRampToValueAtTime(Math.max(120, baseFreq + sweepDown), now + duration);

      // Throat Flutter LFO (avoids synthetic flatness)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(6.5, now); // 6.5 Hz pigeon throat tremolo
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(14, now);
      lfo.connect(osc1.frequency);

      // Secondary Formant Oscillator (adds richness to chest resonance)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime((baseFreq + sweepUp) * 1.48, now + duration * 0.35);
      osc2.frequency.exponentialRampToValueAtTime(Math.max(160, (baseFreq + sweepDown) * 1.5), now + duration);

      // Avian Syrinx Resonant Formant Filter
      const formantFilter = this.ctx.createBiquadFilter();
      formantFilter.type = 'bandpass';
      formantFilter.frequency.setValueAtTime(580, now);
      formantFilter.Q.setValueAtTime(3.2, now);

      // Raspy Throat Air Noise
      const noiseBuffer = this.createNoiseBuffer(duration);
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(850, now);
      noiseFilter.Q.setValueAtTime(2.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Coo Volume Envelope
      const cooGain = this.ctx.createGain();
      cooGain.gain.setValueAtTime(0.001, now);
      cooGain.gain.linearRampToValueAtTime(0.35, now + duration * 0.15);
      cooGain.gain.linearRampToValueAtTime(0.28, now + duration * 0.6);
      cooGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Routing
      osc1.connect(formantFilter);
      osc2.connect(formantFilter);
      formantFilter.connect(cooGain);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(cooGain);

      cooGain.connect(this.masterGain);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);
      noiseSource.start(now);

      lfo.stop(now + duration);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      noiseSource.stop(now + duration);
    }

    /**
     * Synthesizes sharp wooden bench peck sound
     */
    playPeck() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;

      // Wooden impact tap
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      // Click snap noise
      const noiseBuf = this.createNoiseBuffer(0.02);
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseFilt = this.ctx.createBiquadFilter();
      noiseFilt.type = 'highpass';
      noiseFilt.frequency.setValueAtTime(1400, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.masterGain);
      noise.connect(noiseFilt);
      noiseFilt.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.04);
      noise.stop(now + 0.02);
    }

    /**
     * Synthesizes crunchy crumb munch
     */
    playMunch() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const buf = this.createNoiseBuffer(0.08);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const filt = this.ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(1200, now);
      filt.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.masterGain);
      src.start(now);
      src.stop(now + 0.08);
    }

    /**
     * Synthesizes startled avian wing flutter
     */
    playWingFlap() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const duration = 0.32;
      const buf = this.createNoiseBuffer(duration);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start(now);
      src.stop(now + duration);
    }

    /**
     * Dramatic orchestral minor chord stab for verdict delivery
     */
    playDramaticStab() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      // D Minor dramatic brass chord (D2, A2, D3, F3, C4)
      const freqs = [73.42, 110.0, 146.83, 174.61, 261.63];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx < 2 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.4);
      });
    }

    /**
     * Shimmering pentatonic chime for golden breadcrumbs
     */
    playAngelicChime() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.85);
      });
    }

    createNoiseBuffer(duration) {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }
  }

  // =========================================================================
  // 2. BREADCRUMB PHYSICS SYSTEM
  // =========================================================================
  class CrumbSystem {
    constructor(canvas, onCrumbEaten, audio) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.onCrumbEaten = onCrumbEaten;
      this.audio = audio;
      this.crumbs = [];
      this.crumbHistory = [];
      this.gravity = 980; // px/s²
      this.lastTime = performance.now();

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.width = rect.width;
      this.height = rect.height;
      // Calculate bench surface height in canvas coordinates
      this.benchY = this.height * 0.68;
    }

    spawnCrumb(x, y, count = 2) {
      const now = Date.now();
      this.crumbHistory.push(now);
      this.crumbHistory = this.crumbHistory.filter(t => now - t < 4000);

      // Check for Crumb Hysteria / Frenzy
      if (this.crumbHistory.length >= 8) {
        this.triggerFrenzy();
      }

      for (let i = 0; i < count; i++) {
        const isGolden = Math.random() < 0.08;
        if (isGolden) {
          this.audio.playAngelicChime();
        }

        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = 120 + Math.random() * 180;
        const crumb = {
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: isGolden ? 5.5 : 3.5 + Math.random() * 2.5,
          color: isGolden ? '#fef08a' : (Math.random() > 0.5 ? '#f59e0b' : '#d97706'),
          isGolden: isGolden,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 8,
          bounces: 0,
          settled: false,
          created: now
        };
        this.crumbs.push(crumb);
      }
    }

    triggerFrenzy() {
      this.crumbHistory = [];
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fde047', '#ffffff']
        });
      }
      const bubble = document.getElementById('pigeon-mood-bubble');
      if (bubble) {
        document.getElementById('pigeon-mood-emoji').textContent = '🚨';
        document.getElementById('pigeon-mood-text').textContent = 'CRUMB FRENZY HYSTERIA!!';
        setTimeout(() => {
          document.getElementById('pigeon-mood-emoji').textContent = '🥖';
          document.getElementById('pigeon-mood-text').textContent = 'Vigilant';
        }, 3000);
      }
    }

    update(dt) {
      for (let i = this.crumbs.length - 1; i >= 0; i--) {
        const c = this.crumbs[i];
        if (!c.settled) {
          c.vy += this.gravity * dt;
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.rotation += c.vRot * dt;

          // Bench bounce
          if (c.y >= this.benchY) {
            c.y = this.benchY;
            c.vy = -c.vy * 0.38;
            c.vx *= 0.65;
            c.bounces++;
            if (Math.abs(c.vy) < 25 && Math.abs(c.vx) < 20) {
              c.settled = true;
              c.vy = 0;
              c.vx = 0;
            }
          }
        }
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (const c of this.crumbs) {
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate(c.rotation);

        if (c.isGolden) {
          // Shimmering golden glow
          this.ctx.shadowColor = '#fde047';
          this.ctx.shadowBlur = 12;
        } else {
          this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
          this.ctx.shadowBlur = 4;
        }

        this.ctx.fillStyle = c.color;
        this.ctx.beginPath();
        this.ctx.rect(-c.radius, -c.radius * 0.7, c.radius * 2, c.radius * 1.4);
        this.ctx.fill();

        this.ctx.restore();
      }
    }

    getNearestCrumb(x) {
      if (this.crumbs.length === 0) return null;
      let nearest = null;
      let minDist = Infinity;
      for (const c of this.crumbs) {
        const dist = Math.abs(c.x - x);
        if (dist < minDist) {
          minDist = dist;
          nearest = c;
        }
      }
      return { crumb: nearest, dist: minDist };
    }

    removeCrumb(crumb) {
      const idx = this.crumbs.indexOf(crumb);
      if (idx !== -1) {
        this.crumbs.splice(idx, 1);
        this.onCrumbEaten(crumb);
      }
    }
  }

  // =========================================================================
  // 3. PIGEON CONTROLLER (Barnaby Character Agent)
  // =========================================================================
  class PigeonController {
    constructor(actorEl, crumbSystem, audio) {
      this.actorEl = actorEl;
      this.crumbSystem = crumbSystem;
      this.audio = audio;
      this.pupilEl = document.getElementById('pigeon-pupil');
      this.moodBubbleEl = document.getElementById('pigeon-mood-bubble');
      this.moodEmojiEl = document.getElementById('pigeon-mood-emoji');
      this.moodTextEl = document.getElementById('pigeon-mood-text');

      this.currentX = 0.5; // percentage across bench (0.2 to 0.75)
      this.targetX = 0.5;
      this.facing = 1; // 1 = right, -1 = left
      this.state = 'IDLE'; // IDLE, WADDLING, PECKING, STARTLED, COOING
      this.crumbsEaten = 0;
      this.isBusy = false;

      this.initEvents();
      this.startAI();
    }

    initEvents() {
      // Direct click on Barnaby
      this.actorEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startle();
      });

      // Eye tracking cursor
      window.addEventListener('mousemove', (e) => {
        this.trackCursor(e.clientX, e.clientY);
      });
    }

    trackCursor(mouseX, mouseY) {
      if (!this.pupilEl) return;
      const rect = this.actorEl.getBoundingClientRect();
      const eyeX = rect.left + rect.width * 0.76;
      const eyeY = rect.top + rect.height * 0.22;

      const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
      const maxDistance = 2.4; // Max pupil offset in SVG px
      const dx = Math.cos(angle) * maxDistance;
      const dy = Math.sin(angle) * maxDistance;

      this.pupilEl.setAttribute('cx', 152 + dx);
      this.pupilEl.setAttribute('cy', 45 + dy);
    }

    setMood(emoji, text, duration = 3000) {
      if (!this.moodBubbleEl) return;
      this.moodEmojiEl.textContent = emoji;
      this.moodTextEl.textContent = text;
      this.moodBubbleEl.style.opacity = '1';

      if (this.moodTimer) clearTimeout(this.moodTimer);
      this.moodTimer = setTimeout(() => {
        this.moodEmojiEl.textContent = '🥖';
        this.moodTextEl.textContent = 'Judging...';
      }, duration);
    }

    startle() {
      this.audio.playWingFlap();
      this.audio.playCoo('indignant');
      this.actorEl.classList.add('is-startled');

      const indignations = [
        ['💢', 'UNHAND ME, FEATHERLESS CREATURE!'],
        ['👀', 'DO NOT TOUCH THE SOURDOUGH EMPEROR!'],
        ['😤', 'YOU DISRESPECT MY GLOSSY NECK FEATHERS!'],
        ['🚨', 'SECURITY! SUMMON THE PARK SPARROWS!'],
        ['🥖', 'NO FREE COUNSEL WITHOUT BAGEL RETENTION!']
      ];
      const pick = indignations[Math.floor(Math.random() * indignations.length)];
      this.setMood(pick[0], pick[1], 3500);

      setTimeout(() => {
        this.actorEl.classList.remove('is-startled');
      }, 420);
    }

    startAI() {
      const loop = () => {
        if (!this.isBusy) {
          const benchRect = document.getElementById('bench-seat').getBoundingClientRect();
          const pigeonPixelX = benchRect.left + benchRect.width * this.currentX;

          const nearest = this.crumbSystem.getNearestCrumb(pigeonPixelX);

          if (nearest && nearest.crumb) {
            const targetRatio = (nearest.crumb.x - benchRect.left) / benchRect.width;
            const clampedTarget = Math.max(0.12, Math.min(0.82, targetRatio));

            // Face target crumb
            const newFacing = targetRatio > this.currentX ? 1 : -1;
            if (newFacing !== this.facing) {
              this.facing = newFacing;
              this.updateTransform();
            }

            if (Math.abs(clampedTarget - this.currentX) > 0.05) {
              // Waddle closer
              this.waddleTowards(clampedTarget);
            } else {
              // Peck crumb
              this.peckCrumb(nearest.crumb);
            }
          } else {
            // Idle random glance or tiny shuffle
            if (Math.random() < 0.12) {
              this.audio.playCoo('normal');
            }
          }
        }
        setTimeout(loop, 600 + Math.random() * 800);
      };
      loop();
    }

    waddleTowards(targetRatio) {
      this.actorEl.classList.add('is-waddling');
      const step = 0.06;
      if (targetRatio > this.currentX) {
        this.currentX = Math.min(targetRatio, this.currentX + step);
      } else {
        this.currentX = Math.max(targetRatio, this.currentX - step);
      }
      this.actorEl.style.left = `${this.currentX * 100}%`;

      setTimeout(() => {
        this.actorEl.classList.remove('is-waddling');
      }, 400);
    }

    peckCrumb(crumb) {
      this.isBusy = true;
      this.actorEl.classList.add('is-pecking');
      this.audio.playPeck();

      setTimeout(() => {
        this.audio.playMunch();
        this.crumbSystem.removeCrumb(crumb);
        this.crumbsEaten++;
        const counter = document.getElementById('crumbs-eaten-counter');
        if (counter) counter.textContent = this.crumbsEaten;

        this.actorEl.classList.remove('is-pecking');
        this.isBusy = false;
      }, 240);
    }

    updateTransform() {
      this.actorEl.style.transform = `scaleX(${this.facing})`;
    }

    startCooing() {
      this.actorEl.classList.add('is-cooing');
    }

    stopCooing() {
      this.actorEl.classList.remove('is-cooing');
    }
  }

  // =========================================================================
  // 4. PIGEON BRAIN & TRANSLATION KNOWLEDGE BASE
  // =========================================================================
  const PIGEON_VOCABULARY = {
    intros: [
      "Hoo-hoo... coo-ROOO! (Trans: 'I have ingested thy confession with deep avian scrutiny.')",
      "Coo-coo-roo... brrr! (Trans: 'Behold the tragic absurdity of mammalian priorities.')",
      "Krrr-coo... coo! (Trans: 'Hear now the verdict of the Sovereign Bench Council.')",
      "Coo-roo-cluck! (Trans: 'Thy dilemma is weighed against the golden grain standard.')"
    ],

    modes: {
      economics: [
        {
          keywords: ['job', 'work', 'boss', 'slack', 'overtime', 'career', 'promotion', 'email'],
          translation: "Coo-roo! (Trans: 'Trading 40 hours of sunlight under fluorescent tubes for digital digits? An utter deficit. A single french fry contains more tangible wealth than thy entire quarterly equity vest.')",
          valuation: "0.02 Stale Saltine (Depreciating daily)",
          verdict: "Catastrophic Caloric Misallocation",
          directive: "Close laptop, perch on park fountain, demand bread subsidies from municipal joggers."
        },
        {
          keywords: ['latte', 'coffee', 'matcha', 'drink', 'cafe', 'expensive', 'dollar', 'money', 'bought', 'spent'],
          translation: "Brrr-coo! (Trans: 'Spending eight human dollars on foamed green liquid? In the bakery quarter, eight dollars buys two full baguettes and a loaf of seeded rye. Thy financial sanity is extinct.')",
          valuation: "Negative 14 Sesame Bagel Seeds",
          verdict: "Liquid Luxury Delusion",
          directive: "Drink rainwater from the park bench puddle like an economically rational biped."
        },
        {
          keywords: ['cheese', 'art', 'sculpt', 'creative', 'quit', 'passion', 'dream'],
          translation: "Coo-ROOO! (Trans: 'Artisanal cheese? A noble curd. However, pigeons cannot easily consume aged gouda without water proximity. We demand standard carbohydrates.')",
          valuation: "1.2 Sourdough Crusts (Speculative Bubble)",
          verdict: "Eccentric Dairy Deviation",
          directive: "Sculpt the cheese into statues of famous historical pigeons to appease us."
        },
        {
          keywords: ['shoes', 'gym', 'run', 'workout', 'fitness', 'exercise'],
          translation: "Hoo-coo! (Trans: 'Buying special rubber footwear to run in circles while stationary? Pigeons fly 40 mph simply to seize a discarded croissant from a toddler.')",
          valuation: "Zero Caloric Dividend",
          verdict: "Comical Physical Pretension",
          directive: "Run only when pursued by a golden retriever or an aggressive municipal sweeper."
        },
        {
          keywords: ['ex', 'text', 'message', 'love', 'date', 'tinder', 'relationship'],
          translation: "Coo-krrr! (Trans: 'Pigeons mate for life and jointly defend the air conditioning vent. Sending midnight texts to a former nest-mate demonstrates severe navigational degradation.')",
          valuation: "0.00 Crumb Equity",
          verdict: "Emotional Insolvency",
          directive: "Drop phone into municipal sewer grate; feast on forgotten soft pretzel."
        }
      ],

      existential: [
        {
          keywords: ['job', 'work', 'boss', 'slack', 'overtime', 'career'],
          translation: "Coo-ROOO! (Trans: 'Thy boss is also an ape who shall one day return to dust, while our descendants shall still defecate upon bronze statesmen. Respond not to the Slack message.')",
          valuation: "Cosmic Irrelevance",
          verdict: "Illusion of Corporate Permanence",
          directive: "Ignore ping. Contemplate the infinite expanse of the urban troposphere."
        },
        {
          keywords: ['flight', 'plane', 'gate', 'you too', 'embarrassing', 'awkward', 'cringe'],
          translation: "Hoo-coo! (Trans: 'Telling the gate agent \"you too\" when told to have a safe flight? Pigeons do not need aluminum cylinders to conquer the sky. Thy shame is justified.')",
          valuation: "1 Crumpled Boarding Pass",
          verdict: "Terminal Social Malfunction",
          directive: "Walk backward into park shrubbery; pretend to be an ornamental shrub."
        },
        {
          keywords: ['ex', 'text', 'message', 'love', 'date'],
          translation: "Coo-brrr... (Trans: 'Love is fleeting, but a sesame bagel toasted to perfection is eternal. Why yearn for past entanglements when there are 4,000 unattended picnic blankets?')",
          valuation: "1 Soggy Tissue Paper",
          verdict: "Nostalgic Futility",
          directive: "Cleanse thy soul with aggressive head bobbing and a vigorous wing shake."
        }
      ],

      warfare: [
        {
          keywords: ['job', 'work', 'boss', 'office', 'corporate'],
          translation: "Krrr-coo-coo! (Trans: 'Transmit the GPS coordinates of thy corporate headquarters immediately. Flight Wing Delta is preparing an aerial strike on the executive parking lot.')",
          valuation: "Target Acquired: 1 Luxury Sedan",
          verdict: "Ready for Tactical Avian Bombardment",
          directive: "Deploy white guano precision strikes on windshield wiper blades."
        },
        {
          keywords: ['statue', 'park', 'monument', 'bronze', 'general'],
          translation: "Coo-ROOO! (Trans: 'The bronze general on the municipal horse has stood uncontested for too long. Today, we claim his bicorne hat as our sovereign throne.')",
          valuation: "Strategic Monument Domination",
          verdict: "Imperial Territory Expansion",
          directive: "Coordinate 300 pigeons to blanket the monument with aerodynamic whitewash."
        },
        {
          keywords: ['ex', 'text', 'boss', 'neighbor', 'enemy'],
          translation: "Coo-coo-cluck! (Trans: 'Identify the target biped. Our reconnaissance sparrows shall track their movements and drop stale pretzel fragments upon their hair.')",
          valuation: "Psychological Avian Warfare",
          verdict: "Preemptive Feathered Deterrence",
          directive: "Swoop 2 inches above their head while emitting a shrill aerodynamic whistle."
        }
      ]
    },

    generic: [
      {
        translation: "Hoo-coo... coo-ROOO! (Trans: 'We have consulted the sacred crumb index. Thy human anxieties stem from wearing tight shoes and failing to forage from the bakery dumpster at dawn.')",
        valuation: "0.12 Stale Brioche Flake",
        verdict: "Standard Featherless Folly",
        directive: "Scatter four handfuls of sourdough crumbs upon this bench and depart in silence."
      },
      {
        translation: "Coo-krrr! (Trans: 'A pigeon contemplates only three things: where is crumb, who has crumb, and why is that child chasing me. Thy complex problem is entirely self-inflicted.')",
        valuation: "0.01 Unpopped Popcorn Kernel",
        verdict: "Overthinking the Unforageable",
        directive: "Bob thy head aggressively three times and consume carbohydrates immediately."
      },
      {
        translation: "Coo-ROOO-coo! (Trans: 'The laws of crumb physics are immutable. Worrying about tomorrow’s weather prevents thee from seizing today’s croissant. Seek the bread.')",
        valuation: "0.45 Cinnamon Roll Crust",
        verdict: "Delayed Gratification Deficit",
        directive: "Approach local pastry shop with unblinking avian gaze until baked goods are surrendered."
      }
    ]
  };

  class PigeonBrain {
    constructor(audio, pigeonController) {
      this.audio = audio;
      this.pigeon = pigeonController;
      this.subtitleEl = document.getElementById('subtitles-text');
      this.crumbValEl = document.getElementById('crumb-valuation-val');
      this.benchVerdictEl = document.getElementById('bench-verdict-val');
      this.directiveEl = document.getElementById('pigeon-directive-val');
      this.waveformEl = document.getElementById('mini-waveform');
      this.currentMode = 'economics';
      this.lastJudgment = null;
    }

    setMode(mode) {
      this.currentMode = mode;
    }

    judge(inputText) {
      const text = inputText.toLowerCase().trim();
      const pool = PIGEON_VOCABULARY.modes[this.currentMode] || PIGEON_VOCABULARY.modes.economics;

      // Find keyword match
      let match = null;
      for (const item of pool) {
        if (item.keywords && item.keywords.some(k => text.includes(k))) {
          match = item;
          break;
        }
      }

      if (!match) {
        // Fallback to generic avian wisdom
        const generics = PIGEON_VOCABULARY.generic;
        match = generics[Math.floor(Math.random() * generics.length)];
      }

      this.lastJudgment = match;
      this.deliverJudgment(match);
    }

    deliverJudgment(judgment) {
      this.pigeon.startCooing();
      this.audio.playCoo('dramatic');
      if (this.waveformEl) this.waveformEl.classList.add('active');

      const fullText = judgment.translation;
      this.subtitleEl.textContent = '';
      let charIndex = 0;

      // Clear previous timer
      if (this.typewriterTimer) clearInterval(this.typewriterTimer);

      this.typewriterTimer = setInterval(() => {
        if (charIndex < fullText.length) {
          this.subtitleEl.textContent += fullText[charIndex];
          charIndex++;
          // Occasional micro-coo while typing
          if (charIndex % 35 === 0) {
            this.audio.playCoo('question');
          }
        } else {
          clearInterval(this.typewriterTimer);
          this.pigeon.stopCooing();
          if (this.waveformEl) this.waveformEl.classList.remove('active');

          // Reveal verdict metrics with dramatic chord stab
          this.crumbValEl.textContent = judgment.valuation;
          this.benchVerdictEl.textContent = judgment.verdict;
          this.directiveEl.textContent = judgment.directive;
          this.audio.playDramaticStab();

          // Celebration confetti for dramatic judgments
          if (window.confetti && Math.random() < 0.6) {
            window.confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.8 },
              colors: ['#10b981', '#3b82f6', '#f59e0b']
            });
          }
        }
      }, 20);
    }

    reCoo() {
      if (this.lastJudgment) {
        this.deliverJudgment(this.lastJudgment);
      } else {
        this.audio.playCoo('dramatic');
      }
    }
  }

  // =========================================================================
  // 5. FALLING AUTUMN LEAVES CANVAS BACKGROUND
  // =========================================================================
  class LeavesSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.leaves = [];
      this.colors = ['#b45309', '#d97706', '#92400e', '#78350f', '#ca8a04'];
      this.resize();
      this.initLeaves();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    initLeaves() {
      this.leaves = [];
      const count = Math.min(24, Math.floor(this.width / 45));
      for (let i = 0; i < count; i++) {
        this.leaves.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 7 + Math.random() * 8,
          speedY: 20 + Math.random() * 40,
          speedX: 10 + Math.random() * 25,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 2,
          color: this.colors[Math.floor(Math.random() * this.colors.length)]
        });
      }
    }

    update(dt) {
      for (const leaf of this.leaves) {
        leaf.y += leaf.speedY * dt;
        leaf.x += Math.sin(leaf.angle) * leaf.speedX * dt;
        leaf.angle += leaf.vAngle * dt;

        if (leaf.y > this.height + 20) {
          leaf.y = -20;
          leaf.x = Math.random() * this.width;
        }
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (const leaf of this.leaves) {
        this.ctx.save();
        this.ctx.translate(leaf.x, leaf.y);
        this.ctx.rotate(leaf.angle);
        this.ctx.fillStyle = leaf.color;
        this.ctx.globalAlpha = 0.55;

        // Leaf oval shape
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, leaf.size, leaf.size * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  // =========================================================================
  // 6. MAIN APPLICATION INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const audio = new PigeonAudio();

    // Canvas elements
    const crumbCanvas = document.getElementById('crumb-canvas');
    const leavesCanvas = document.getElementById('leaves-canvas');
    const pigeonActorEl = document.getElementById('pigeon-actor');

    // Systems
    const leavesSystem = new LeavesSystem(leavesCanvas);
    let crumbSystem = null;
    let pigeonController = null;
    let pigeonBrain = null;

    crumbSystem = new CrumbSystem(crumbCanvas, (crumb) => {
      // Callback when crumb is eaten
    }, audio);

    pigeonController = new PigeonController(pigeonActorEl, crumbSystem, audio);
    pigeonBrain = new PigeonBrain(audio, pigeonController);

    // Main animation loop
    let lastTime = performance.now();
    function animate(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      leavesSystem.update(dt);
      leavesSystem.render();

      crumbSystem.update(dt);
      crumbSystem.render();

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // =======================================================================
    // User Interactions & Controls
    // =======================================================================

    // Audio Mute Button
    const btnSound = document.getElementById('btn-sound');
    const soundLabel = document.getElementById('sound-label');
    btnSound.addEventListener('click', () => {
      const active = audio.toggleMute();
      btnSound.innerHTML = active ? '🔊 <span id="sound-label">Audio ON</span>' : '🔇 <span id="sound-label">Audio OFF</span>';
    });

    // Toss Crumb Button in HUD
    const btnTossHud = document.getElementById('btn-toss-crumb-hud');
    btnTossHud.addEventListener('click', () => {
      audio.init();
      const rect = crumbCanvas.getBoundingClientRect();
      crumbSystem.spawnCrumb(rect.width * 0.5, rect.height * 0.35, 3);
    });

    // Clicking anywhere on the theater stage drops crumbs
    crumbCanvas.addEventListener('pointerdown', (e) => {
      audio.init();
      const rect = crumbCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      crumbSystem.spawnCrumb(x, y, 2);
    });

    // Spacebar drops crumbs
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        audio.init();
        const rect = crumbCanvas.getBoundingClientRect();
        crumbSystem.spawnCrumb(rect.width * 0.5, rect.height * 0.35, 3);
      } else if (e.code === 'KeyM' && document.activeElement.tagName !== 'INPUT') {
        btnSound.click();
      }
    });

    // Confession Form Submission
    const form = document.getElementById('confession-form');
    const input = document.getElementById('confession-input');
    const btnClearInput = document.getElementById('btn-clear-input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.init();
      const text = input.value.trim();
      if (!text) {
        pigeonController.setMood('❓', 'SPEAK UP, FEATHERLESS ONE!');
        audio.playCoo('question');
        return;
      }
      pigeonBrain.judge(text);
    });

    btnClearInput.addEventListener('click', () => {
      input.value = '';
      input.focus();
    });

    // Mode Selector radio buttons
    const modePills = document.querySelectorAll('.mode-pill');
    modePills.forEach(pill => {
      pill.addEventListener('click', () => {
        modePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const radio = pill.querySelector('input');
        if (radio) {
          radio.checked = true;
          pigeonBrain.setMode(radio.value);
          audio.playCoo('normal');
        }
      });
    });

    // Quick Dilemma Chips
    const chips = document.querySelectorAll('.chip-btn:not(#btn-random-chip)');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        audio.init();
        const dilemma = chip.getAttribute('data-text');
        input.value = dilemma;
        pigeonBrain.judge(dilemma);
      });
    });

    // Random Dilemma Chip
    const btnRandomChip = document.getElementById('btn-random-chip');
    const randomDilemmas = [
      "I replied 'Thanks, love you' to my dentist via text.",
      "Should I buy a 4th mechanical keyboard with clicky blue switches?",
      "I ate ice cream straight from the tub at 2:45 AM while staring into the void.",
      "Should I tell my roommate their artisanal sourdough loaf was mediocre?",
      "I put 'proficient in Excel' on my CV but only know how to make cells bright yellow.",
      "I apologized to a mannequin after bumping into it at Zara.",
      "Should I start a podcast with zero listeners about urban park pigeons?"
    ];
    btnRandomChip.addEventListener('click', () => {
      audio.init();
      const pick = randomDilemmas[Math.floor(Math.random() * randomDilemmas.length)];
      input.value = pick;
      pigeonBrain.judge(pick);
    });

    // Copy Translation to Clipboard
    const btnCopy = document.getElementById('btn-copy-verdict');
    const copyToast = document.getElementById('copy-toast');
    btnCopy.addEventListener('click', () => {
      const text = document.getElementById('subtitles-text').textContent.trim();
      const val = document.getElementById('crumb-valuation-val').textContent.trim();
      const verdict = document.getElementById('bench-verdict-val').textContent.trim();
      const shareString = `🕊️ BARNABY'S PIGEON TRANSLATION:\n"${text}"\n📊 Crumb Valuation: ${val}\n⚖️ Verdict: ${verdict}\n— Consult the Pigeon: https://dmytro-filatov-88.github.io/pigeon-translator/`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareString).then(() => {
          copyToast.classList.add('visible');
          setTimeout(() => copyToast.classList.remove('visible'), 2400);
        });
      }
    });

    // Re-Coo Button
    const btnReCoo = document.getElementById('btn-re-coo');
    btnReCoo.addEventListener('click', () => {
      audio.init();
      pigeonBrain.reCoo();
    });

    // =======================================================================
    // Modals (Dossier & Memorial Plaque)
    // =======================================================================
    const dossierModal = document.getElementById('dossier-modal');
    const btnDossier = document.getElementById('btn-dossier');
    const btnCloseDossier = document.getElementById('btn-close-dossier');
    const btnFeedBribe = document.getElementById('btn-feed-bribe');

    btnDossier.addEventListener('click', () => {
      audio.init();
      dossierModal.classList.add('is-open');
    });

    btnCloseDossier.addEventListener('click', () => {
      dossierModal.classList.remove('is-open');
    });

    btnFeedBribe.addEventListener('click', () => {
      audio.init();
      dossierModal.classList.remove('is-open');
      const rect = crumbCanvas.getBoundingClientRect();
      crumbSystem.spawnCrumb(rect.width * 0.45, rect.height * 0.35, 5);
      pigeonController.setMood('🤤', 'MAGNIFICENT BRIBE ACCEPTED!');
      audio.playCoo('dramatic');
    });

    // Memorial Plaque Modal
    const plaqueModal = document.getElementById('plaque-modal');
    const memorialPlaque = document.getElementById('memorial-plaque');
    const btnClosePlaque = document.getElementById('btn-close-plaque');

    memorialPlaque.addEventListener('click', () => {
      audio.init();
      plaqueModal.classList.add('is-open');
      audio.playCoo('question');
    });

    btnClosePlaque.addEventListener('click', () => {
      plaqueModal.classList.remove('is-open');
    });

    // Close modals on outside backdrop click
    [dossierModal, plaqueModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-open');
        }
      });
    });

  });
})();
