/* ISLANDS WASH — données partagées entre le site et l'espace de gestion.
   VERSION DÉMO : les réservations sont gardées dans ce navigateur (localStorage).
   En production, ces fonctions seront remplacées par des appels au serveur (Cloudflare Worker + base D1). */
(function () {
  var IW = {};

  /* ===== RÉGLAGES À COMPLÉTER ===== */
  IW.CONFIG = {
    phone: '',            // ex. '0690 12 34 56' (vide = caché)
    whatsapp: '',         // format international sans + ni espaces, ex. '590690123456' (vide = boutons cachés)
    email: 'contact@islandswash.fr',
    depositPct: 40,       // acompte en ligne, en %
    demo: true            // true = paiement simulé, données dans le navigateur
  };

  /* ===== PRESTATIONS (prix TTC, durée en minutes) ===== */
  IW.SERVICES = [
    { id: 'ext', name: 'Nettoyage extérieur', short: 'Extérieur', price: 50, dur: 45,
      desc: 'Carrosserie, jantes, vitres et bas de caisse, pour une finition impeccable.' },
    { id: 'int', name: 'Nettoyage intérieur', short: 'Intérieur', price: 55, dur: 90,
      desc: 'Aspiration complète, plastiques, sièges et tapis, vitres intérieures et shampouinage des textiles.' },
    { id: 'complet', name: 'Nettoyage complet', short: 'Complet', price: 100, dur: 150, star: true,
      desc: 'Intérieur et extérieur comme neufs, nettoyés en profondeur jusque dans les moindres recoins.' },
    { id: 'detailing', name: 'Detailing complet', short: 'Detailing', price: 130, dur: 240, soon: true,
      desc: 'Le soin le plus poussé : intérieur et extérieur remis à neuf, jusque dans les moindres détails.' }
  ];
  IW.PLANS = [
    { id: 'ab1', name: 'Abonnement Essentiel', n: 1, price: 90, dur: 150 },
    { id: 'ab2', name: 'Abonnement Confort', n: 2, price: 180, dur: 150 },
    { id: 'ab3', name: 'Abonnement Premium', n: 3, price: 260, dur: 150 }
  ];
  IW.VEHICLES = ['Citadine', 'Berline', 'SUV / 4x4', 'Break / monospace', 'Utilitaire', 'Autre'];

  /* ===== ZONES ET DÉPLACEMENT ===== */
  IW.FEES = { 1: 10, 2: 15 };
  IW.ZONES = {
    1: ['Les Abymes', 'Pointe-à-Pitre', 'Le Gosier', 'Morne-à-l’Eau', 'Baie-Mahault', 'Lamentin', 'Petit-Bourg', 'Goyave'],
    2: ['Sainte-Anne', 'Petit-Canal', 'Port-Louis', 'Anse-Bertrand', 'Le Moule', 'Saint-François', 'Sainte-Rose', 'Deshaies',
        'Pointe-Noire', 'Bouillante', 'Vieux-Habitants', 'Basse-Terre', 'Trois-Rivières', 'Capesterre-Belle-Eau']
  };
  IW.zoneOf = function (commune) { return IW.ZONES[1].indexOf(commune) >= 0 ? 1 : (IW.ZONES[2].indexOf(commune) >= 0 ? 2 : 0); };

  /* ===== HORAIRES (minutes depuis minuit) : 0 = dimanche, 5 = vendredi, 6 = samedi ===== */
  IW.DEFAULT_HOURS = { 5: [840, 1020], 6: [420, 840], 0: [420, 840] };
  IW.STEP = 30; IW.BUF = 30; // marge de déplacement entre deux interventions

  IW.PAY_METHODS = {
    card: 'Carte bancaire', apple_pay: 'Apple Pay', google_pay: 'Google Pay', paypal: 'PayPal',
    especes: 'Espèces', cb: 'CB sur place'
  };
  IW.STATUS = { nouvelle: 'Nouvelle', confirmee: 'Confirmée', terminee: 'Terminée', annulee: 'Annulée' };

  /* ===== OUTILS ===== */
  IW.offer = function (id) {
    var all = IW.SERVICES.concat(IW.PLANS);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  IW.pad = function (x) { return String(x).padStart(2, '0'); };
  IW.iso = function (d) { return d.getFullYear() + '-' + IW.pad(d.getMonth() + 1) + '-' + IW.pad(d.getDate()); };
  IW.fromIso = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  IW.hm = function (m) { return Math.floor(m / 60) + 'h' + IW.pad(m % 60); };
  IW.dur = function (m) { return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + IW.pad(m % 60) : ''); };
  IW.euro = function (n) { return (Math.round(n * 100) / 100).toLocaleString('fr-FR') + ' €'; };
  IW.dayLabel = function (iso, opts) {
    return IW.fromIso(iso).toLocaleDateString('fr-FR', opts || { weekday: 'long', day: 'numeric', month: 'long' });
  };
  IW.quote = function (offerId, commune) {
    var o = IW.offer(offerId), z = IW.zoneOf(commune), trav = IW.FEES[z] || 0, total = o.price + trav;
    var deposit = Math.round(total * IW.CONFIG.depositPct / 100);
    return { offer: o, zone: z, trav: trav, total: total, deposit: deposit, rest: total - deposit, sub: !!o.n };
  };

  /* ===== STOCKAGE (démo) ===== */
  var KEY = 'iw_bookings_v1', KEY_PRO = 'iw_pro_v1', KEY_SET = 'iw_settings_v1';
  function read(k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  IW.settings = function () { var s = read(KEY_SET, {}); s.hours = s.hours || IW.DEFAULT_HOURS; s.blocked = s.blocked || []; return s; };
  IW.saveSettings = function (s) { write(KEY_SET, s); };
  IW.bookings = function () { seed(); return read(KEY, []); };
  IW.saveBookings = function (list) { write(KEY, list); try { new BroadcastChannel('iw').postMessage('update'); } catch (e) {} };
  IW.addBooking = function (b) { var l = IW.bookings(); l.push(b); IW.saveBookings(l); return b; };
  IW.updateBooking = function (id, patch, note) {
    var l = IW.bookings();
    l.forEach(function (b) {
      if (b.id === id) {
        Object.keys(patch).forEach(function (k) { b[k] = patch[k]; });
        b.history = b.history || [];
        if (note) b.history.push({ at: new Date().toISOString(), note: note });
      }
    });
    IW.saveBookings(l);
  };
  IW.proRequests = function () { return read(KEY_PRO, []); };
  IW.addProRequest = function (r) { var l = IW.proRequests(); l.push(r); write(KEY_PRO, l); try { new BroadcastChannel('iw').postMessage('update'); } catch (e) {} };
  IW.newId = function () { return 'IW-' + Date.now().toString(36).toUpperCase().slice(-6); };

  /* ===== DISPONIBILITÉS ===== */
  IW.busy = function (iso, exceptId) {
    var out = [];
    IW.bookings().forEach(function (b) {
      if (b.date === iso && b.status !== 'annulee' && b.id !== exceptId) out.push([b.start, b.end]);
    });
    IW.settings().blocked.forEach(function (x) { if (x.date === iso) out.push([x.start, x.end]); });
    return out;
  };
  IW.slots = function (date, durMin, exceptId) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    if (date <= today) return [];
    var w = IW.settings().hours[date.getDay()]; if (!w) return [];
    var bk = IW.busy(IW.iso(date), exceptId), res = [];
    for (var t = w[0]; t + durMin <= w[1]; t += IW.STEP) {
      if (!bk.some(function (b) { return t < b[1] + IW.BUF && t + durMin + IW.BUF > b[0]; })) res.push(t);
    }
    return res;
  };
  IW.nextFree = function (durMin) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    for (var i = 1; i < 60; i++) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i), s = IW.slots(x, durMin);
      if (s.length) return { date: x, start: s[0] };
    }
    return null;
  };

  /* ===== FICHIER AGENDA (.ics) : ajout dans le Calendrier Apple ou Google ===== */
  IW.ics = function (b, forOwner) {
    var d = IW.fromIso(b.date), st = new Date(d.getTime() + b.start * 60000), en = new Date(d.getTime() + b.end * 60000);
    var f = function (x) { return x.getFullYear() + IW.pad(x.getMonth() + 1) + IW.pad(x.getDate()) + 'T' + IW.pad(x.getHours()) + IW.pad(x.getMinutes()) + '00'; };
    var title = forOwner ? (b.service + ' – ' + b.name) : ('ISLANDS WASH – ' + b.service);
    var desc = forOwner
      ? ('Client : ' + b.name + ' ' + b.tel + '\\nVéhicule : ' + (b.vehicleType || '') + ' ' + (b.vehicle || '') + '\\nAcompte : ' + b.deposit + ' € · Reste : ' + b.rest + ' €')
      : ('Réservation ' + b.id + '\\nReste à régler sur place : ' + b.rest + ' € (espèces ou CB)');
    var txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ISLANDS WASH//FR', 'BEGIN:VEVENT',
      'UID:' + b.id + '@islandswash', 'DTSTAMP:' + f(new Date()), 'DTSTART;TZID=America/Guadeloupe:' + f(st),
      'DTEND;TZID=America/Guadeloupe:' + f(en), 'SUMMARY:' + title, 'LOCATION:' + (b.address || '') + ' (' + b.commune + ')',
      'DESCRIPTION:' + desc, 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Rappel', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar' }));
    a.download = b.id + '.ics'; document.body.appendChild(a); a.click(); a.remove();
  };

  /* ===== DONNÉES DE DÉMONSTRATION (clients fictifs) ===== */
  function seed() {
    if (read(KEY, null)) return;
    var t = new Date(); t.setHours(0, 0, 0, 0);
    function nextDay(dow, plusWeeks) { var d = new Date(t); d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7 || 7) + 7 * (plusWeeks || 0)); return IW.iso(d); }
    function mk(o) {
      var q = IW.quote(o.offer, o.commune);
      return { id: o.id, createdAt: new Date(t.getTime() - 86400000).toISOString(), offerId: o.offer, service: q.offer.name,
        price: q.offer.price, sub: q.sub, vehicleType: o.vt, vehicle: o.v, commune: o.commune, zone: q.zone, trav: q.trav,
        total: q.total, deposit: q.deposit, rest: q.rest, date: o.date, start: o.start, end: o.start + q.offer.dur,
        name: o.name, tel: o.tel, address: o.addr, notes: o.notes || '', client: 'particulier', status: o.status,
        depositPaid: true, depositMethod: o.pm, restPaid: !!o.rm, restMethod: o.rm || null, demo: true,
        history: [{ at: new Date(t.getTime() - 86400000).toISOString(), note: 'Réservation en ligne, acompte payé (' + IW.PAY_METHODS[o.pm] + ')' }] };
    }
    write(KEY, [
      mk({ id: 'IW-DEMO1', offer: 'complet', commune: 'Baie-Mahault', vt: 'SUV / 4x4', v: 'Toyota RAV4', date: nextDay(6), start: 450, name: 'Client démo 1', tel: '0690 00 00 01', addr: 'Rue de démonstration', pm: 'apple_pay', status: 'confirmee' }),
      mk({ id: 'IW-DEMO2', offer: 'ext', commune: 'Le Gosier', vt: 'Citadine', v: 'Peugeot 208', date: nextDay(6), start: 720, name: 'Client démo 2', tel: '0690 00 00 02', addr: 'Résidence démo', pm: 'paypal', status: 'nouvelle', notes: 'Portail bleu' }),
      mk({ id: 'IW-DEMO3', offer: 'detailing', commune: 'Sainte-Anne', vt: 'Berline', v: 'BMW Série 3', date: nextDay(0), start: 480, name: 'Client démo 3', tel: '0690 00 00 03', addr: 'Lotissement démo', pm: 'card', status: 'confirmee' }),
      mk({ id: 'IW-DEMO4', offer: 'ab1', commune: 'Les Abymes', vt: 'Break / monospace', v: 'Dacia Jogger', date: nextDay(5), start: 840, name: 'Client démo 4', tel: '0690 00 00 04', addr: 'Quartier démo', pm: 'google_pay', status: 'confirmee' })
    ]);
  }
  IW.resetDemo = function () { try { localStorage.removeItem(KEY); localStorage.removeItem(KEY_PRO); } catch (e) {} seed(); };

  window.IW = IW;
})();
