(function () {
  const W = window.WORKS;
  const $ = (id) => document.getElementById(id);
  const p = new URLSearchParams(location.search);
  const uniq = (a) => [...new Set(a)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  uniq(W.map((w) => w.year)).sort().reverse().forEach((y) => $('yr').add(new Option(y, y)));
  uniq(W.flatMap((w) => w.tags)).filter(Boolean).forEach((t) => $('tag').add(new Option(t, t)));
  if (p.get('acc')) $('acc').value = p.get('acc');
  if (p.get('tag')) $('tag').value = p.get('tag');

  function draw() {
    const q = $('q').value.trim();
    const a = $('acc').value, y = $('yr').value, t = $('tag').value;
    const r = W.filter((w) => !w.hidden &&
      (!a || w.acc === a) && (!y || w.year === y) && (!t || w.tags.includes(t)) &&
      (!q || (w.title + w.ex).includes(q))
    );
    $('count').textContent = '共 ' + r.length + ' 篇';
    $('list').innerHTML = r.map((w) => {
      const href = w.local ? `a/${w.id}.html` : w.url;
      const tags = (w.tags || []).map((x) => `<span class="chip muted">${esc(x)}</span>`).join('');
      return `<a class="wcard" href="${href}">
        <div class="chips"><span class="chip">${esc(w.acc)}</span><span class="chip muted">${esc(w.year)}</span>${tags}</div>
        <h3>${esc(w.title)}</h3>
        <p class="ex">${esc(w.ex)}…</p>
        <div class="chips"><span class="chip muted">约${w.chars}字</span><span class="ext" onclick="event.preventDefault();event.stopPropagation();window.open('${w.url}','_blank')">公众号原文 ↗</span></div>
      </a>`;
    }).join('');
  }
  ['q', 'acc', 'yr', 'tag'].forEach((i) => $(i).addEventListener('input', draw));
  draw();
})();
