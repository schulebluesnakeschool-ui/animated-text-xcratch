// Animated Text for Xcratch – Costume-based text effects extension
// Basic multi-effect implementation for Scratch 3 / Xcratch

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions) {
    // Older environments not supported
    return;
  }

  const vm = Scratch.vm;

  class AnimatedTextForXcratch {
    constructor(runtime) {
      this.runtime = runtime;
      this.textStates = new Map(); // spriteId -> state
      this.defaultFont = '48px Arial';
    }

    getInfo() {
      return {
        id: 'animatedTextForXcratch',
        name: 'Animated Text for Xcratch',
        color1: '#ff7ac4',
        color2: '#ffb3e0',
        blocks: [
          {
            opcode: 'createTextCostume',
            blockType: Scratch.BlockType.COMMAND,
            text: 'erzeuge Text [TEXT] mit Effekt [EFFECT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hallo Xcratch!'
              },
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effects',
                defaultValue: 'Regenbogen'
              }
            }
          },
          {
            opcode: 'setTextStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'setze Textgröße [SIZE] Farbe [COLOR] Hintergrund [BGCOLOR]',
            arguments: {
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 48
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              BGCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              }
            }
          },
          {
            opcode: 'updateAnimation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'aktualisiere Textanimation',
            arguments: {}
          },
          {
            opcode: 'setAnimationSpeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'setze Animationsgeschwindigkeit [SPEED]',
            arguments: {
              SPEED: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          }
        ],
        menus: {
          effects: {
            acceptReporters: true,
            items: [
              'Regenbogen',
              'Wackeln',
              'Tippen',
              'Pulsieren',
              'Fade',
              'Bounce',
              'Drehen',
              'Welle',
              'Schütteln'
            ]
          }
        }
      };
    }

    _getSpriteState(target) {
      const id = target.id;
      if (!this.textStates.has(id)) {
        this.textStates.set(id, {
          text: 'Hallo Xcratch!',
          effect: 'Regenbogen',
          size: 48,
          color: '#ffffff',
          bgColor: '#000000',
          speed: 1,
          phase: 0,
          lastUpdate: Date.now()
        });
      }
      return this.textStates.get(id);
    }

    _createCanvas(text, size, color, bgColor) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const font = `${size}px Arial`;
      ctx.font = font;
      const metrics = ctx.measureText(text);
      const width = Math.ceil(metrics.width + size * 0.5);
      const height = Math.ceil(size * 1.6);

      canvas.width = width;
      canvas.height = height;

      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Hintergrund
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Text
      ctx.fillStyle = color;
      ctx.fillText(text, width / 2, height / 2);

      return canvas;
    }

    _applyEffectToTarget(target, state) {
      const now = Date.now();
      const dt = (now - state.lastUpdate) / 1000;
      state.lastUpdate = now;
      state.phase += dt * state.speed * 5;

      const sprite = target;
      const phase = state.phase;

      switch (state.effect) {
        case 'Wackeln':
          sprite.setDirection(90 + Math.sin(phase * 10) * 10);
          break;
        case 'Regenbogen':
          // Farbe über Effekt simulieren: wir ändern die Farbe des Sprites
          sprite.effects.color = (sprite.effects.color + state.speed * 5) % 200;
          break;
        case 'Tippen':
          // Textlänge progressiv anzeigen: hier nur einfache Kostüm-Wechsel-Logik
          // (für echte Typ-Animation müsste man mehrere Kostüme erzeugen)
          break;
        case 'Pulsieren':
          sprite.size = 100 + Math.sin(phase * 5) * 20;
          break;
        case 'Fade':
          sprite.effects.ghost = (Math.sin(phase * 2) * 50) + 50;
          break;
        case 'Bounce':
          sprite.y = sprite.y + Math.sin(phase * 8) * 2;
          break;
        case 'Drehen':
          sprite.setDirection(90 + phase * 50);
          break;
        case 'Welle':
          sprite.y = sprite.y + Math.sin(phase * 4) * 3;
          sprite.x = sprite.x + Math.cos(phase * 4) * 3;
          break;
        case 'Schütteln':
          sprite.x = sprite.x + (Math.random() - 0.5) * 4;
          sprite.y = sprite.y + (Math.random() - 0.5) * 4;
          break;
      }
    }

    createTextCostume(args, util) {
      const target = util.target;
      const state = this._getSpriteState(target);

      const text = String(args.TEXT || '').trim() || ' ';
      const effect = String(args.EFFECT || 'Regenbogen');

      state.text = text;
      state.effect = effect;

      const canvas = this._createCanvas(
        state.text,
        state.size,
        state.color,
        state.bgColor
      );

      const costumeName = `AnimatedText: ${state.text}`;
      const md5ext = vm.runtime.renderer._storeImage(canvas);

      const costume = {
        name: costumeName,
        md5ext: md5ext,
        dataFormat: 'png',
        rotationCenterX: canvas.width / 2,
        rotationCenterY: canvas.height / 2
      };

      target.addCostume(costume);
      target.setCostume(target.getCostumes().length - 1);
    }

    setTextStyle(args, util) {
      const target = util.target;
      const state = this._getSpriteState(target);

      const size = Number(args.SIZE) || 48;
      const color = args.COLOR || '#ffffff';
      const bgColor = args.BGCOLOR || '#000000';

      state.size = size;
      state.color = color;
      state.bgColor = bgColor;
    }

    setAnimationSpeed(args, util) {
      const target = util.target;
      const state = this._getSpriteState(target);

      const speed = Number(args.SPEED) || 1;
      state.speed = speed;
    }

    updateAnimation(args, util) {
      const target = util.target;
      const state = this._getSpriteState(target);
      this._applyEffectToTarget(target, state);
    }
  }

  Scratch.extensions.register(new AnimatedTextForXcratch(Scratch.vm.runtime));
})(Scratch);
