/* ============================================================
   Sistema de anotación de placas — canvas transparente superpuesto
   a la imagen base del esquema de carótidas y arterias vertebrales.
   Adaptado del prototipo original (carotid-painter.html):
   color fijo, trazo libre, devicePixelRatio + ResizeObserver.
   ============================================================ */

function initPlaquePainter() {
  const brushColor = "rgba(192, 57, 43, 0.55)";
  let brushSize = 8;
  let painting = false;
  let hasDrawn = false;
  let lastX = 0, lastY = 0;

  const wrapper = document.getElementById("diagram-wrap");
  const canvas = document.getElementById("paint-canvas");
  const baseImg = document.getElementById("base-img");
  const ctx = canvas.getContext("2d");

  baseImg.src = DIAGRAM_IMAGE_SRC;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = wrapper.getBoundingClientRect();
    const snap = canvas.toDataURL();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
    img.src = snap;
  }

  function coords(e) {
    const r = wrapper.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [src.clientX - r.left, src.clientY - r.top];
  }

  function onStart(e) {
    e.preventDefault();
    painting = true;
    hasDrawn = true;
    [lastX, lastY] = coords(e);
    ctx.beginPath();
    ctx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.fill();
    document.dispatchEvent(new CustomEvent("tsa:diagram-changed"));
  }

  function onMove(e) {
    if (!painting) return;
    e.preventDefault();
    const [x, y] = coords(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }

  function onStop() { painting = false; }

  wrapper.addEventListener("mousedown", onStart);
  wrapper.addEventListener("mousemove", onMove);
  wrapper.addEventListener("mouseup", onStop);
  wrapper.addEventListener("mouseleave", onStop);
  wrapper.addEventListener("touchstart", onStart, { passive: false });
  wrapper.addEventListener("touchmove", onMove, { passive: false });
  wrapper.addEventListener("touchend", onStop);

  const slider = document.getElementById("brush-size");
  const dot = document.getElementById("size-dot");

  function updateDot() {
    const sz = parseInt(slider.value, 10);
    const vis = Math.max(4, Math.min(sz, 28));
    dot.style.width = vis + "px";
    dot.style.height = vis + "px";
  }

  slider.addEventListener("input", () => {
    brushSize = parseInt(slider.value, 10);
    updateDot();
  });
  updateDot();

  document.getElementById("btn-clear-diagram").addEventListener("click", () => {
    const r = wrapper.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    hasDrawn = false;
    document.dispatchEvent(new CustomEvent("tsa:diagram-changed"));
  });

  document.getElementById("btn-copy-diagram").addEventListener("click", async () => {
    const btn = document.getElementById("btn-copy-diagram");
    const original = btn.textContent;
    const r = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const merged = document.createElement("canvas");
    merged.width = Math.round(r.width * dpr);
    merged.height = Math.round(r.height * dpr);
    const mctx = merged.getContext("2d");
    mctx.drawImage(baseImg, 0, 0, merged.width, merged.height);
    mctx.drawImage(canvas, 0, 0, merged.width, merged.height);

    try {
      const blob = await new Promise(resolve => merged.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("No se pudo generar la imagen.");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      btn.textContent = "Copiado ✓";
      btn.classList.add("copied");
    } catch (err) {
      btn.textContent = "No disponible en este navegador";
    }
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1800);
  });

  new ResizeObserver(resizeCanvas).observe(wrapper);
  resizeCanvas();

  return {
    hasContent: () => hasDrawn
  };
}
