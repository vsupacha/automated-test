// Shared runtime for the document tools in documents/*.html.
// Each page supplies the same element ids (see id_card.html) and calls
// DocKit.createTool({...}) with its own crop ratio and page composition.
window.DocKit = (() => {
  'use strict';

  // ---------- constants ----------
  const COURSE = 'การพัฒนาระบบทดสอบแบบอัตโนมัติสำหรับแผงวงจรควบคุมด้วย LabVIEW, TestStand และ myRIO';
  const COURSE_CODE = 'B0C690121';
  const VENUE = 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต';
  // keep in sync with FALLBACK_DATES in ../index.html
  const ROUNDS = {
    '01': '14 – 17 กรกฎาคม 2569',
    '02': '21 – 24 กรกฎาคม 2569',
    '03': '4 – 7 สิงหาคม 2569',
    '04': '18 – 21 สิงหาคม 2569',
    '05': '27 – 30 สิงหาคม 2569',
    '06': '5 – 6 และ 12 – 13 กันยายน 2569',
    '07': '22 – 25 กันยายน 2569'
  };
  const BLANK = '..............................';
  const WATERMARK = 'ใช้สำหรับ BOI / สอวช เท่านั้น';
  const FONT = '"Sarabun", Tahoma, sans-serif';
  const PAGE_W_MM = 210, PAGE_H_MM = 297;
  const DPI = 300;
  const PX_PER_MM = DPI / 25.4;
  const pt = v => v * DPI / 72;
  const mm = v => v * PX_PER_MM;
  const SHARP_LOW = 40, SHARP_OK = 90;   // Laplacian variance heuristics

  const $ = id => document.getElementById(id);

  function showMsg(el, kind, html) {
    el.className = 'notice ' + kind;
    el.innerHTML = html;
  }
  function hideMsg(el) { el.className = 'notice hidden'; }

  const fontsReady = Promise.all([
    document.fonts.load(`300 40px "Sarabun"`),
    document.fonts.load(`400 40px "Sarabun"`),
    document.fonts.load(`600 40px "Sarabun"`)
  ]).catch(() => {});

  // ---------- participant info ----------
  function readInfo() {
    const first = $('firstName').value.trim(), last = $('lastName').value.trim();
    const round = $('roundSelect').value;
    const date = $('signDate').value ? new Date($('signDate').value + 'T00:00:00') : new Date();
    return {
      first, last, round,
      roundNo: round ? String(parseInt(round, 10)) : '....',
      fullName: first || last ? `${$('prefixSelect').value}${first} ${last}`.trim() : '',
      roundDates: ROUNDS[round] || '',
      signDate: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      complete: Boolean(first && last && round)
    };
  }

  function initParticipantForm(onChange) {
    const roundSelect = $('roundSelect'), signDate = $('signDate');
    Object.entries(ROUNDS).forEach(([id, dates]) => {
      const o = document.createElement('option');
      o.value = id;
      o.textContent = `รุ่นที่ ${parseInt(id, 10)} : ${dates}`;
      roundSelect.appendChild(o);
    });
    const presetRound = new URLSearchParams(location.search).get('round');
    if (ROUNDS[presetRound]) roundSelect.value = presetRound;
    const today = new Date();
    signDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    ['prefixSelect', 'firstName', 'lastName', 'roundSelect', 'signDate']
      .forEach(id => $(id).addEventListener('input', onChange));
  }

  // ---------- quality check ----------
  function sharpness(src) {
    const W = 640, H = Math.max(3, Math.round(W * src.height / src.width));
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(src, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const g = new Float32Array(W * H);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) g[j] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let sum = 0, sum2 = 0, n = 0;
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const k = y * W + x;
        const lap = g[k - W] + g[k + W] + g[k - 1] + g[k + 1] - 4 * g[k];
        sum += lap; sum2 += lap * lap; n++;
      }
    }
    const mean = sum / n;
    return sum2 / n - mean * mean;
  }

  // ---------- page drawing ----------
  // Thai has no spaces between words, so break on word segments when Intl.Segmenter is available
  const segmenter = window.Intl?.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;

  function wrapLines(ctx, text, maxW, firstMaxW = maxW) {
    const tokens = segmenter
      ? Array.from(segmenter.segment(text), s => s.segment)
      : text.split(/(\s+)/);
    // keep opening brackets and quotes on the same line as the word they open
    for (let i = tokens.length - 2; i >= 0; i--) {
      if (/^[(\[“"']$/.test(tokens[i])) tokens.splice(i, 2, tokens[i] + tokens[i + 1]);
    }
    const lines = [];
    let line = '';
    for (const t of tokens) {
      const test = line + t;
      const limit = lines.length ? maxW : firstMaxW;
      if (ctx.measureText(test).width > limit && line.trim()) {
        lines.push(line.trimEnd());
        line = t.trimStart();
      } else {
        line = test;
      }
    }
    if (line.trim()) lines.push(line.trimEnd());
    return lines;
  }

  function newPage() {
    const W = Math.round(mm(PAGE_W_MM)), H = Math.round(mm(PAGE_H_MM));
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1a1a1a';
    ctx.textBaseline = 'top';
    ctx.imageSmoothingQuality = 'high';
    return { canvas, ctx, W, H };
  }

  function drawImageFramed(ctx, img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = mm(0.2);
    ctx.strokeRect(x, y, w, h);
  }

  // "สำเนาถูกต้อง" + signature line + name + date, centred on cx; returns its height
  function signatureBlock(ctx, info, sizePt, signGap) {
    const lineH = pt(sizePt) * 1.45;
    return {
      height: lineH + signGap + 3 * lineH,
      draw(cx, y) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = `600 ${pt(sizePt)}px ${FONT}`;
        ctx.fillText('สำเนาถูกต้อง', cx, y);
        y += lineH + signGap;
        ctx.font = `400 ${pt(sizePt)}px ${FONT}`;
        ctx.fillText(`ลงชื่อ ${BLANK}${BLANK.slice(0, 10)}`, cx, y);
        ctx.fillText(`( ${info.fullName || BLANK} )`, cx, y + lineH);
        ctx.fillText(`วันที่ ${info.signDate}`, cx, y + 2 * lineH);
        ctx.restore();
      }
    };
  }

  function drawWatermark(ctx, W, H) {
    ctx.save();
    ctx.font = `300 ${pt(18)}px ${FONT}`;
    ctx.fillStyle = 'rgba(70, 70, 70, 0.16)';
    ctx.textBaseline = 'middle';
    const tw = ctx.measureText(WATERMARK).width;
    const stepX = tw + mm(20);
    const stepY = mm(30);
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-30 * Math.PI / 180);
    const R = Math.hypot(W, H) / 2 + stepX;
    let row = 0;
    for (let y = -R; y <= R; y += stepY, row++) {
      const offset = (row % 2) * stepX / 2;
      for (let x = -R - offset; x <= R; x += stepX) ctx.fillText(WATERMARK, x, y);
    }
    ctx.restore();
  }

  function rotate90(src) {
    const c = document.createElement('canvas');
    c.width = src.height; c.height = src.width;
    const ctx = c.getContext('2d');
    ctx.translate(c.width, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(src, 0, 0);
    return c;
  }

  // ---------- tool ----------
  // cfg.ratio       width / height of the document, used for the camera guide (and upload crop)
  // cfg.cropUpload  centre-crop uploaded images to cfg.ratio (ID card) or keep them whole (documents)
  // cfg.prepare     optional (canvas) => canvas applied to every new source image
  // cfg.compose     (source, info) => { canvas, note? } builds the A4 page; watermark is added afterwards
  // cfg.docNoun     what is being photographed, used in messages
  // cfg.sharpHint   what to double-check when the image is only fair
  // cfg.pdfTitle    (info) => PDF document title
  // cfg.fileTag     file name prefix
  function createTool(cfg) {
    const video = $('video'), stage = $('stage');
    const cameraSelect = $('cameraSelect'), mirrorChk = $('mirrorChk'), timerChk = $('timerChk');
    const captureBtn = $('captureBtn'), fileInput = $('fileInput');
    const camMsg = $('camMsg'), countdownEl = $('countdown'), flash = $('flash');
    const cameraView = $('cameraView'), reviewView = $('reviewView');
    const srcImg = $('srcImg'), pageImg = $('pageImg'), pageNote = $('pageNote'), sharpMsg = $('sharpMsg');
    const retakeBtn = $('retakeBtn'), pdfBtn = $('pdfBtn'), formMsg = $('formMsg');

    let stream = null;
    let source = null;         // captured / uploaded document image
    let pageCanvas = null;     // composed A4 page
    let guideFrac = 0.72;      // guide width as fraction of video width
    let busy = false;

    stage.style.setProperty('--guide-ratio', cfg.ratio);

    // camera
    async function startCamera(deviceId) {
      stopCamera();
      captureBtn.disabled = true;
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        showMsg(camMsg, 'err', 'เบราว์เซอร์ไม่อนุญาตให้ใช้กล้อง ต้องเปิดหน้านี้ผ่าน <strong>https://</strong> หรือ <strong>localhost</strong> เท่านั้น — หรือกด “อัปโหลดรูปแทน”');
        return;
      }
      const constraints = {
        audio: false,
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      };
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        const msg = {
          NotAllowedError: 'ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์แล้วโหลดหน้าใหม่',
          NotFoundError: 'ไม่พบกล้องในเครื่องนี้ — กด “อัปโหลดรูปแทน” เพื่อใช้ไฟล์ภาพ',
          NotReadableError: 'กล้องกำลังถูกใช้งานโดยโปรแกรมอื่น กรุณาปิดโปรแกรมนั้นแล้วลองใหม่',
          OverconstrainedError: 'กล้องที่เลือกไม่รองรับ ลองเลือกกล้องอื่น'
        }[e.name] || ('เปิดกล้องไม่สำเร็จ: ' + e.message);
        showMsg(camMsg, 'err', msg);
        return;
      }
      hideMsg(camMsg);
      video.srcObject = stream;
      await new Promise(r => video.readyState >= 1 ? r() : video.addEventListener('loadedmetadata', r, { once: true }));
      layoutStage();
      captureBtn.disabled = false;
      await listCameras(stream.getVideoTracks()[0]?.getSettings().deviceId);

      // preview is un-mirrored by default so the document text reads correctly
      if (stream.getVideoTracks()[0]?.getSettings().facingMode === 'environment') mirrorChk.checked = false;
      applyMirror();

      const { videoWidth: w, videoHeight: h } = video;
      if (Math.max(w, h) < 1280) {
        showMsg(camMsg, 'warn', `กล้องนี้ให้ความละเอียดเพียง ${w}×${h} — ภาพ${cfg.docNoun}อาจไม่คมชัด แนะนำกล้องความละเอียด 1080p หรือใช้มือถือ`);
      }
    }

    function stopCamera() {
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null;
    }

    async function listCameras(activeId) {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
      cameraSelect.innerHTML = '';
      devices.forEach((d, i) => {
        const o = document.createElement('option');
        o.value = d.deviceId;
        o.textContent = d.label || `กล้อง ${i + 1}`;
        if (d.deviceId === activeId) o.selected = true;
        cameraSelect.appendChild(o);
      });
    }

    function layoutStage() {
      const w = video.videoWidth, h = video.videoHeight;
      if (!w || !h) return;
      const ar = w / h;
      stage.style.aspectRatio = `${w} / ${h}`;
      stage.style.maxWidth = `calc((100vh - 300px) * ${ar})`;
      stage.style.minWidth = 'min(100%, 320px)';
      // portrait (phone) streams: make the guide wider
      guideFrac = ar < 1 ? 0.9 : 0.72;
      // never let the guide exceed the frame height
      guideFrac = Math.min(guideFrac, 0.92 * cfg.ratio / ar);
      stage.style.setProperty('--guide-w', (guideFrac * 100) + '%');
    }

    function applyMirror() { stage.classList.toggle('mirror', mirrorChk.checked); }

    // capture
    async function capture() {
      if (busy || !stream || captureBtn.disabled) return;
      busy = true;
      try {
        if (timerChk.checked) {
          countdownEl.classList.remove('hidden');
          for (let n = 3; n > 0; n--) {
            countdownEl.textContent = n;
            await new Promise(r => setTimeout(r, 1000));
          }
          countdownEl.classList.add('hidden');
        }
        const vw = video.videoWidth, vh = video.videoHeight;
        const sw = Math.round(vw * guideFrac);
        const sh = Math.round(sw / cfg.ratio);
        const sx = Math.round((vw - sw) / 2), sy = Math.round((vh - sh) / 2);
        const c = document.createElement('canvas');
        c.width = sw; c.height = sh;
        // drawn un-mirrored so the document text reads correctly
        c.getContext('2d').drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

        flash.classList.add('on');
        requestAnimationFrame(() => requestAnimationFrame(() => flash.classList.remove('on')));

        await showReview(c);
      } finally {
        busy = false;
      }
    }

    function loadFromFile(file) {
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        let sw = img.naturalWidth, sh = img.naturalHeight;
        if (cfg.cropUpload) {
          // centre-crop to the document aspect ratio
          if (sw / sh > cfg.ratio) sw = Math.round(sh * cfg.ratio);
          else sh = Math.round(sw / cfg.ratio);
        }
        const sx = Math.round((img.naturalWidth - sw) / 2), sy = Math.round((img.naturalHeight - sh) / 2);
        const c = document.createElement('canvas');
        c.width = sw; c.height = sh;
        c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        URL.revokeObjectURL(url);
        await showReview(c);
      };
      img.onerror = () => { URL.revokeObjectURL(url); showMsg(camMsg, 'err', 'เปิดไฟล์ภาพไม่ได้'); };
      img.src = url;
    }

    // review
    function updateFormState() {
      const info = readInfo();
      pdfBtn.disabled = !window.jspdf || !info.complete;
      if (info.complete) hideMsg(formMsg);
      else showMsg(formMsg, 'warn', 'กรอก ชื่อ นามสกุล และรุ่นที่เข้าอบรม ในส่วน “ข้อมูลผู้เข้าอบรม” ก่อนดาวน์โหลด PDF');
      return info;
    }

    function render() {
      const info = updateFormState();
      if (!source) return;
      const out = cfg.compose(source, info);
      // watermark goes last so it also covers the document image
      drawWatermark(out.canvas.getContext('2d'), out.canvas.width, out.canvas.height);
      pageCanvas = out.canvas;
      pageImg.src = pageCanvas.toDataURL('image/jpeg', 0.8);
      if (pageNote) pageNote.textContent = out.note || '';
    }

    function setSource(c) {
      source = c;
      srcImg.src = source.toDataURL('image/jpeg', 0.9);
      render();
    }

    async function showReview(c) {
      await fontsReady;
      const s = sharpness(c);
      if (s < SHARP_LOW) showMsg(sharpMsg, 'warn', `ภาพดูเบลอ ตัวอักษรอาจอ่านไม่ชัด — แนะนำให้ถ่ายใหม่ โดยถือ${cfg.docNoun}ให้นิ่งและห่างกล้องขึ้นเล็กน้อย`);
      else if (s < SHARP_OK) showMsg(sharpMsg, 'warn', `ความคมชัดพอใช้ — ${cfg.sharpHint}`);
      else showMsg(sharpMsg, 'ok', 'ภาพคมชัดดี');
      sharpMsg.title = 'sharpness ' + s.toFixed(1);

      setSource(cfg.prepare ? cfg.prepare(c) : c);
      stopCamera();
      cameraView.classList.add('hidden');
      reviewView.classList.remove('hidden');
    }

    function retake() {
      reviewView.classList.add('hidden');
      cameraView.classList.remove('hidden');
      source = pageCanvas = null;
      fileInput.value = '';
      startCamera(cameraSelect.value || undefined);
    }

    function downloadPdf() {
      const info = updateFormState();
      if (!pageCanvas || !info.complete) return;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      doc.setProperties({ title: cfg.pdfTitle(info), subject: WATERMARK });
      doc.addImage(pageCanvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, PAGE_W_MM, PAGE_H_MM);
      const d = new Date();
      const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      const safe = v => v.replace(/[\\/:*?"<>|\s]+/g, '_');
      doc.save(`${cfg.fileTag}_${COURSE_CODE}_R${info.round}_${safe(info.first)}_${safe(info.last)}_${stamp}.pdf`);
    }

    // wiring
    let renderTimer = null;
    const scheduleRender = () => {
      updateFormState();
      clearTimeout(renderTimer);
      renderTimer = setTimeout(render, 250);
    };
    initParticipantForm(scheduleRender);
    // any option control inside the review panel (size, rotation, ...) re-renders the page
    reviewView.addEventListener('change', e => { if (e.target.matches('select, input')) render(); });

    captureBtn.addEventListener('click', capture);
    mirrorChk.addEventListener('change', applyMirror);
    cameraSelect.addEventListener('change', () => cameraSelect.value && startCamera(cameraSelect.value));
    fileInput.addEventListener('change', e => loadFromFile(e.target.files[0]));
    retakeBtn.addEventListener('click', retake);
    pdfBtn.addEventListener('click', downloadPdf);
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && !cameraView.classList.contains('hidden') && !['SELECT', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        capture();
      }
    });

    if (!window.jspdf) pdfBtn.title = 'โหลดไลบรารี PDF ไม่สำเร็จ (ต้องเชื่อมต่ออินเทอร์เน็ต)';
    updateFormState();
    startCamera();

    return {
      render,
      get source() { return source; },
      setSource
    };
  }

  return {
    COURSE, COURSE_CODE, VENUE, BLANK, FONT, PAGE_W_MM, PAGE_H_MM,
    pt, mm, wrapLines, newPage, drawImageFramed, signatureBlock, rotate90, createTool
  };
})();
