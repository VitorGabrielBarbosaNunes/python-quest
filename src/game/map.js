import Phaser from 'phaser';

// O mapa é desenhado localmente: nenhum sprite ou imagem de terceiros.
export function createMap(
  parent,
  { world = 1, completed = {}, current = 1, reducedMotion = false, onSelect = () => {} } = {},
) {
  const palettes = [
    [0xe3f0dd, 0xbcd6a0, 0x78a773, 0x29694d],
    [0xf4e8cc, 0xe7cb8a, 0xb9b16e, 0xa36c3a],
    [0xe0ebde, 0xacc9a5, 0x669878, 0x285b48],
    [0xe6e8f5, 0xc5c6df, 0x9babc9, 0x646d9f],
    [0xeee1ec, 0xd7bfd4, 0xb19abe, 0x845d8e],
  ];
  const palette = palettes[world - 1];
  class MapScene extends Phaser.Scene {
    create() {
      const g = this.add.graphics();
      g.fillStyle(palette[0]);
      g.fillRoundedRect(0, 0, 1000, 430, 22);
      // Ilhas, rio e caminho dão profundidade ao cenário com formas locais.
      g.fillStyle(palette[1], 0.65);
      g.fillEllipse(230, 320, 660, 340);
      g.fillEllipse(780, 340, 620, 330);
      g.fillStyle(0xffffff, 0.45);
      g.fillEllipse(500, 420, 920, 80);
      const river = new Phaser.Curves.Spline([
        0, 390, 160, 360, 370, 405, 530, 375, 800, 410, 1000, 350,
      ]);
      g.lineStyle(23, 0xa3d0d0, 0.7);
      river.draw(g, 80);
      g.lineStyle(2, 0xe5f7ed, 0.8);
      river.draw(g, 80);
      for (let i = 0; i < 25; i++) {
        const x = (i * 179 + 50) % 980,
          y = 60 + ((i * 67) % 270);
        if (i % 4 === 0) this.rock(g, x, y);
        else this.tree(g, x, y, 0.6 + (i % 3) * 0.2);
      }
      if (world === 2) {
        this.house(g, 250, 140);
        this.house(g, 650, 110);
      }
      if (world === 4) {
        g.fillStyle(0xa8abc7);
        g.fillTriangle(390, 140, 480, 10, 570, 140);
        g.fillStyle(0xffffff);
        g.fillTriangle(457, 43, 480, 10, 505, 45);
      }
      this.castle(g, 880, 100, world === 5);
      const points = [
        [100, 287],
        [300, 220],
        [490, 285],
        [680, 215],
        [873, 260],
      ];
      const path = new Phaser.Curves.Spline(points.flat());
      g.lineStyle(29, 0xb7a77a, 0.28);
      path.draw(g, 80);
      g.lineStyle(21, 0xfbf2d4);
      path.draw(g, 80);
      const samples = path.getPoints(65);
      for (let i = 0; i < samples.length; i += 3) {
        g.fillStyle(0xb7a578, 0.65);
        g.fillCircle(samples[i].x, samples[i].y, 2.2);
      }
      points.forEach(([x, y], index) => {
        const id = (world - 1) * 5 + index + 1;
        const available = id <= current;
        const done = Boolean(completed[id]);
        const active = id === current && !done;
        const circle = this.add.circle(x, y + 6, 28, 0x000000, 0.12);
        const node = this.add
          .circle(x, y, 28, done ? 0x237658 : available ? 0xffce62 : 0xf6f3e9)
          .setStrokeStyle(4, 0xffffff);
        this.add
          .text(x, y, done ? '✓' : String(id), {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            color: done ? '#ffffff' : available ? '#394d3d' : '#7a8279',
          })
          .setOrigin(0.5);
        if (available) {
          node.setInteractive({ useHandCursor: true }).on('pointerdown', () => onSelect(id));
          node
            .on('pointerover', () => node.setScale(1.08))
            .on('pointerout', () => node.setScale(1));
        }
        this.add
          .text(
            x,
            y + 45,
            done
              ? '★'.repeat(completed[id].stars)
              : index === 4
                ? 'MISSÃO ESPECIAL'
                : active
                  ? 'VOCÊ ESTÁ AQUI'
                  : available
                    ? 'EXPLORAR'
                    : 'BLOQUEADO',
            {
              fontFamily: 'Arial',
              fontSize: done ? '18px' : '10px',
              fontStyle: 'bold',
              color: done ? '#8b6014' : '#4d6253',
            },
          )
          .setOrigin(0.5);
        if (active) {
          const marker = this.add
            .text(x, y - 52, '◆', { fontSize: '24px', color: '#237658' })
            .setOrigin(0.5);
          if (!reducedMotion)
            this.tweens.add({
              targets: marker,
              y: y - 42,
              duration: 950,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            });
        }
        void circle;
      });
      for (const [x, y, size] of [
        [150, 45, 1],
        [560, 65, 0.7],
        [760, 25, 0.8],
      ]) {
        const cloud = this.add.graphics({ x, y });
        cloud.fillStyle(0xffffff, 0.8);
        cloud.fillEllipse(0, 10, 80 * size, 22 * size);
        cloud.fillCircle(-12 * size, 0, 18 * size);
        cloud.fillCircle(13 * size, 2, 14 * size);
        if (!reducedMotion)
          this.tweens.add({
            targets: cloud,
            x: x + 12,
            duration: 3500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
      }
    }
    tree(g, x, y, scale) {
      g.fillStyle(0x536b48, 0.15);
      g.fillEllipse(x, y + 17 * scale, 46 * scale, 12 * scale);
      g.fillStyle(0x8a7552);
      g.fillRoundedRect(x - 3 * scale, y - 8 * scale, 6 * scale, 28 * scale, 2);
      if (world >= 3) {
        g.fillStyle(palette[3]);
        g.fillTriangle(x - 24 * scale, y + 6, x, y - 53 * scale, x + 24 * scale, y + 6);
        g.fillStyle(palette[2]);
        g.fillTriangle(x - 19 * scale, y - 14, x, y - 60 * scale, x + 19 * scale, y - 14);
      } else {
        g.fillStyle(palette[3]);
        g.fillCircle(x, y - 15 * scale, 22 * scale);
        g.fillStyle(palette[2]);
        g.fillCircle(x - 8 * scale, y - 24 * scale, 20 * scale);
        g.fillCircle(x + 12 * scale, y - 17 * scale, 16 * scale);
      }
    }
    rock(g, x, y) {
      g.fillStyle(0x8e9a8b, 0.45);
      g.fillEllipse(x, y, 22, 12);
      g.fillStyle(0xe9eddc);
      g.fillEllipse(x - 3, y - 2, 14, 7);
    }
    house(g, x, y) {
      g.fillStyle(0xfbf2d4);
      g.fillRoundedRect(x - 30, y, 60, 45, 3);
      g.fillStyle(0xb47551);
      g.fillTriangle(x - 39, y, x, y - 35, x + 39, y);
      g.fillStyle(0x866c51);
      g.fillRect(x - 7, y + 20, 14, 25);
    }
    castle(g, x, y, grand) {
      g.fillStyle(grand ? 0xb29abb : 0xd5cbb0);
      g.fillRoundedRect(x - 40, y, 80, 75, 5);
      g.fillStyle(grand ? 0xc7b3cf : 0xe8dfc5);
      g.fillRect(x - 53, y - 15, 26, 90);
      g.fillRect(x + 27, y - 15, 26, 90);
      g.fillStyle(grand ? 0x80608d : 0x7b9b71);
      g.fillTriangle(x - 61, y - 15, x - 40, y - 48, x - 19, y - 15);
      g.fillTriangle(x + 19, y - 15, x + 40, y - 48, x + 61, y - 15);
      g.fillStyle(0x68765b);
      g.fillRoundedRect(x - 12, y + 37, 24, 38, { tl: 12, tr: 12, bl: 0, br: 0 });
      g.lineStyle(2, 0x8a7552);
      g.lineBetween(x, y, x, y - 47);
      g.fillStyle(0xe6b954);
      g.fillTriangle(x, y - 47, x + 25, y - 38, x, y - 29);
    }
  }
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: 1000,
    height: 430,
    transparent: true,
    scene: MapScene,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    audio: { noAudio: true },
    banner: false,
    fps: { target: 30, forceSetTimeOut: true },
  });
}
