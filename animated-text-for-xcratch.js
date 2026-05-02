(function (Scratch) {
  'use strict';

  class AnimatedTextXcratch {
    getInfo() {
      return {
        id: 'animatedtextxcratch',
        name: 'Animated Text for Xcratch',
        blocks: [
          {
            opcode: 'makeText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'erzeuge Text [TEXT] Größe [SIZE]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hallo!' },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 48 }
            }
          }
        ]
      };
    }

    makeText(args, util) {
      const text = args.TEXT;
      const size = Number(args.SIZE);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      ctx.font = `${size}px Arial`;
      const width = ctx.measureText(text).width + 20;
      const height = size * 1.6;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.font = `${size}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, width / 2, height / 2);

      // WICHTIG: Xcratch-kompatible Methode
      const skinId = Scratch.vm.runtime.renderer.createBitmapSkin(canvas, 1);

      util.target.addCostume({
        name: 'Text',
        skinId: skinId,
        rotationCenterX: width / 2,
        rotationCenterY: height / 2
      });

      util.target.setCostume(util.target.getCostumes().length - 1);
    }
  }

  Scratch.extensions.register(new AnimatedTextXcratch());
})(Scratch);
