(function (Scratch) {
  'use strict';

  class AnimatedTextXcratch {
    constructor() {
      this.states = {};
    }

    getInfo() {
      return {
        id: 'animatedtextxcratch',
        name: 'Animated Text for Xcratch',
        color1: '#ff66cc',
        color2: '#ff99dd',
        blocks: [
          {
            opcode: 'createText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'erzeuge Text [TEXT] Größe [SIZE] Farbe [COLOR] Hintergrund [BG]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, default: 'Hallo!' },
              SIZE: { type: Scratch.ArgumentType.NUMBER, default: 48 },
              COLOR: { type: Scratch.ArgumentType.COLOR, default: '#ffffff' },
              BG: { type: Scratch.ArgumentType.COLOR, default: '#000000' }
            }
          },
          {
            opcode: 'setEffect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'setze Texteffekt [EFFECT]',
            arguments: {
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effects',
                default: 'Regenbogen'
              }
            }
          },
          {
            opcode: 'animate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'aktualisiere Animation'
          }
        ],
        menus: {
          effects: {
            items: ['Regenbogen', 'Wackeln', 'Pulsieren', 'Drehen', 'Schütteln']
          }
        }
      };
    }

    createText(args, util) {
      const target = util.target;
      const text = args.TEXT;
      const size = Number(args.SIZE);
      const color = args.COLOR;
      const bg = args.BG;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      ctx.font = `${size}px Arial`;
      const width = ctx.measureText(text).width + 20;
      const height = size * 1.6;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${size}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, width / 2, height / 2);

      const md5 = Scratch.vm.runtime.renderer._storeImage(canvas);

      target.addCostume({
        name: 'AnimatedText',
        md5ext: md5,
        dataFormat: 'png',
        rotationCenterX: width / 2,
        rotationCenterY: height / 2
      });

      target.setCostume(target.getCostumes().length - 1);

      this.states[target.id] = {
        effect: 'Regenbogen',
        phase: 0
      };
    }

    setEffect(args, util) {
      const target = util.target;
      if (!this.states[target.id]) return;
      this.states[target.id].effect = args.EFFECT;
    }

    animate(args, util) {
      const target = util.target;
      const state = this.states[target.id];
      if (!state) return;

      state.phase += 0.2;

      switch (state.effect) {
        case 'Regenbogen':
          target.effects.color = (target.effects.color + 5) % 200;
          break;
        case 'Wackeln':
          target.setDirection(90 + Math.sin(state.phase * 10) * 10);
          break;
        case 'Pulsieren':
          target.size = 100 + Math.sin(state.phase * 5) * 20;
          break;
        case 'Drehen':
          target.setDirection(90 + state.phase * 20);
          break;
        case 'Schütteln':
          target.x += (Math.random() - 0.5) * 6;
          target.y += (Math.random() - 0.5) * 6;
          break;
      }
    }
  }

  Scratch.extensions.register(new AnimatedTextXcratch());
})(Scratch);
