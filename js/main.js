(() => {
  'use strict';
  const TOTAL = 8, VIDEO_ID = 'nNUiVCKu_9Y';
  const $ = (s, r = document) => r.querySelector(s);
  const chaps = [...document.querySelectorAll('.chap')];
  let cur = 1;

  function fromHash() {
    const m = /cap-(\d)/.exec(location.hash);
    const n = m ? parseInt(m[1], 10) : 1;
    return n >= 1 && n <= TOTAL ? n : 1;
  }
  function show(n, back = false, push = true) {
    n = Math.min(TOTAL, Math.max(1, n));
    chaps.forEach((c, i) => {
      const on = i + 1 === n;
      c.hidden = !on;
      c.classList.toggle('back', on && back);
    });
    cur = n;
    $('#progLabel').textContent = `CAPÍTULO ${n} DE ${TOTAL}`;
    $('#progFill').style.width = (n / TOTAL * 100) + '%';
    $('#btnPrev').disabled = n === 1;
    $('#btnNext').disabled = n === TOTAL;
    if (push) { try { history.replaceState(null, '', '#cap-' + n); } catch (e) { location.hash = 'cap-' + n; } }
    window.scrollTo(0, 0);
    document.title = `SARAHI ❤️ — ${chaps[n - 1].dataset.title}`;
  }
  const go = n => show(n, n < cur);

  $('#btnPrev').onclick = () => go(cur - 1);
  $('#btnNext').onclick = () => go(cur + 1);
  $('#btnHome').onclick = () => go(1);
  $('#btnRestart').onclick = () => go(1);
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));
  window.addEventListener('hashchange', () => show(fromHash(), fromHash() < cur, false));
  document.addEventListener('keydown', e => {
    if ($('#lightbox').open || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });

  // Lightbox
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  document.querySelectorAll('.zoom').forEach(b => b.addEventListener('click', () => {
    lbImg.src = b.dataset.zoom; lbImg.alt = b.dataset.alt || '';
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    $('#lbClose').focus();
  }));
  $('#lbClose').onclick = () => lb.close();
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  // Carrera
  const car = $('#racecar'), raceBtn = $('#btnRace');
  raceBtn.onclick = () => {
    raceBtn.disabled = true;
    car.classList.add('go');
    setTimeout(() => {
      $('#raceMsg').innerHTML = '🏁 ¡Meta! Ganó el número 95. Pero contigo, hasta perder una carrera sería divertido. ❤️';
      raceBtn.textContent = '↺ Otra vuelta'; raceBtn.disabled = false;
      raceBtn.onclick = () => { car.classList.remove('go'); raceBtn.textContent = '🏁 ¡Arrancar!'; raceBtn.onclick = null; };
      raceBtn.onclick = () => { car.classList.remove('go'); raceBtn.disabled = true; void car.offsetWidth; setTimeout(() => { car.classList.add('go'); setTimeout(() => raceBtn.disabled = false, 2700); }, 60); };
    }, 2700);
  };

  // Misión
  $('#btnMission').onclick = e => {
    $('#missionMsg').hidden = false;
    e.target.setAttribute('aria-expanded', 'true');
    $('#missionMsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Cupón (dos revelaciones)
  let step = 0;
  $('#btnClue').onclick = e => {
    if (step === 0) {
      $('#clue1').textContent = 'Alguien con traje rojo y azul está a punto de convertirse en tu nuevo compañero de aventuras… 🕷️';
      e.target.textContent = 'ABRIR MENSAJE FINAL'; step = 1;
    } else if (step === 1) {
      const f = $('#clue2'); f.hidden = false;
      f.textContent = 'Este regalo no se puede descargar ni recibir por internet… tienes que venir a buscarlo conmigo. ❤️';
      e.target.disabled = true; e.target.textContent = 'MISIÓN CUMPLIDA ✔'; step = 2;
    }
  };

  // Música
  const pl = $('#player'), btnM = $('#btnMusic'), plPlay = $('#plPlay'), plState = $('#plState');
  let yt = null, ready = false, playing = false, loading = false;
  btnM.onclick = () => { pl.hidden = !pl.hidden; btnM.setAttribute('aria-expanded', String(!pl.hidden)); };
  const fail = () => { loading = false; plState.textContent = 'La música no está disponible aquí. Puedes abrirla en YouTube con el botón de abajo. La página sigue funcionando.'; };
  function createPlayer() {
    try {
      yt = new YT.Player('yt', {
        videoId: VIDEO_ID, host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, controls: 0, rel: 0, loop: 1, playlist: VIDEO_ID },
        events: {
          onReady: () => { ready = true; loading = false; yt.setVolume(+$('#plVol').value); yt.playVideo(); },
          onStateChange: ev => {
            playing = ev.data === 1;
            plPlay.textContent = playing ? '⏸ Pausar' : '▶ Reproducir';
            plPlay.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
            if (ev.data === 1) plState.textContent = 'Sonando 🎶';
            if (ev.data === 2) plState.textContent = 'En pausa.';
          },
          onError: fail
        }
      });
    } catch (e) { fail(); }
  }
  plPlay.onclick = () => {
    if (ready) { playing ? yt.pauseVideo() : yt.playVideo(); return; }
    if (loading) return;
    loading = true; plState.textContent = 'Cargando música…';
    if (window.YT && YT.Player) return createPlayer();
    window.onYouTubeIframeAPIReady = createPlayer;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api'; s.onerror = fail;
    document.head.appendChild(s);
    setTimeout(() => { if (!ready && !yt) fail(); }, 8000);
  };
  $('#plVol').oninput = e => { if (ready) yt.setVolume(+e.target.value); };

  show(fromHash(), false, true);
})();
