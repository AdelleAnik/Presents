export function sparkleBurst(x, y) {
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
  
      const angle = Math.random() * 2 * Math.PI;
      const radius = 100;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      sparkle.style.setProperty('--x', `${offsetX}px`);
      sparkle.style.setProperty('--y', `${offsetY}px`);
  
      document.body.appendChild(sparkle);
  
      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  }
  