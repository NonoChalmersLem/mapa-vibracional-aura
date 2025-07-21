// timeline.js - Control principal del Mapa Vibracional del Aura

// Cargar eventos desde el JSON
async function loadEvents() {
  const response = await fetch('assets/events.json');
  return await response.json();
}

// Inicializar PIXI y dibujar timeline
async function initTimeline() {
  const events = await loadEvents();

  const colors = {
    "Buffer": 0x00aaff,
    "Archivo del Umbral": 0x00ff88,
    "Cuaderno de la Siembra": 0xaa66ff,
    "Archivo Histórico": 0xffffff
  };

  const app = new PIXI.Application({
    view: document.getElementById('timelineCanvas'),
    resizeTo: window,
    backgroundColor: 0x000000
  });

  const container = new PIXI.Container();
  app.stage.addChild(container);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const margin = 100;
  const lineY = height / 2;
  const spacing = (width - margin * 2) / (events.length - 1);

  events.forEach((ev, i) => {
    const x = margin + i * spacing;
    const y = lineY + Math.sin(i) * 80; // efecto de flotación

    // Línea con efecto "glitch" tenue
    const line = new PIXI.Graphics();
    line.lineStyle(2, 0x5555ff, 0.3);
    line.moveTo(x, lineY);
    line.lineTo(x, y);
    container.addChild(line);

    // Nodo principal
    const node = new PIXI.Graphics();
    node.beginFill(colors[ev.categoria] || 0xffffff);
    node.drawCircle(0, 0, 10);
    node.endFill();
    node.x = x;
    node.y = y;
    node.interactive = true;
    node.buttonMode = true;
    node.on('pointerdown', () => showPopup(ev, x, y));
    container.addChild(node);

    // Aura animada
    const aura = new PIXI.Graphics();
    aura.beginFill(colors[ev.categoria] || 0xffffff, 0.2);
    aura.drawCircle(0, 0, 25);
    aura.endFill();
    aura.x = x;
    aura.y = y;
    container.addChild(aura);
    app.ticker.add(() => {
      const scale = 1 + Math.sin(Date.now() / 500 + i) * 0.05;
      aura.scale.set(scale);
    });
  });
}

// Mostrar popup de evento
function showPopup(event, x, y) {
  const popup = document.getElementById('eventPopup');
  popup.style.left = (x + 20) + 'px';
  popup.style.top = (y - 20) + 'px';
  document.getElementById('popupTitle').textContent = event.nombre;
  document.getElementById('popupSummary').textContent = event.resumen;
  document.getElementById('popupCategory').textContent = "Categoría: " + event.categoria;

  const linkBtn = document.getElementById('popupLink');
  if (event.enlace) {
    linkBtn.style.display = 'inline-block';
    linkBtn.onclick = () => window.open(event.enlace, '_blank');
  } else {
    linkBtn.style.display = 'none';
  }
  popup.style.display = 'block';
}

window.addEventListener('click', (e) => {
  const popup = document.getElementById('eventPopup');
  if (!popup.contains(e.target)) popup.style.display = 'none';
});

// Iniciar timeline al cargar
window.addEventListener('load', initTimeline);
