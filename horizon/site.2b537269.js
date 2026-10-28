/* Démo Soralva : copie de démonstration, aucune donnée envoyée. */
(function () {
var s = document.currentScript, base = s ? s.src.replace(/[^\/]*$/, '') : '/';
var f = window.fetch;
window.fetch = function (u, o) {
if (typeof u === 'string') {
if (u === '/config-site.json' || u === '/disponibilites.json') { u = base + u.slice(1); }
else if (u.indexOf('/api/demande') === 0) { return Promise.resolve(new Response('{"actif": false}', { status: 200, headers: { 'content-type': 'application/json' } })); }
else if (u.indexOf('/api/') === 0) { return Promise.resolve(new Response('', { status: 404 })); }
}
return f.apply(this, arguments);
};
})();
'use strict';
(function () {
try {
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var aReveler = [].slice.call(document.querySelectorAll('.reveal'));
var io = null;
var marquerPremierEcran = function (reprise) {
var hauteur = window.innerHeight;
var rects = aReveler.map(function (el) { return el.getBoundingClientRect(); });
aReveler.forEach(function (el, i) {
var r = rects[i];
if (reprise === true && !r.width && !r.height) return;
if (!el.classList.contains('vu') && r.top < hauteur) {
el.classList.add('vu');
if (io) io.unobserve(el);
}
});
};
marquerPremierEcran();
document.documentElement.classList.add('js-motion');
var reste = aReveler.filter(function (el) { return !el.classList.contains('vu'); });
if (!('IntersectionObserver' in window)) { reste.forEach(function (el) { el.classList.add('vu'); }); return; }
io = new IntersectionObserver(function (entrees) {
entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
reste.forEach(function (el) { io.observe(el); });
var reprendre = function () { marquerPremierEcran(true); };
if (document.readyState === 'complete') { reprendre(); } else { window.addEventListener('load', reprendre); }
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(reprendre); }
} catch (e) { console.error('geste.js', e); }
})();
(function () {
try {
var corps = document.body.classList;
if (!corps.contains('gabarit-accueil') && !corps.contains('gabarit-logement')) return;
var racine = document.documentElement;
function pretes() { racine.classList.add('sections-pretes'); }
document.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href^="#"]');
if (a || corps.contains('gabarit-logement')) pretes();
}, true);
if (corps.contains('gabarit-logement')) document.addEventListener('keydown', pretes, true);
if (location.hash.length > 1) {
pretes();
var cible = document.getElementById(decodeURIComponent(location.hash.slice(1)));
if (cible) cible.scrollIntoView();
}
if (document.readyState === 'complete') pretes();
else window.addEventListener('load', pretes);
} catch (e) { console.error('sections.js', e); }
})();
(function () {
try {
var entete = document.querySelector('.entete');
if (!entete) return;
var collee = null;
var majEntete = function () {
var doit = window.scrollY > 40;
if (doit === collee) return;
collee = doit;
entete.classList.toggle('collee', collee);
};
window.addEventListener('scroll', majEntete, { passive: true });
requestAnimationFrame(function () {
entete.classList.add('sans-transition');
majEntete();
requestAnimationFrame(function () { entete.classList.remove('sans-transition'); });
});
var langues = entete.querySelector('.entete__langues');
if (langues) {
var fermer = function () { langues.open = false; };
document.addEventListener('pointerdown', function (e) { if (langues.open && !langues.contains(e.target)) fermer(); });
document.addEventListener('keydown', function (e) {
if (e.key !== 'Escape' || !langues.open) return;
var dedans = langues.contains(document.activeElement);
fermer();
if (dedans) langues.querySelector('summary').focus();
});
langues.addEventListener('focusout', function (e) {
if (langues.open && e.relatedTarget && !langues.contains(e.relatedTarget)) fermer();
});
}
var bouton = entete.querySelector('.bouton');
if (!bouton || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var minuterie = setInterval(function () {
if (document.hidden || entete.matches(':hover') || bouton.matches(':focus-visible') || !entete.offsetWidth) return;
bouton.classList.remove('onde'); void bouton.offsetWidth; bouton.classList.add('onde');
}, 5000);
bouton.addEventListener('animationend', function (e) { if (e.target === bouton) bouton.classList.remove('onde'); });
document.querySelectorAll('a[href$="#reserver"]').forEach(function (a) {
a.addEventListener('click', function () { clearInterval(minuterie); bouton.classList.remove('onde'); });
});
} catch (e) { console.error('entete.js', e); }
})();
(function () {
try {
var panneaux = { menu: document.getElementById('feuille-menu'), ecrire: document.getElementById('feuille-ecrire') };
var ouvrir = function (nom) {
var d = panneaux[nom];
if (d && typeof d.showModal === 'function' && !d.open) { d.showModal(); return true; }
return false;
};
document.querySelectorAll('.menu-replie').forEach(function (b) { b.addEventListener('click', function () { ouvrir('menu'); }); });
document.querySelectorAll('.barre a[data-panneau="menu"]').forEach(function (a) {
if (panneaux.menu && typeof panneaux.menu.showModal === 'function') { a.setAttribute('role', 'button'); a.setAttribute('aria-haspopup', 'dialog'); }
a.addEventListener('click', function (ev) { if (ouvrir('menu')) ev.preventDefault(); });
a.addEventListener('keydown', function (ev) { if (ev.key === ' ' && ouvrir('menu')) ev.preventDefault(); });
});
document.querySelectorAll('.barre a[href$="#contact"]').forEach(function (a) {
a.addEventListener('click', function (ev) { if (ouvrir('ecrire')) ev.preventDefault(); });
});
Object.keys(panneaux).forEach(function (nom) {
var d = panneaux[nom];
if (!d) return;
d.querySelectorAll('[data-fermer]').forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
d.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { d.close(); }); });
d.addEventListener('click', function (ev) {
var r = d.getBoundingClientRect();
if (ev.clientY < r.top || ev.clientX < r.left || ev.clientX > r.right) { d.close(); }
});
});
var copier = document.querySelector('[data-copier]');
if (copier) {
var libelle = copier.textContent;
copier.addEventListener('click', function () {
var adresse = copier.parentNode.querySelector('span').textContent;
if (navigator.clipboard) { navigator.clipboard.writeText(adresse); }
copier.textContent = document.documentElement.lang === 'es' ? 'Copiado' : document.documentElement.lang === 'en' ? 'Copied' : 'Copié';
setTimeout(function () { copier.textContent = libelle; }, 2000);
});
}
var barre = document.querySelector('.barre'), formulaires = document.querySelectorAll('main form');
if (barre && formulaires.length && 'IntersectionObserver' in window) {
var vus = new Set();
var observateur = new IntersectionObserver(function (entrees) {
entrees.forEach(function (e) { if (e.isIntersecting) vus.add(e.target); else vus.delete(e.target); });
barre.classList.toggle('barre--cachee', vus.size > 0);
});
formulaires.forEach(function (f) { observateur.observe(f); });
}
} catch (e) { console.error('panneaux.js', e); }
})();
(function () {
try {
var hauts = document.getElementById('bandeaux');
if (hauts && hauts.querySelector('.bandeau')) {
var caler = function () { document.documentElement.style.setProperty('--haut-bandeaux', hauts.offsetHeight + 'px'); };
hauts.removeAttribute('data-attente');
caler();
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(caler); }
if ('ResizeObserver' in window) { new ResizeObserver(caler).observe(hauts); }
}
var cookies = document.getElementById('consentement');
if (!cookies) return;
var identifiant = cookies.getAttribute('data-mesure'), CLE = 'consentement-mesure', SIX_MOIS = 182 * 864e5;
var lire = function () {
try {
var r = JSON.parse(localStorage.getItem(CLE));
if (r && Date.now() - r.date < SIX_MOIS) return r.choix;
localStorage.removeItem(CLE);
} catch (e) { try { localStorage.removeItem(CLE); } catch (e2) {} }
return null;
};
var garder = function (choix) { try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {} };
var envoyer = function (nom, donnees) { if (window.gtag && identifiant && !window['ga-disable-' + identifiant]) window.gtag('event', nom, donnees); };
var CONTACTS = [['tel:', 'clic_telephone'], ['https://wa.me/', 'clic_whatsapp'], ['mailto:', 'clic_email']];
var suivreContacts = function () {
document.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href]');
if (!a) return;
var href = a.getAttribute('href').toLowerCase();
for (var i = 0; i < CONTACTS.length; i++) {
if (href.indexOf(CONTACTS[i][0]) === 0) { envoyer(CONTACTS[i][1], { transport_type: 'beacon' }); return; }
}
}, true);
};
var suivreVitesse = function () {
if (!('PerformanceObserver' in window)) return;
var lcp = 0, cls = 0, fenetre = 0, debut = 0, dernier = 0, durees = {}, parti = false;
var observer = function (type, lire, options) {
try { new PerformanceObserver(function (l) { l.getEntries().forEach(lire); }).observe(Object.assign({ type: type, buffered: true }, options)); }
catch (e) {}
};
observer('largest-contentful-paint', function (x) { lcp = x.startTime; });
observer('layout-shift', function (x) {
if (x.hadRecentInput) return;
if (fenetre && (x.startTime - dernier > 1000 || x.startTime - debut > 5000)) { fenetre = 0; }
if (!fenetre) debut = x.startTime;
fenetre += x.value; dernier = x.startTime; cls = Math.max(cls, fenetre);
});
observer('event', function (x) {
if (x.interactionId) durees[x.interactionId] = Math.max(durees[x.interactionId] || 0, x.duration);
}, { durationThreshold: 40 });
observer('first-input', function (x) { durees[x.interactionId || 'premier'] = Math.max(durees[x.interactionId || 'premier'] || 0, x.duration); });
var partir = function () {
if (parti || document.visibilityState !== 'hidden') return;
parti = true;
var liste = Object.keys(durees).map(function (k) { return durees[k]; }).sort(function (a, b) { return b - a; });
var inp = liste.length ? liste[Math.min(liste.length - 1, Math.floor(liste.length / 50))] : null;
var mesures = [['LCP', lcp || null, Math.round(lcp)], ['CLS', cls, Math.round(cls * 1000)], ['INP', inp, Math.round(inp)]];
mesures.forEach(function (m) {
if (m[1] !== null) envoyer(m[0], { value: m[2], metric_value: m[1], non_interaction: true, transport_type: 'beacon' });
});
};
document.addEventListener('visibilitychange', partir);
window.addEventListener('pagehide', function () { partir(); });
};
var mesurer = function () {
if (!identifiant) return;
window['ga-disable-' + identifiant] = false;
if (window.gtag) return;
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('set', 'allow_ad_personalization_signals', false);
window.gtag('js', new Date());
window.gtag('config', identifiant, { allow_google_signals: false, allow_ad_personalization_signals: false,
cookie_expires: 34214400, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure' });
var s = document.createElement('script');
s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(identifiant);
document.head.appendChild(s);
suivreContacts();
suivreVitesse();
};
var choix = lire();
if (choix === 'oui') mesurer();
cookies.hidden = choix !== null;
var placeBandeau = function () {
var bas = cookies.hidden ? 0 : Math.round(cookies.offsetHeight + (parseFloat(getComputedStyle(cookies).bottom) || 0));
document.documentElement.style.setProperty('--bas-consentement', bas + 'px');
};
placeBandeau();
window.addEventListener('resize', placeBandeau);
if ('ResizeObserver' in window) { new ResizeObserver(placeBandeau).observe(cookies); }
document.addEventListener('focusin', function (e) {
if (cookies.hidden || cookies.contains(e.target)) return;
var r = e.target.getBoundingClientRect(), haut = cookies.getBoundingClientRect().top;
if (r.bottom > haut && r.top < window.innerHeight) { window.scrollBy(0, Math.ceil(r.bottom - haut + 16)); }
});
var boutons = cookies.querySelectorAll('[data-consentement]');
boutons.forEach(function (b, i) {
b.addEventListener('click', function () {
var oui = (b.getAttribute('data-consentement') || (i === 0 ? 'oui' : 'non')) === 'oui';
garder(oui ? 'oui' : 'non');
cookies.hidden = true;
if (oui) mesurer();
});
});
document.querySelectorAll('[data-revoir]').forEach(function (b) {
b.hidden = false;
b.addEventListener('click', function () {
if (identifiant) window['ga-disable-' + identifiant] = true;
try { localStorage.removeItem(CLE); } catch (e) {}
document.cookie.split(';').forEach(function (c) {
var nom = c.split('=')[0].trim();
if (/^_ga/.test(nom)) {
var domaine = location.hostname.replace(/^www\./, '');
['', '; domain=' + location.hostname, '; domain=.' + domaine].forEach(function (d) {
document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
});
}
});
cookies.hidden = false;
});
});
} catch (e) { console.error('bandeaux.js', e); }
})();
(function () {
try {
var cibles = document.querySelectorAll('[data-antirobot]');
var envoyer = function (f) { f.submit(); };
window.siteEnvoi = envoyer;
if (!cibles.length) return;
var DELAI_SCRIPT = 8000, DELAI_JETON = 20000, LIEN_MAX = 1800;
var charge = false, panne = false, retire = false, attente = null, reglage = null;
function blocs() { return document.querySelectorAll('[data-antirobot-panne]'); }
function montrer(oui, apresEnvoi) {
panne = oui;
blocs().forEach(function (b) {
b.hidden = !oui;
var av = b.querySelector('[data-panne-avant]'), ap = b.querySelector('[data-panne-apres]');
if (oui && av && ap && (apresEnvoi || !ap.hidden)) { av.hidden = true; ap.hidden = false; }
});
}
function declarer() { if (!jeton() && !retire) montrer(true); }
function jeton(f) {
var j = (f || document).querySelector('[name="cf-turnstile-response"]');
return !!(j && j.value);
}
function rendre(f) {
f.removeAttribute('data-envoi');
f.classList.remove('envoi');
var t = f.querySelector('[data-texte]');
if (t) t.textContent = t.getAttribute('data-texte');
}
function libelle(c) {
var l = c.closest('fieldset') && c.type === 'checkbox' && c.closest('fieldset').querySelector('legend');
if (!l) l = (c.id && document.querySelector('label[for="' + c.id + '"]')) || c.closest('label');
if (!l) return c.name;
var n = l.firstChild;
return ((n && n.nodeType === 3 ? n.textContent : l.textContent) || c.name).trim();
}
function corps(f) {
var lignes = [], vus = {}, en = document.documentElement.lang === 'en', es = document.documentElement.lang === 'es';
[].forEach.call(f.elements, function (c) {
if (!c.name || c.type === 'hidden' || c.type === 'submit' || c.closest('.champ-piege') || c.name === 'cf-turnstile-response') return;
var v = c.type === 'checkbox' ? (c.checked ? (c.closest('fieldset') ? c.value : (es ? 'sí' : en ? 'yes' : 'oui')) : '') : c.tagName === 'SELECT' ? (c.value ? c.options[c.selectedIndex].text : '') : c.value;
if (!v || (c.type === 'checkbox' && c.value === '?' && c.closest('fieldset'))) return;
var cle = libelle(c);
if (vus[cle] !== undefined) { lignes[vus[cle]] += ', ' + v; return; }
vus[cle] = lignes.length;
lignes.push(cle + ((en || es) ? ': ' : ' : ') + v);
});
return lignes.join('\n');
}
function preparer(a) {
var f = a.closest('form'), base = a.getAttribute('href').split('&body=')[0] + '&body=', texte = f ? corps(f) : '';
while (texte && (base + encodeURIComponent(texte)).length > LIEN_MAX) texte = texte.slice(0, Math.floor(texte.length * 0.9)).replace(/[\uD800-\uDBFF]$/, '');
a.setAttribute('href', base + encodeURIComponent(texte));
}
document.querySelectorAll('[data-antirobot-courriel]').forEach(function (a) {
['pointerdown', 'focus', 'click'].forEach(function (t) { a.addEventListener(t, function () { preparer(a); }); });
});
function lireReglage() {
if (!reglage) {
var f = cibles[0].closest('form'), adresse = (f && f.getAttribute('action')) || '/api/demande';
reglage = fetch(adresse, { headers: { accept: 'application/json' }, credentials: 'same-origin' })
.then(function (r) { if (!r.ok) throw new Error('reglage'); return r.json(); })
.catch(function () { return null; });
}
return reglage;
}
function retirer() {
retire = true;
montrer(false);
document.querySelectorAll('[data-antirobot-mention]').forEach(function (m) { m.hidden = true; });
}
function charger() {
if (charge) return;
charge = true;
var delai = setTimeout(declarer, DELAI_SCRIPT);
lireReglage().then(function (r) {
if (r && r.actif === false) { clearTimeout(delai); retirer(); return; }
if (!r || !r.cle_site) { clearTimeout(delai); declarer(); return; }
widget(r.cle_site, delai);
});
}
function widget(cle, delai) {
window.siteTurnstile = function () {
clearTimeout(delai);
cibles.forEach(function (c) {
try {
window.turnstile.render(c, {
sitekey: cle, language: document.documentElement.lang || 'auto',
callback: function () { montrer(false); },
'error-callback': function () { declarer(); return true; },
'unsupported-callback': declarer,
'timeout-callback': declarer
});
} catch (e) { declarer(); }
});
};
var s = document.createElement('script');
s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=siteTurnstile';
s.async = true;
s.onerror = function () { clearTimeout(delai); declarer(); };
document.head.appendChild(s);
}
cibles.forEach(function (c) {
var f = c.closest('form');
if (!f) return;
['focusin', 'pointerdown', 'input'].forEach(function (t) { f.addEventListener(t, charger, { once: true }); });
});
window.addEventListener('pageshow', function (e) {
if (e.persisted) document.querySelectorAll('form[data-envoi]').forEach(rendre);
});
function bloquer(f) {
montrer(true, true);
rendre(f);
var b = f.querySelector('[data-antirobot-panne]');
if (!b) return;
b.setAttribute('tabindex', '-1');
b.scrollIntoView({ block: 'center', behavior: 'smooth' });
b.focus({ preventScroll: true });
}
window.siteEnvoi = function (f) {
if (f.getAttribute('data-envoi')) return;
f.setAttribute('data-envoi', '1');
if (!f.querySelector('[data-antirobot]') || retire) { envoyer(f); return; }
if (jeton(f)) { envoyer(f); return; }
if (panne) { bloquer(f); return; }
charger();
var debut = Date.now();
clearTimeout(attente);
(function attendre() {
if (jeton(f) || retire) { envoyer(f); return; }
if (panne || Date.now() - debut > DELAI_JETON) { bloquer(f); return; }
attente = setTimeout(attendre, 250);
})();
};
} catch (e) { console.error('antirobot.js', e); }
})();
(function () {
try {
var bloc = document.querySelector('.demande');
var formulaire = bloc && bloc.querySelector('form');
if (!formulaire) return;
var EN = /^en/i.test(document.documentElement.lang), ES = /^es/i.test(document.documentElement.lang);
formulaire.querySelectorAll('.champ').forEach(function (c) {
var champ = c.querySelector('input[id], select[id], textarea[id]');
var message = c.querySelector('.champ__erreur');
if (!champ || !message) return;
message.id = message.id || 'erreur-' + champ.id;
var decrit = champ.getAttribute('aria-describedby');
champ.setAttribute('aria-describedby', (decrit ? decrit + ' ' : '') + message.id);
});
var champArrivee = document.getElementById('arrivee');
var champDepart = document.getElementById('depart');
var aujourdhui = (function () {
var d = new Date(), deux = function (n) { return (n < 10 ? '0' : '') + n; };
return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate());
})();
var arriveePassee = function () { return !!(champArrivee && champArrivee.value && champArrivee.value < aujourdhui); };
var verifierArrivee = function () {};
if (champArrivee) {
champArrivee.min = aujourdhui;
var blocArrivee = champArrivee.closest('.champ');
var messageArrivee = blocArrivee ? blocArrivee.querySelector('.champ__erreur') : null;
var texteArrivee = messageArrivee ? messageArrivee.textContent : '';
verifierArrivee = function () {
var passee = arriveePassee();
if (blocArrivee) { blocArrivee.classList.toggle('champ--faux', passee); }
champArrivee.setAttribute('aria-invalid', passee ? 'true' : 'false');
if (messageArrivee) { messageArrivee.textContent = passee ? (ES ? 'Error: esta fecha de llegada ya ha pasado.' : EN ? 'Error: this arrival date has already passed.' : 'Erreur : cette date d’arrivée est déjà passée.') : texteArrivee; }
return !passee;
};
}
if (champArrivee && champDepart) {
var blocDepart = champDepart.closest('.champ');
var messageDepart = blocDepart ? blocDepart.querySelector('.champ__erreur') : null;
var texteOrigine = messageDepart ? messageDepart.textContent : '';
var verifierDepart = function () {
if (champArrivee.value && champDepart.value && champDepart.value <= champArrivee.value) {
if (blocDepart) { blocDepart.classList.add('champ--faux'); }
if (messageDepart) { messageDepart.textContent = ES ? 'Error: la fecha de salida debe ser posterior a la de llegada.' : EN ? 'Error: the departure date must be after the arrival date.' : 'Erreur : la date de départ doit être après l’arrivée.'; }
champDepart.setAttribute('aria-invalid', 'true');
return false;
}
if (blocDepart) { blocDepart.classList.remove('champ--faux'); }
if (champDepart.getAttribute('aria-invalid') === 'true') champDepart.setAttribute('aria-invalid', 'false');
if (messageDepart) { messageDepart.textContent = texteOrigine; }
return true;
};
var lendemain = function (iso) {
var d = new Date(iso + 'T12:00:00'), deux = function (n) { return (n < 10 ? '0' : '') + n; };
d.setDate(d.getDate() + 1);
return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate());
};
champArrivee.addEventListener('change', function () {
if (champArrivee.value) { champDepart.min = lendemain(champArrivee.value); }
verifierArrivee();
verifierDepart();
});
champDepart.addEventListener('change', verifierDepart);
}
var ouvertures = JSON.parse(formulaire.getAttribute('data-ouvertures') || '[]');
var MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var MOIS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var dateOuverture = function (o) {
if (!EN && !ES) return o.date;
var a = String(o.le || '').split('-');
if (ES) return a.length === 3 ? +a[2] + ' de ' + MOIS_ES[+a[1] - 1] + ' de ' + a[0] : o.date;
return a.length === 3 ? +a[2] + ' ' + MOIS_EN[+a[1] - 1] + ' ' + a[0] : o.date;
};
if (ouvertures.length && champArrivee) {
var avisOuverture = document.createElement('p');
avisOuverture.className = 'champ__avis'; avisOuverture.id = 'avis-ouverture'; avisOuverture.hidden = true;
avisOuverture.setAttribute('aria-live', 'polite');
champArrivee.closest('.champ').appendChild(avisOuverture);
var decritA = champArrivee.getAttribute('aria-describedby');
champArrivee.setAttribute('aria-describedby', (decritA ? decritA + ' ' : '') + avisOuverture.id);
var avertirOuverture = function () {
var a = champArrivee.value, lignes = [];
if (a) {
var choix = formulaire.querySelectorAll('input[name="chambre"], input[name="gite"]'), coches = [];
choix.forEach(function (c) { if ((c.checked || c.type === 'hidden') && c.value !== '?') coches.push(c.value); });
var tard = ouvertures.filter(function (o) { return a < o.le; });
if (coches.length) {
tard.filter(function (o) { return coches.indexOf(o.nom) >= 0; }).forEach(function (o) {
lignes.push(ES ? o.nom + ' recibe a sus primeros huéspedes a partir del ' + dateOuverture(o) + '.' : EN ? o.nom + ' welcomes its first guests from ' + dateOuverture(o) + '.' : o.nom + ' accueille ses premiers séjours à partir du ' + o.date + '.');
});
} else if (tard.length && tard.length >= choix.length - (formulaire.querySelector('input[value="?"]') ? 1 : 0)) {
var premiere = tard.reduce(function (x, o) { return o.le < x.le ? o : x; });
if (ES) lignes.push(choix.length > 1 ? 'Recibimos a nuestros primeros huéspedes a partir del ' + dateOuverture(premiere) + '.'
: premiere.nom + ' recibe a sus primeros huéspedes a partir del ' + dateOuverture(premiere) + '.');
else if (EN) lignes.push(choix.length > 1 ? 'We welcome our first guests from ' + dateOuverture(premiere) + '.'
: premiere.nom + ' welcomes its first guests from ' + dateOuverture(premiere) + '.');
else lignes.push(choix.length > 1 ? 'Nous accueillons nos premiers séjours à partir du ' + premiere.date + '.'
: premiere.nom + ' accueille ses premiers séjours à partir du ' + premiere.date + '.');
}
}
var texte = lignes.length ? lignes.join(' ') + (ES ? ' Aun así, puede enviar su solicitud.' : EN ? ' You can still send your request.' : ' Vous pouvez quand même envoyer votre demande.') : '';
if (avisOuverture.textContent !== texte) avisOuverture.textContent = texte;
avisOuverture.hidden = !texte;
};
formulaire.addEventListener('change', avertirOuverture);
document.addEventListener('click', function () { setTimeout(avertirOuverture, 0); });
avertirOuverture();
}
var ouvreurs = document.querySelectorAll('[data-ouvrir-formulaire]');
var ouvrirFormulaire = function () {
bloc.classList.remove('formulaire-ferme');
ouvreurs.forEach(function (o) { o.setAttribute('aria-expanded', 'true'); });
};
if (location.hash === '#formulaire') { ouvrirFormulaire(); }
else { bloc.classList.add('formulaire-ferme'); }
ouvreurs.forEach(function (o) {
o.addEventListener('click', function (ev) {
ev.preventDefault();
ouvrirFormulaire();
var demande = o.getAttribute('data-demande');
if (demande) {
formulaire.querySelectorAll('input[name="demande_particuliere"]').forEach(function (c) { if (c.value === demande) c.checked = true; });
}
document.getElementById('formulaire').scrollIntoView({ behavior: 'smooth', block: 'start' });
document.getElementById('nom').focus({ preventScroll: true });
});
});
document.querySelectorAll('a[href="#reserver"]').forEach(function (a) { a.addEventListener('click', ouvrirFormulaire); });
var casesChambre = formulaire.querySelectorAll('input[name="chambre"], input[name="gite"]');
casesChambre.forEach(function (c) {
c.addEventListener('change', function () {
var sansAvis = null, une = false;
casesChambre.forEach(function (x) { if (x.value === '?') sansAvis = x; else if (x.checked) une = true; });
if (!sansAvis) return;
if (c === sansAvis) { if (c.checked) casesChambre.forEach(function (x) { if (x !== sansAvis) x.checked = false; }); else if (!une) c.checked = true; }
else { sansAvis.checked = !une; }
});
});
var AVIS = {
fr: {
capacite_un: '{noms} accueille {places} personnes au plus, et vous êtes {n}.',
capacite_plusieurs: '{noms} accueillent {places} personnes au plus, et vous êtes {n}.',
capacite_tous: 'Nous accueillons {places} personnes au plus, et vous êtes {n}.',
duree: 'Les séjours sont de {min} nuits au moins, et votre demande porte sur {nuits}.',
jour: 'D’habitude, les arrivées ne se font pas le {jour}.',
fermeture: 'Une partie de votre séjour tombe en dehors de notre période d’ouverture.',
fermeture_tout: 'Ces dates tombent en dehors de notre période d’ouverture.',
prises_un: 'Selon notre calendrier, {noms} n’est pas libre à toutes ces dates.',
prises_plusieurs: 'Selon notre calendrier, {noms} ne sont pas libres à toutes ces dates.',
prises_tous: 'Selon notre calendrier, ces dates ne sont pas toutes libres.',
envoyer: 'Vous pouvez quand même envoyer votre demande.',
et: ' et ', nuit: 'nuit', nuits: 'nuits',
jours: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
},
en: {
capacite_un: '{noms} sleeps {places} guests at most, and there are {n} of you.',
capacite_plusieurs: '{noms} sleep {places} guests at most, and there are {n} of you.',
capacite_tous: 'We can host {places} guests at most, and there are {n} of you.',
duree: 'Stays are {min} nights minimum, and your request is for {nuits}.',
jour: 'Arrivals are not usually on a {jour}.',
fermeture: 'Part of your stay falls outside our opening period.',
fermeture_tout: 'These dates fall outside our opening period.',
prises_un: 'According to our calendar, {noms} is not free on all these dates.',
prises_plusieurs: 'According to our calendar, {noms} are not free on all these dates.',
prises_tous: 'According to our calendar, these dates are not all free.',
envoyer: 'You can still send your request.',
et: ' and ', nuit: 'night', nuits: 'nights',
jours: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
},
es: {
capacite_un: '{noms} admite {places} personas como máximo, y su solicitud es para {n}.',
capacite_plusieurs: '{noms} admiten {places} personas como máximo, y su solicitud es para {n}.',
capacite_tous: 'Podemos alojar a {places} personas como máximo, y su solicitud es para {n}.',
duree: 'Las estancias son de {min} noches como mínimo, y su solicitud es de {nuits}.',
jour: 'Normalmente las llegadas no se realizan el {jour}.',
fermeture: 'Una parte de su estancia queda fuera de nuestro periodo de apertura.',
fermeture_tout: 'Estas fechas quedan fuera de nuestro periodo de apertura.',
prises_un: 'Según nuestro calendario, {noms} no está libre en todas estas fechas.',
prises_plusieurs: 'Según nuestro calendario, {noms} no están libres en todas estas fechas.',
prises_tous: 'Según nuestro calendario, no todas estas fechas están libres.',
envoyer: 'Aun así, puede enviar su solicitud.',
et: ' y ', nuit: 'noche', nuits: 'noches',
jours: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
}
}[/^es/i.test(document.documentElement.lang) ? 'es' : /^en/i.test(document.documentElement.lang) ? 'en' : 'fr'];
var reglages = null;
var zonesAvis = {};
var zoneAvis = function (cle, ids) {
var champ = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
if (!champ.length) return null;
var p = document.createElement('p');
p.className = 'champ__avis'; p.id = 'avis-' + cle; p.hidden = true; p.setAttribute('aria-live', 'polite');
champ[champ.length - 1].closest('.champ').appendChild(p);
champ.forEach(function (c) {
var d = c.getAttribute('aria-describedby');
c.setAttribute('aria-describedby', (d ? d + ' ' : '') + p.id);
});
return p;
};
var remplirAvis = function (modele, v) { return modele.replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); };
var listeNoms = function (n) { return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + AVIS.et + n[n.length - 1]; };
var jourIso = function (v) { var a = v.split('-'); return new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); };
var lendemainIso = function (v) { var d = jourIso(v); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
var dansPeriode = function (j, p) { var mj = j.slice(5); return p.du <= p.au ? mj >= p.du && mj <= p.au : mj >= p.du || mj <= p.au; };
var regleDuJour = function (l, j) {
var r = l.regles || {}, s = (r.saisons || []).filter(function (x) { return dansPeriode(j, x); })[0] || {};
return { min: s.nuits_min || r.nuits_min || 1, jours: s.jours_arrivee || r.jours_arrivee || null };
};
var regleSejour = function (l, a, d) {
var r = regleDuJour(l, a), regles = l.regles || {};
for (var j = lendemainIso(a); j < d; j = lendemainIso(j)) {
var s = (regles.saisons || []).filter(function (x) { return dansPeriode(j, x); })[0];
if (s && s.jours_arrivee && s.jours_arrivee.length) {
r = { min: Math.max(r.min, s.nuits_min || 1), jours: r.jours || s.jours_arrivee };
}
}
return r;
};
var avertir = function () {
if (!reglages) return;
var tous = reglages.logements || [], coches = [];
formulaire.querySelectorAll('input[name="chambre"]:checked, input[name="gite"]:checked, input[name="gite"][type="hidden"]').forEach(function (c) { if (c.value !== '?') coches.push(c.value); });
var vises = tous.filter(function (l) { return coches.indexOf(l.nom) >= 0; });
if (!vises.length && tous.length === 1) vises = tous;
var consideres = vises.length ? vises : tous, choisis = vises.length && tous.length > 1;
var lignes = { capacite: [], depart: [], arrivee: [] };
var champA = document.getElementById('adultes'), champE = document.getElementById('enfants');
var personnes = (champA ? +champA.value || 0 : 0) + (champE ? +champE.value || 0 : 0);
var places = consideres.reduce(function (s, l) { return s + (l.capacite || 0); }, 0);
if (places > 0 && personnes > places) {
var nomsCap = vises.map(function (l) { return l.nom; });
lignes.capacite.push(remplirAvis(choisis ? AVIS[nomsCap.length > 1 ? 'capacite_plusieurs' : 'capacite_un'] : tous.length === 1 ? AVIS.capacite_un : AVIS.capacite_tous,
{ noms: listeNoms(nomsCap), places: places, n: personnes }));
}
var a = champArrivee && champArrivee.value, d = champDepart && champDepart.value;
if (a && d && d > a && a >= aujourdhui) {
var n = Math.round((jourIso(d) - jourIso(a)) / 864e5), regles = consideres.map(function (l) { return regleSejour(l, a, d); });
var tolerant = !vises.length, mins = regles.map(function (r) { return r.min; });
var min = mins.length ? (tolerant ? Math.min.apply(null, mins) : Math.max.apply(null, mins)) : 1;
if (n < min) lignes.depart.push(remplirAvis(AVIS.duree, { min: min, nuits: n + ' ' + (n > 1 ? AVIS.nuits : AVIS.nuit) }));
var jour = jourIso(a).getUTCDay();
var refuses = regles.map(function (r) { return !!(r.jours && r.jours.length && r.jours.indexOf(jour) < 0); });
if (regles.length && (tolerant ? refuses.every(Boolean) : refuses.some(Boolean))) lignes.arrivee.push(remplirAvis(AVIS.jour, { jour: AVIS.jours[jour] }));
var ouverture = reglages.ouverture;
if (ouverture && ouverture.length) {
var nuitsFermees = 0, nuitsTotal = 0;
for (var j = a; j < d; j = lendemainIso(j)) {
nuitsTotal++;
if (!ouverture.some(function (p) { return dansPeriode(j, p); })) nuitsFermees++;
}
if (nuitsFermees) lignes.arrivee.push(nuitsFermees === nuitsTotal ? AVIS.fermeture_tout : AVIS.fermeture);
}
var cal = window.siteCalendrier;
if (cal && cal.pret) {
var nomsPris = choisis ? vises.map(function (l) { return l.nom; }).filter(function (nom) { return !cal.libre([nom], a, d); }) : [];
if (nomsPris.length || (!choisis && !cal.libre(vises.map(function (l) { return l.nom; }), a, d))) {
lignes.depart.push(remplirAvis(AVIS[nomsPris.length > 1 ? 'prises_plusieurs' : nomsPris.length ? 'prises_un' : 'prises_tous'], { noms: listeNoms(nomsPris) }));
}
}
}
Object.keys(lignes).forEach(function (cle) {
var p = zonesAvis[cle];
if (!p) return;
var texte = lignes[cle].length ? lignes[cle].join(' ') + ' ' + AVIS.envoyer : '';
if (p.textContent !== texte) p.textContent = texte;
p.hidden = !texte;
});
};
if (champArrivee && champDepart) {
fetch('/config-site.json', { headers: { accept: 'application/json' } })
.then(function (r) { if (!r.ok) throw new Error('reglages'); return r.json(); })
.then(function (c) {
if (!c || !Array.isArray(c.logements)) return;
reglages = c;
zonesAvis = { capacite: zoneAvis('capacite', ['adultes', 'enfants']), depart: zoneAvis('depart', ['depart']), arrivee: zoneAvis('arrivee', ['arrivee']) };
formulaire.addEventListener('change', avertir);
document.addEventListener('site:calendrier', avertir);
ouvreurs.forEach(function (o) { o.addEventListener('click', avertir); });
avertir();
})
.catch(function () {});
}
var champMessage = document.getElementById('message');
var compteur = formulaire.querySelector('.compteur');
if (champMessage && compteur) {
var locale = ES ? 'es-ES' : EN ? 'en-GB' : 'fr-FR';
var maximum = (+champMessage.maxLength || 2000).toLocaleString(locale);
var compter = function () { compteur.textContent = champMessage.value.length.toLocaleString(locale) + ' / ' + maximum; };
champMessage.addEventListener('input', compter);
compter();
}
var NOMBRES = ES ? ['Falta un dato', 'Faltan dos datos', 'Faltan tres datos', 'Faltan cuatro datos']
: EN ? ['One detail is missing', 'Two details are missing', 'Three details are missing', 'Four details are missing']
: ['Une information manque', 'Deux informations manquent', 'Trois informations manquent', 'Quatre informations manquent'];
window.addEventListener('pageshow', function (e) {
var t = formulaire.querySelector('.bouton__texte[data-texte]');
if (e.persisted && t) { formulaire.classList.remove('envoi'); t.textContent = t.getAttribute('data-texte'); }
});
formulaire.addEventListener('submit', function (ev) {
ev.preventDefault();
var manquants = [];
var verifier = function (id, libelle, valide) {
var champ = document.getElementById(id);
if (!champ) return;
var bon = valide(champ.value.trim());
champ.closest('.champ').classList.toggle('champ--faux', !bon);
champ.setAttribute('aria-invalid', bon ? 'false' : 'true');
if (!bon) { manquants.push([id, libelle]); }
};
verifier('nom', ES ? 'Su nombre y apellidos' : EN ? 'Your first name and surname' : 'Votre prénom et votre nom', function (v) { return v.length > 0; });
verifier('courriel', ES ? 'Su dirección de correo electrónico' : EN ? 'Your email address' : 'Votre adresse électronique', function (v) { return /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\]]{2,}$/.test(v); });
var champC = document.getElementById('courriel'), erreurC = champC && champC.closest('.champ').querySelector('.champ__erreur[data-vide]');
if (erreurC) {
if (!erreurC.hasAttribute('data-faux')) erreurC.setAttribute('data-faux', erreurC.textContent);
erreurC.textContent = erreurC.getAttribute(champC.value.trim() ? 'data-faux' : 'data-vide');
}
var etiquetteTel = formulaire.querySelector('label[for="tel"]'), nomTel = etiquetteTel && etiquetteTel.firstChild ? etiquetteTel.firstChild.textContent.trim() : '';
verifier('tel', nomTel || (ES ? 'Su teléfono' : EN ? 'Your telephone' : 'Votre téléphone'), function (v) { return !v || v.replace(/\D/g, '').length >= 6; });
verifier('arrivee', ES ? 'La fecha de llegada' : EN ? 'The arrival date' : 'La date d’arrivée', function (v) { return v.length > 0 && v >= aujourdhui; });
if (arriveePassee()) { verifierArrivee(); }
verifier('depart', ES ? 'La fecha de salida' : EN ? 'The departure date' : 'La date de départ', function (v) { return v.length > 0 && (!champArrivee || v > champArrivee.value); });
var resume = formulaire.querySelector('.resume');
if (manquants.length) {
resume.querySelector('p').textContent = NOMBRES[Math.min(manquants.length, NOMBRES.length) - 1] + (ES ? ' para enviar su solicitud.' : EN ? ' before you can send your request.' : ' pour envoyer votre demande.');
var liste = resume.querySelector('ul');
liste.innerHTML = '';
manquants.forEach(function (m) {
var li = document.createElement('li');
var a = document.createElement('a');
a.href = '#' + m[0];
var zone = document.getElementById(m[0]).closest('.champ');
var message = zone && zone.querySelector('.champ__erreur');
var raison = message ? message.textContent.trim().replace((EN || ES) ? /^Error\s*:\s*/ : /^Erreur\s*:\s*/, '') : '';
a.textContent = m[1] + (raison ? ((EN || ES) ? ': ' : '\u00a0: ') + raison : '');
li.appendChild(a);
liste.appendChild(li);
});
formulaire.classList.add('a-erreurs');
resume.scrollIntoView({ block: 'center', behavior: 'smooth' });
resume.setAttribute('tabindex', '-1');
resume.focus({ preventScroll: true });
return;
}
formulaire.classList.remove('a-erreurs');
formulaire.classList.add('envoi');
var texteBouton = formulaire.querySelector('.bouton__texte');
if (!texteBouton.hasAttribute('data-texte')) texteBouton.setAttribute('data-texte', texteBouton.textContent);
texteBouton.textContent = ES ? 'Enviando…' : EN ? 'Sending…' : 'Envoi en cours';
if (formulaire.getAttribute('action')) { (window.siteEnvoi || function (x) { x.submit(); })(formulaire); return; }
setTimeout(function () {
bloc.classList.add('est-confirmee');
bloc.querySelector('.confirme').scrollIntoView({ block: 'center', behavior: 'smooth' });
}, 1200);
});
} catch (e) { console.error('formulaire.js', e); }
})();
(function () {
try {
var listeEtapes = document.querySelector('.etapes');
if (!listeEtapes) return;
var serrerDescriptions = function () {
var bureau = matchMedia('(min-width: 75em)').matches;
listeEtapes.querySelectorAll('li p:not(.etapes__titre)').forEach(function (p) {
p.style.width = '';
if (!bureau) return;
var plage = document.createRange();
plage.selectNodeContents(p);
var droite = Math.max.apply(null, [].map.call(plage.getClientRects(), function (r) { return r.right; }));
p.style.width = Math.ceil(droite - p.getBoundingClientRect().left + 1) + 'px';
});
};
serrerDescriptions();
if (document.fonts) {
if (document.fonts.ready) { document.fonts.ready.then(serrerDescriptions); }
document.fonts.addEventListener('loadingdone', serrerDescriptions);
}
window.addEventListener('load', serrerDescriptions);
window.addEventListener('resize', serrerDescriptions);
if ('ResizeObserver' in window) { new ResizeObserver(function () { requestAnimationFrame(serrerDescriptions); }).observe(listeEtapes); }
} catch (e) { console.error('etapes.js', e); }
})();
(function () {
try {
var liste = document.querySelector('[data-avis]');
var bouton = document.querySelector('[data-avis-plus]');
if (!liste || !bouton) return;
var avis = [].slice.call(liste.children), montres = matchMedia('(max-width: 47.5em)').matches ? 1 : 3, PAQUET = 5;
function maj() {
avis.forEach(function (a, i) { a.classList.toggle('avis-masque', i >= montres); });
var reste = avis.length - montres;
bouton.hidden = reste <= 0;
if (document.documentElement.lang === 'es') bouton.textContent = reste > PAQUET ? 'Leer ' + PAQUET + ' opiniones más' : 'Leer ' + (reste > 1 ? 'las otras ' + reste + ' opiniones' : 'la última opinión');
else if (document.documentElement.lang === 'en') bouton.textContent = reste > PAQUET ? 'Read ' + PAQUET + ' more reviews' : 'Read ' + (reste > 1 ? 'the other ' + reste + ' reviews' : 'the last review');
else bouton.textContent = reste > PAQUET ? 'Lire ' + PAQUET + ' avis de plus' : 'Lire ' + (reste > 1 ? 'les ' + reste + ' autres avis' : 'le dernier avis');
}
bouton.addEventListener('click', function () {
var premier = avis[montres];
montres += PAQUET; maj();
if (premier) { premier.setAttribute('tabindex', '-1'); premier.focus(); }
});
maj();
} catch (e) { console.error('avis.js', e); }
})();
(function () {
try {
document.querySelectorAll('.pratique__q').forEach(function (b) {
var r = document.getElementById(b.getAttribute('aria-controls'));
if (!r) return;
function etat(ouvert) { b.setAttribute('aria-expanded', ouvert ? 'true' : 'false'); r.classList.toggle('pratique__r--ferme', !ouvert); }
etat(false);
b.addEventListener('click', function () { etat(b.getAttribute('aria-expanded') !== 'true'); });
});
} catch (e) { console.error('questions.js', e); }
})();
(function () {
try {
var bloc = document.querySelector('[data-calendrier]');
if (!bloc) return;
var o = JSON.parse(bloc.getAttribute('data-calendrier'));
var EN = document.documentElement.lang === 'en', ES = document.documentElement.lang === 'es';
var MOIS = ES ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
: EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
var MOIS_C = ES ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic']
: EN ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
var JOURS = ES ? ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
: EN ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
var MAX_MOIS = 11, maintenant = new Date(), auj = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function plus(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
function nuits(a, b) { return Math.round((b - a) / 864e5); }
function quantieme(d) { return !EN && !ES && d.getDate() === 1 ? '1er' : String(d.getDate()); }
function court(d) { return quantieme(d) + ' ' + MOIS_C[d.getMonth()]; }
function jourMois(d) { return quantieme(d) + (ES ? ' de ' : ' ') + MOIS[d.getMonth()]; }
function long(d) { return JOURS[d.getDay()] + ' ' + jourMois(d); }
function nomMois(d) { return MOIS[d.getMonth()] + (ES ? ' de ' : ' ') + d.getFullYear(); }
function nNuits(n) { return ES ? n + (n === 1 ? ' noche' : ' noches') : EN ? n + (n === 1 ? ' night' : ' nights') : n + (n > 1 ? ' nuits' : ' nuit'); }
function liste(n) { return n.length < 2 ? n.join('') : n.slice(0, -1).join(', ') + (ES ? ' y ' : EN ? ' and ' : ' et ') + n[n.length - 1]; }
function mj(d) { return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function dans(d, du, au) { var x = mj(d); return du <= au ? x >= du && x <= au : x >= du || x <= au; }
function ferme(d) { return !!o.ouverture && !o.ouverture.some(function (p) { return dans(d, p[0], p[1]); }); }
function euros(n) { return ES ? n.toLocaleString('es-ES') + '\u00a0€' : EN ? '€' + n.toLocaleString('en-GB') : n.toLocaleString('fr-FR') + '\u00a0€'; }
function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
var logements = o.logements.map(function (l) {
var lg = { id: l.id, nom: l.nom, html: esc(l.nom), cap: l.cap, prix: l.prix, saison: !!l.saison, pr: {}, saisons: l.saisons || [] };
(l.pris || []).forEach(function (p) { for (var k = p[0]; k <= p[1]; k++) lg.pr[iso(plus(auj, k))] = true; });
lg.libre = function (d) { return !lg.pr[iso(d)] && !ferme(d); };
lg.saisonDe = function (d) { return lg.saisons.filter(function (s) { return dans(d, s.du, s.au); })[0] || null; };
lg.regle = function (d) {
var s = lg.saisonDe(d);
return { min: s ? s.min : l.min || o.min, jours: (s && s.jours) || l.jours || null, semaine: !!(s && s.semaine) };
};
return lg;
});
function remplir(lg, plages) {
lg.pr = {};
plages.forEach(function (p) {
var a = p[0].split('-'), d = new Date(+a[0], +a[1] - 1, +a[2]);
for (var n = 0; n < 400 && iso(d) <= p[1]; n++, d = plus(d, 1)) lg.pr[iso(d)] = true;
});
}
var plusieurs = logements.length > 1, choix = {};
var MOTS = o.mots || (ES ? { question: '¿Qué habitación? Una o varias', sans_choix: 'Sin habitación elegida, un día está libre si al menos una habitación lo está.',
choisir: 'Elija su habitación: la lista indica cuáles están libres en estas fechas.', reserver: 'Reservar estas {n} habitaciones', replier: 'Elegir una habitación ({n})' }
: EN ? { question: 'Which room? One or more', sans_choix: 'With no room chosen, a day is free if at least one room is.',
choisir: 'Choose your room: the list shows which ones are free on these dates.', reserver: 'Book these {n} rooms', replier: 'Choose a room ({n})' }
: { question: 'Quelle chambre&#8239;? Une ou plusieurs', sans_choix: 'Sans chambre choisie, un jour est libre si au moins une chambre l’est.',
choisir: 'Choisissez votre chambre : la liste dit lesquelles sont libres à ces dates.', reserver: 'Réserver ces {n} chambres', replier: 'Choisir une chambre ({n})' });
function mot(cle, n) { return MOTS[cle].replace('{n}', n); }
if (o.choisi) choix[o.choisi] = true;
var mq = matchMedia('(max-width: ' + (/px$/.test(o.bp) ? parseFloat(o.bp) / 16 + 'em' : o.bp) + ')');
var grille = bloc.querySelector('[data-grille]'), recap = bloc.querySelector('[data-recap]');
var champA = document.getElementById('arrivee'), champD = document.getElementById('depart');
var debut = null, fin = null, decalage = 0, message = '', ecrit = false;
(function () {
var m = /^(\d{4})-(\d{2})$/.exec(new URLSearchParams(location.search).get('mois') || '');
if (m) decalage = Math.max(0, Math.min(MAX_MOIS, (+m[1] - auj.getFullYear()) * 12 + (+m[2] - 1) - auj.getMonth()));
})();
function choisis() { return logements.filter(function (l) { return choix[l.nom]; }); }
function libreSur(l, a, b) { for (var x = a; x < b; x = plus(x, 1)) if (!l.libre(x)) return false; return true; }
function reserveSur(l, a, b) { for (var x = a; x < b; x = plus(x, 1)) if (l.pr[iso(x)]) return false; return true; }
function sejourOk(l, a, b) {
var r = l.regle(a), n = nuits(a, b);
if (n < r.min || (r.semaine && n % 7) || (r.jours && r.jours.indexOf(a.getDay()) < 0)) return false;
for (var x = plus(a, 1); x < b; x = plus(x, 1)) if (!suitSaison(l.regle(x), a, n)) return false;
return libreSur(l, a, b);
}
function suitSaison(r, a, n) {
return !r.jours || (r.jours.indexOf(a.getDay()) >= 0 && n >= r.min && !(r.semaine && n % 7));
}
function entameSaison(d) {
var ok = vises().map(function (l) {
for (var k = 1; k < l.regle(d).min; k++) {
var r = l.regle(plus(d, k));
if (r.jours && r.jours.indexOf(d.getDay()) < 0 && !l.regle(d).jours) return true;
}
return false;
});
return tolerant() ? ok.every(Boolean) : ok.some(Boolean);
}
function vises() { var ch = choisis(); return ch.length ? ch : logements; }
function tolerant() { return plusieurs && !choisis().length; }
function minDe(d) {
var m = vises().map(function (l) { return l.regle(d).min; });
return tolerant() ? Math.min.apply(null, m) : Math.max.apply(null, m);
}
function semaineDe(d) {
var s = vises().map(function (l) { return l.regle(d).semaine; });
return tolerant() ? s.every(Boolean) : s.some(Boolean);
}
function jourOk(d) {
var ok = vises().map(function (l) { var j = l.regle(d).jours; return !j || j.indexOf(d.getDay()) >= 0; });
return tolerant() ? ok.some(Boolean) : ok.every(Boolean);
}
function joursDe(d) {
var j = [];
vises().forEach(function (l) { (l.regle(d).jours || []).forEach(function (x) { if (j.indexOf(x) < 0) j.push(x); }); });
return j.sort().map(function (x) { return JOURS[x]; });
}
function prise(d) {
var ch = choisis();
if (ch.length) return ch.some(function (l) { return !l.libre(d); });
return !logements.some(function (l) { return l.libre(d); });
}
function passe(d) { return d < auj; }
function departOk(d) {
if (!debut || d <= debut) return false;
if (tolerant()) return logements.some(function (l) { return sejourOk(l, debut, d); });
return vises().every(function (l) { return sejourOk(l, debut, d); });
}
function arriveePossible(d) {
var sd = debut, sf = fin, ok = false;
debut = d; fin = null;
for (var k = minDe(d); k <= minDe(d) + 35 && !ok; k++) if (departOk(plus(d, k))) ok = true;
debut = sd; fin = sf;
return ok;
}
function toucher(d) {
if ((debut && +d === +debut) || (fin && +d === +fin)) return;
message = '';
if (debut && !fin && departOk(d)) { fin = d; }
else if (!passe(d) && !prise(d)) {
var ok = arriveePossible(d);
debut = d; fin = null;
if (!ok && !jourOk(d)) {
message = ES ? 'En esta época, las llegadas son los ' + liste(joursDe(d).map(function (j) { return /o$/.test(j) ? j + 's' : j; })) + ': elija otro día de llegada.'
: EN ? 'At this time of year, arrivals are on ' + liste(joursDe(d).map(function (j) { return j + 's'; })) + ': choose another arrival day.'
: 'À cette période, les arrivées se font le ' + liste(joursDe(d)) + ' : choisissez un autre jour d’arrivée.';
debut = null;
} else if (!ok) {
message = ES ? 'A partir del ' + jourMois(d) + ' no hay ' + minDe(d) + ' noches libres seguidas: elija otro día de llegada.'
: EN ? 'From ' + jourMois(d) + ', there aren’t ' + minDe(d) + ' free nights in a row: choose another arrival day.'
: 'Après le ' + court(d) + ', il n’y a pas ' + minDe(d) + ' nuits libres de suite : choisissez une autre arrivée.';
debut = null;
}
}
rendre();
}
function basculer(nom) {
if (choix[nom]) delete choix[nom]; else choix[nom] = true;
message = '';
var bloque = debut && fin ? choisis().filter(function (l) { return !libreSur(l, debut, fin); }).map(function (l) { return l.nom; }) : [];
if (bloque.length) {
message = ES ? liste(bloque) + (bloque.length > 1 ? ' no están libres' : ' no está libre') + ' del ' + jourMois(debut) + ' al ' + jourMois(fin) + ': elija otras fechas.'
: EN ? liste(bloque) + (bloque.length > 1 ? ' are not free' : ' is not free') + ' from ' + jourMois(debut) + ' to ' + jourMois(fin) + ': choose other dates.'
: liste(bloque) + (bloque.length > 1 ? ' ne sont pas libres' : ' n’est pas libre') + ' du ' + court(debut) + ' au ' + court(fin) + ' : choisissez d’autres dates.';
debut = fin = null;
} else if (debut && !fin && prise(debut)) { debut = null; }
rendre();
}
var foyer = null;
function inactif(b) { b.setAttribute('aria-disabled', 'true'); }
function estInactif(b) { return b.getAttribute('aria-disabled') === 'true'; }
function fermeture(d) {
var a = d, b = d, k = 0;
while (k++ < 370 && ferme(plus(a, -1))) a = plus(a, -1);
while (k++ < 740 && ferme(plus(b, 1))) b = plus(b, 1);
return k < 740 ? [a, b] : null;
}
function phraseFermeture(d) {
var p = fermeture(d);
if (!p) return ES ? 'Cerrado en esta época: elija otras fechas.' : EN ? 'Closed at this time of year: choose other dates.' : 'Fermé à cette période : choisissez d’autres dates.';
return ES ? 'Cerramos del ' + jourMois(p[0]) + ' al ' + jourMois(p[1]) + ': elija otras fechas.'
: EN ? 'We are closed from ' + jourMois(p[0]) + ' to ' + jourMois(p[1]) + ': choose other dates.'
: 'Nous sommes fermés du ' + jourMois(p[0]) + ' au ' + jourMois(p[1]) + ' : choisissez d’autres dates.';
}
function semaineEntamee(a, d) {
return vises().some(function (l) {
for (var x = plus(a, 1); x < d; x = plus(x, 1)) if (!suitSaison(l.regle(x), a, nuits(a, d))) return true;
return false;
});
}
function fermeBientot(d) {
if (!o.ouverture || ferme(d)) return null;
for (var k = 1; k < minDe(d); k++) if (ferme(plus(d, k))) return plus(d, k);
return null;
}
function caseJour(d, suivant) {
var b = document.createElement('button'), etat = 'libre', choixDepart = debut && !fin, clos = false;
b.type = 'button'; b.className = 'dispo__j';
b.innerHTML = d.getDate() + (suivant && d.getDate() === 1 ? '<small>' + MOIS_C[d.getMonth()] + '</small>' : '');
b.setAttribute('data-cle', 'j' + iso(d));
b.tabIndex = foyer && +d === +foyer ? 0 : -1;
if (EN) etat = 'free';
if (passe(d)) { b.classList.add('dispo__j--passe'); inactif(b); etat = ES ? 'pasado' : EN ? 'past' : 'passé'; }
else if (debut && +d === +debut) { etat = ES ? 'su llegada' : EN ? 'your arrival' : 'votre arrivée'; }
else if (choixDepart && departOk(d)) { etat = ES ? 'salida posible' : EN ? 'departure possible' : 'départ possible'; }
else if (debut && fin && +d === +fin) { etat = ES ? 'su salida' : EN ? 'your departure' : 'votre départ'; }
else if (debut && fin && d > debut && d < fin) { etat = ES ? 'en su estancia' : EN ? 'part of your stay' : 'dans votre séjour'; }
else if (ferme(d)) { b.classList.add('dispo__j--ferme'); inactif(b); clos = true; etat = ES ? 'cerrado' : EN ? 'closed' : 'fermé'; }
else if (prise(d)) { b.classList.add('dispo__j--pris'); inactif(b); etat = ES ? 'ya reservado' : EN ? 'already booked' : 'déjà réservé'; }
else if (choixDepart && d > debut && nuits(debut, d) < minDe(debut)) { b.classList.add('dispo__j--court'); inactif(b); etat = ES ? 'estancia demasiado corta' : EN ? 'stay too short' : 'séjour trop court'; }
else if (choixDepart && d > debut && (semaineDe(debut) ? nuits(debut, d) % 7 : semaineEntamee(debut, d)) && nuits(debut, d) < minDe(debut) + 35) { b.classList.add('dispo__j--court'); inactif(b); etat = ES ? 'solo estancias por semanas en esta época' : EN ? 'weekly stays only at this time of year' : 'séjours à la semaine à cette période'; }
else if (!choixDepart && !(debut && fin && d >= debut && d <= fin) && !arriveePossible(d)) {
b.classList.add('dispo__j--court'); inactif(b);
var bientot = fermeBientot(d);
if (bientot) clos = bientot;
etat = !jourOk(d) || entameSaison(d) ? (ES ? 'no se puede llegar este día' : EN ? 'no arrivals on this day' : 'pas d’arrivée ce jour-là')
: bientot ? (ES ? 'cerrado a partir del ' + jourMois(bientot) : EN ? 'closed from ' + jourMois(bientot) : 'fermé à partir du ' + jourMois(bientot))
: ES ? 'menos de ' + minDe(d) + ' noches libres a partir de este día'
: EN ? 'fewer than ' + minDe(d) + ' free nights from this day' : 'moins de ' + minDe(d) + ' nuits libres à partir de ce jour';
}
if (choixDepart && +d === +debut) b.classList.add('dispo__j--bord');
if (debut && fin && d >= debut && d <= fin) { b.classList.add('dispo__j--sel'); if (+d === +debut || +d === +fin) b.classList.add('dispo__j--bord'); }
if (+d === +auj) b.classList.add('dispo__j--auj');
if (suivant) b.classList.add('dispo__j--suivant');
b.setAttribute('aria-label', long(d) + ', ' + etat);
b.addEventListener('click', function () {
foyer = d;
if (!estInactif(b)) { toucher(d); return; }
if (clos) { message = phraseFermeture(clos === true ? d : clos); rendre(); }
});
return b;
}
function premierJour() { return new Date(auj.getFullYear(), auj.getMonth(), 1); }
function dernierJour() { return new Date(auj.getFullYear(), auj.getMonth() + MAX_MOIS + 1, 0); }
function rang(d) { return (d.getFullYear() - auj.getFullYear()) * 12 + d.getMonth() - auj.getMonth(); }
function deplacer(d) {
if (d < premierJour()) d = premierJour();
if (d > dernierJour()) d = dernierJour();
foyer = d;
var cle = 'j' + iso(d), cible = grille.querySelector('[data-cle="' + cle + '"]');
if (!cible) {
var n = mq.matches ? 1 : 2;
decalage = Math.max(0, Math.min(MAX_MOIS - n + 1, rang(d) - (rang(d) > decalage ? n - 1 : 0)));
rendre();
cible = grille.querySelector('[data-cle="' + cle + '"]');
}
if (!cible) return;
grille.querySelectorAll('.dispo__j[tabindex="0"]').forEach(function (x) { if (x !== cible) x.tabIndex = -1; });
cible.tabIndex = 0;
cible.focus();
}
grille.addEventListener('keydown', function (e) {
var b = e.target, cle = b && b.getAttribute && b.getAttribute('data-cle');
if (!cle || cle.charAt(0) !== 'j' || e.altKey || e.ctrlKey || e.metaKey) return;
var a = cle.slice(1).split('-'), d = new Date(+a[0], +a[1] - 1, +a[2]), x = null;
var mois = function (k) { var m = new Date(d.getFullYear(), d.getMonth() + k, 1); return new Date(m.getFullYear(), m.getMonth(), Math.min(d.getDate(), new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate())); };
if (e.key === 'ArrowLeft') x = plus(d, -1);
else if (e.key === 'ArrowRight') x = plus(d, 1);
else if (e.key === 'ArrowUp') x = plus(d, -7);
else if (e.key === 'ArrowDown') x = plus(d, 7);
else if (e.key === 'Home') x = plus(d, -((d.getDay() + 6) % 7));
else if (e.key === 'End') x = plus(d, 6 - (d.getDay() + 6) % 7);
else if (e.key === 'PageUp') x = mois(e.shiftKey ? -12 : -1);
else if (e.key === 'PageDown') x = mois(e.shiftKey ? 12 : 1);
if (!x) return;
e.preventDefault();
deplacer(x);
});
grille.addEventListener('focusin', function (e) {
var b = e.target, cle = b && b.getAttribute && b.getAttribute('data-cle');
if (!cle || cle.charAt(0) !== 'j') return;
var a = cle.slice(1).split('-');
foyer = new Date(+a[0], +a[1] - 1, +a[2]);
grille.querySelectorAll('.dispo__j[tabindex="0"]').forEach(function (x) { if (x !== b) x.tabIndex = -1; });
b.tabIndex = 0;
});
function unMois(annee, m, avecSuite) {
var bloc1 = document.createElement('div'), g = document.createElement('div');
bloc1.innerHTML = ES ? '<div class="dispo__jours" aria-hidden="true"><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span></div>'
: EN ? '<div class="dispo__jours" aria-hidden="true"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>'
: '<div class="dispo__jours" aria-hidden="true"><span>lu</span><span>ma</span><span>me</span><span>je</span><span>ve</span><span>sa</span><span>di</span></div>';
g.className = 'dispo__grille';
var vides = (new Date(annee, m, 1).getDay() + 6) % 7, dernier = new Date(annee, m + 1, 0).getDate();
function vide() { var v = document.createElement('span'); v.className = 'dispo__j dispo__j--vide'; return v; }
for (var i = 0; i < vides; i++) g.appendChild(vide());
for (var j = 1; j <= dernier; j++) g.appendChild(caseJour(new Date(annee, m, j), false));
var reste = (7 - (vides + dernier) % 7) % 7;
for (var k = 1; k <= reste; k++) g.appendChild(avecSuite ? caseJour(new Date(annee, m + 1, k), true) : vide());
bloc1.appendChild(g);
return bloc1;
}
var REPLIER_AU_DELA = 6, listeOuverte = false;
function prixCase(lg) {
var s = debut ? lg.saisonDe(debut) : null, p = s && s.nuit ? s.nuit : lg.prix, des = !(s && s.nuit) && lg.saison;
return ES ? (des ? 'desde ' : '') + p + ' € por noche' : EN ? (des ? 'from ' : '') + '€' + p + ' a night' : (des ? 'dès ' : '') + p + ' € la nuit';
}
function listeLogements() {
var f = document.createElement('fieldset'), l = document.createElement('div');
f.className = 'dispo__logements';
f.innerHTML = '<legend>' + MOTS.question + '</legend>';
l.className = 'dispo__liste';
logements.forEach(function (lg) {
var oui = !!choix[lg.nom], dispo = !(debut && fin) || libreSur(lg, debut, fin), b = document.createElement('button');
b.type = 'button'; b.className = 'dispo__logement'; b.setAttribute('aria-pressed', oui); b.setAttribute('data-cle', 'l' + lg.nom);
b.innerHTML = '<span class="dispo__case" aria-hidden="true">' + (oui ? '✓' : '') + '</span><span><b>' + lg.html + '</b>'
+ '<span class="dispo__faits">' + lg.cap + '</span><span class="dispo__faits">' + prixCase(lg) + '</span>'
+ (debut && fin ? '<span class="dispo__etat' + (dispo ? '' : ' dispo__etat--non') + '">' + (dispo ? (ES ? 'libre ✓' : EN ? 'free ✓' : 'libre ✓') : (ES ? 'no disponible' : EN ? 'booked' : 'prise')) + '</span>' : '') + '</span>';
b.addEventListener('click', function () { basculer(lg.nom); });
l.appendChild(b);
});
f.appendChild(l);
if (logements.length <= REPLIER_AU_DELA) return f;
var d = document.createElement('details'), s = document.createElement('summary');
d.className = 'dispo__repli'; d.open = listeOuverte;
s.innerHTML = mot('replier', logements.length); s.setAttribute('data-cle', 'repli');
f.hidden = !listeOuverte;
d.appendChild(s); d.appendChild(f);
d.addEventListener('toggle', function () { listeOuverte = d.open; f.hidden = !d.open; });
return d;
}
var guide = document.createElement('p');
guide.className = 'dispo__guide'; guide.setAttribute('aria-live', 'polite'); guide.setAttribute('tabindex', '-1');
function cleFocus() {
var a = document.activeElement;
return a && a !== document.body && (grille.contains(a) || recap.contains(a)) ? (a.getAttribute('data-cle') || 'guide') : null;
}
function rendreFocus(cle) {
if (!cle) return;
var cible = cle === 'guide' ? null : bloc.querySelector('[data-cle="' + cle.replace(/"/g, '\\"') + '"]');
((cible && !cible.disabled) ? cible : guide).focus({ preventScroll: true });
}
var annonce = document.createElement('p');
annonce.className = 'dispo__annonce'; annonce.setAttribute('aria-live', 'polite');
function regleSaison() {
if (semaineDe(debut)) return ES ? ', estancias por semanas en esta época' : EN ? ', weekly stays at this time of year' : ', à la semaine à cette période';
var m = minDe(debut);
return m > o.min ? (ES ? ', ' + nNuits(m) + ' como mínimo en esta época' : EN ? ', ' + nNuits(m) + ' minimum at this time of year' : ', ' + nNuits(m) + ' au moins à cette période') : '';
}
function rendre() {
var n = mq.matches ? 1 : 2, avant = cleFocus();
if (decalage > MAX_MOIS - n + 1) decalage = MAX_MOIS - n + 1;
var base = new Date(auj.getFullYear(), auj.getMonth() + decalage, 1), ch = choisis().map(function (l) { return l.html; });
var fin1 = new Date(base.getFullYear(), base.getMonth() + n, 0), finVue = n === 1 ? plus(fin1, (7 - fin1.getDay()) % 7) : fin1;
var vu = function (d) { return d && d >= base && d <= finVue; };
if (!vu(foyer)) foyer = vu(debut) ? debut : vu(auj) ? auj : base;
Array.prototype.slice.call(grille.childNodes).forEach(function (x) { if (x !== guide && x !== annonce) grille.removeChild(x); });
if (plusieurs) grille.insertBefore(listeLogements(), grille.firstChild);
var pour = '';
if (plusieurs && ES) pour = ch.length ? ' Los días libres son aquellos en que ' + (!o.mots ? (ch.length > 1 ? 'las habitaciones ' : 'la habitación ') : '') + liste(ch) + (ch.length > 1 ? ' están libres.' : ' está libre.') : ' ' + MOTS.sans_choix;
else if (plusieurs && EN) pour = ch.length ? ' Free days are those when ' + liste(ch) + (ch.length > 1 ? ' are free.' : ' is free.') : ' ' + MOTS.sans_choix;
else if (plusieurs) pour = ch.length ? ' Les jours libres sont ceux où ' + (!o.mots ? (ch.length > 1 ? 'les chambres ' : 'la chambre ') : '') + liste(ch) + (ch.length > 1 ? ' sont libres.' : ' est libre.') : ' ' + MOTS.sans_choix;
if (message) guide.textContent = message;
else if (ES && !debut) guide.innerHTML = '<b>1.</b> Toque su día de llegada.' + pour;
else if (ES && !fin) guide.innerHTML = 'Llegada el <b>' + long(debut) + '</b>' + regleSaison() + '. <b>2.</b> Toque su día de salida' + (n === 1 ? ' (flecha › para el mes siguiente).' : '.');
else if (ES) guide.innerHTML = '<b>' + nNuits(nuits(debut, fin)) + '</b> del ' + long(debut) + ' al ' + long(fin) + '. ' + (plusieurs && !ch.length ? MOTS.choisir : 'Estas fechas están libres.');
else if (EN && !debut) guide.innerHTML = '<b>1.</b> Tap your arrival day.' + pour;
else if (EN && !fin) guide.innerHTML = 'Arrival on <b>' + long(debut) + '</b>' + regleSaison() + '. <b>2.</b> Tap your departure day' + (n === 1 ? ' (arrow › for the next month).' : '.');
else if (EN) guide.innerHTML = '<b>' + nNuits(nuits(debut, fin)) + '</b> from ' + long(debut) + ' to ' + long(fin) + '. ' + (plusieurs && !ch.length ? MOTS.choisir : 'These dates are free.');
else if (!debut) guide.innerHTML = '<b>1.</b> Touchez votre jour d’arrivée.' + pour;
else if (!fin) guide.innerHTML = 'Arrivée le <b>' + long(debut) + '</b>' + regleSaison() + '. <b>2.</b> Touchez votre jour de départ' + (n === 1 ? ' (flèche › pour le mois suivant).' : '.');
else guide.innerHTML = '<b>' + nNuits(nuits(debut, fin)) + '</b> du ' + long(debut) + ' au ' + long(fin) + '. ' + (plusieurs && !ch.length ? MOTS.choisir : 'Ces dates sont libres.');
if (!message && debut && fin && ch.length > 1 && o.reunis && o.reunis.length && o.reunis_texte) {
for (var x = debut; x < fin; x = plus(x, 1)) if (!o.reunis.some(function (p) { return dans(x, p[0], p[1]); })) { guide.appendChild(document.createTextNode(' ' + o.reunis_texte)); break; }
}
if (guide.parentNode !== grille) grille.appendChild(guide);
var nav = document.createElement('div'), prec = document.createElement('button'), suiv = document.createElement('button'), nom = document.createElement('p');
nav.className = 'dispo__nav';
prec.type = suiv.type = 'button'; prec.textContent = '‹'; suiv.textContent = '›';
prec.setAttribute('aria-label', ES ? 'Mes anterior' : EN ? 'Previous month' : 'Mois précédent'); suiv.setAttribute('aria-label', ES ? 'Mes siguiente' : EN ? 'Next month' : 'Mois suivant');
prec.setAttribute('data-cle', 'precedent'); suiv.setAttribute('data-cle', 'suivant');
prec.disabled = decalage === 0; suiv.disabled = decalage >= MAX_MOIS - n + 1;
prec.addEventListener('click', function () { decalage--; rendre(); });
suiv.addEventListener('click', function () { decalage++; rendre(); });
nom.className = 'dispo__nom'; nom.textContent = n === 1 ? nomMois(base) : '';
nav.appendChild(prec); nav.appendChild(nom); nav.appendChild(suiv);
grille.appendChild(nav);
var zone = document.createElement('div');
zone.className = 'dispo__mois';
for (var i = 0; i < n; i++) {
var d = new Date(base.getFullYear(), base.getMonth() + i, 1), col = document.createElement('div');
if (n === 2) { var t = document.createElement('p'); t.className = 'dispo__nom'; t.textContent = nomMois(d); col.appendChild(t); }
col.appendChild(unMois(d.getFullYear(), d.getMonth(), n === 1));
zone.appendChild(col);
}
grille.appendChild(zone);
var vus = n === 1 ? nomMois(base) : liste([nomMois(base), nomMois(new Date(base.getFullYear(), base.getMonth() + 1, 1))]);
if (annonce.textContent !== vus) annonce.textContent = vus;
if (annonce.parentNode !== grille) grille.appendChild(annonce);
rendreRecap();
rendreFocus(avant);
}
function synchroniser() {
if (debut && fin) { champA.value = iso(debut); champD.value = iso(fin); ecrit = true; }
else if (ecrit) { champA.value = champD.value = ''; ecrit = false; }
if (plusieurs) document.querySelectorAll('input[name="chambre"], input[name="gite"]').forEach(function (c) { c.checked = c.value === '?' ? !choisis().length : !!choix[c.value]; });
document.querySelectorAll('.barre a[href="#reserver"]').forEach(function (a) {
if (debut && fin) a.setAttribute('aria-label', ES ? 'Reservar del ' + long(debut) + ' al ' + long(fin) : EN ? 'Book from ' + long(debut) + ' to ' + long(fin) : 'Réserver du ' + long(debut) + ' au ' + long(fin));
else a.removeAttribute('aria-label');
});
}
function prixSejour(l) {
var parNuit = [], parSemaine = [];
for (var x = debut; x < fin; x = plus(x, 1)) {
var s = l.saisonDe(x);
if (s && s.nuit) parNuit.push(s.nuit); else if (s && s.sem) parSemaine.push(s.sem); else if (l.prix) parNuit.push(l.prix);
}
return parNuit.length ? { nuit: Math.min.apply(null, parNuit) } : parSemaine.length ? { semaine: Math.min.apply(null, parSemaine) } : { nuit: l.prix };
}
function phrasePrix(ch, nb) {
var parNuit = ch.reduce(function (s, l) { return s + l.prix; }, 0);
if (ch.some(function (l) { return l.saison; })) {
var p = ch.map(prixSejour);
if (p.every(function (x) { return x.semaine; })) {
var sem = p.reduce(function (s, x) { return s + x.semaine; }, 0);
if (ES) return 'Desde ' + euros(sem) + ' la semana según la temporada, más tasa turística.' + (o.tarifs ? ' <a href="' + o.tarifs + '">Ver las tarifas</a>' : '');
if (EN) return 'From ' + euros(sem) + ' a week depending on the season, plus tourist tax.' + (o.tarifs ? ' <a href="' + o.tarifs + '">See our prices</a>' : '');
return 'Dès ' + euros(sem) + ' la semaine selon la saison, taxe de séjour en plus.'
+ (o.tarifs ? ' <a href="' + o.tarifs + '">Voir les tarifs</a>' : '');
}
parNuit = p.reduce(function (s, x, i) { return s + (x.nuit || ch[i].prix); }, 0);
if (ES) return 'Desde ' + euros(parNuit) + ' por noche según la temporada, más tasa turística.' + (o.tarifs ? ' <a href="' + o.tarifs + '">Ver las tarifas</a>' : '');
if (EN) return 'From ' + euros(parNuit) + ' a night depending on the season, plus tourist tax.' + (o.tarifs ? ' <a href="' + o.tarifs + '">See our prices</a>' : '');
return 'Dès ' + euros(parNuit) + ' la nuit selon la saison, taxe de séjour en plus.'
+ (o.tarifs ? ' <a href="' + o.tarifs + '">Voir les tarifs</a>' : '');
}
if (ES) return 'Aproximadamente ' + euros(nb * parNuit) + ' (' + nb + ' × ' + parNuit.toLocaleString('es-ES') + '\u00a0€), más tasa turística';
if (EN) return 'About ' + euros(nb * parNuit) + ' (' + nb + ' × €' + parNuit.toLocaleString('en-GB') + '), plus tourist tax';
return 'Environ ' + (nb * parNuit).toLocaleString('fr-FR') + ' € (' + nb + ' × ' + parNuit + ' €), taxe de séjour en plus';
}
function rendreRecap() {
var ch = plusieurs ? choisis() : logements;
if (debut && fin && ES) {
var nbEs = nuits(debut, fin);
recap.innerHTML = '<p class="dispo__dates">Del ' + court(debut) + ' al ' + court(fin) + ' · ' + nNuits(nbEs) + '</p>'
+ (plusieurs && ch.length ? '<p class="dispo__prix"><b>' + ch.map(function (l) { return l.html; }).join(' + ') + '</b></p>' : '')
+ '<p class="dispo__prix">' + (ch.length ? phrasePrix(ch, nbEs)
: 'Libres en sus fechas: ' + liste(logements.filter(function (l) { return libreSur(l, debut, fin); }).map(function (l) { return l.html; })) + '.') + '</p>'
+ '<button type="button" class="' + o.bouton + '" data-reserver-dates data-cle="reserver">' + (plusieurs && ch.length > 1 ? mot('reserver', ch.length) : 'Reservar estas fechas') + '</button>'
+ '<p class="dispo__rassure">Nada que pagar ahora: le responderemos ' + o.reponse + ' para confirmar.</p>'
+ '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Cambiar de fechas</button>';
} else if (ES) {
recap.innerHTML = '<p class="dispo__dates">' + (debut ? 'Llegada el ' + court(debut) + ', ¿y la salida?' : 'Elija sus fechas') + '</p>'
+ '<p class="dispo__prix">' + (debut ? 'Toque el día de salida en el calendario.' : 'En el calendario, toque el día de llegada y después el día de salida.') + '</p>'
+ '<p class="dispo__ecrire">¿Aún no tiene fijadas sus fechas? <a href="#contact">Escríbanos</a></p>'
+ (debut ? '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Cambiar de fechas</button>' : '');
} else if (debut && fin && EN) {
var nbEn = nuits(debut, fin);
recap.innerHTML = '<p class="dispo__dates">From ' + court(debut) + ' to ' + court(fin) + ' · ' + nNuits(nbEn) + '</p>'
+ (plusieurs && ch.length ? '<p class="dispo__prix"><b>' + ch.map(function (l) { return l.html; }).join(' + ') + '</b></p>' : '')
+ '<p class="dispo__prix">' + (ch.length ? phrasePrix(ch, nbEn)
: 'Free on your dates: ' + liste(logements.filter(function (l) { return libreSur(l, debut, fin); }).map(function (l) { return l.html; })) + '.') + '</p>'
+ '<button type="button" class="' + o.bouton + '" data-reserver-dates data-cle="reserver">' + (plusieurs && ch.length > 1 ? mot('reserver', ch.length) : 'Book these dates') + '</button>'
+ '<p class="dispo__rassure">Nothing to pay now: we will reply ' + o.reponse + ' to confirm.</p>'
+ '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Change dates</button>';
} else if (EN) {
recap.innerHTML = '<p class="dispo__dates">' + (debut ? 'Arrival on ' + court(debut) + ', and departure?' : 'Choose your dates') + '</p>'
+ '<p class="dispo__prix">' + (debut ? 'Tap the departure day in the calendar.' : 'In the calendar, tap the arrival day, then the departure day.') + '</p>'
+ '<p class="dispo__ecrire">Dates not fixed yet? <a href="#contact">Write to us</a></p>'
+ (debut ? '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Change dates</button>' : '');
} else if (debut && fin) {
var nb = nuits(debut, fin);
recap.innerHTML = '<p class="dispo__dates">Du ' + court(debut) + ' au ' + court(fin) + ' · ' + nNuits(nb) + '</p>'
+ (plusieurs && ch.length ? '<p class="dispo__prix"><b>' + ch.map(function (l) { return l.html; }).join(' + ') + '</b></p>' : '')
+ '<p class="dispo__prix">' + (ch.length ? phrasePrix(ch, nb)
: 'Libres à vos dates : ' + liste(logements.filter(function (l) { return libreSur(l, debut, fin); }).map(function (l) { return l.html; })) + '.') + '</p>'
+ '<button type="button" class="' + o.bouton + '" data-reserver-dates data-cle="reserver">' + (plusieurs && ch.length > 1 ? mot('reserver', ch.length) : 'Réserver ces dates') + '</button>'
+ '<p class="dispo__rassure">Rien à payer maintenant : nous vous répondons ' + o.reponse + ' pour confirmer.</p>'
+ '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Changer de dates</button>';
} else {
recap.innerHTML = '<p class="dispo__dates">' + (debut ? 'Arrivée le ' + court(debut) + ', et le départ&#8239;?' : 'Choisissez vos dates') + '</p>'
+ '<p class="dispo__prix">' + (debut ? 'Touchez le jour de départ dans le calendrier.' : 'Dans le calendrier, touchez le jour d’arrivée puis le jour de départ.') + '</p>'
+ '<p class="dispo__ecrire">Vos dates ne sont pas encore fixées&#8239;? <a href="#contact">Écrivez-nous</a></p>'
+ (debut ? '<button type="button" class="dispo__effacer" data-effacer data-cle="effacer">Changer de dates</button>' : '');
}
var r = recap.querySelector('[data-reserver-dates]'), e = recap.querySelector('[data-effacer]');
if (r) r.addEventListener('click', function () {
synchroniser();
annoncer();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) [champA, champD].forEach(function (c) { c.classList.remove('dispo-eclat'); void c.offsetWidth; c.classList.add('dispo-eclat'); });
var ouvreur = document.querySelector('[data-ouvrir-formulaire]');
if (ouvreur) ouvreur.click();
});
if (e) e.addEventListener('click', function () { debut = fin = null; message = ''; rendre(); });
synchroniser();
}
(mq.addEventListener ? mq.addEventListener('change', rendre) : mq.addListener(rendre));
function annoncer() { document.dispatchEvent(new CustomEvent('site:calendrier')); }
function jourDe(v) { var a = v.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); }
window.siteCalendrier = {
pret: !o.api,
libre: function (noms, arrivee, depart) {
var a = jourDe(arrivee), b = jourDe(depart);
var vises = logements.filter(function (l) { return noms.indexOf(l.nom) >= 0; });
if (vises.length) return vises.every(function (l) { return reserveSur(l, a, b); });
return logements.some(function (l) { return reserveSur(l, a, b); });
}
};
function indisponible() {
window.siteCalendrier.pret = false;
bloc.removeAttribute('aria-busy');
grille.innerHTML = ES ? '<p class="dispo__guide" role="status">Por el momento no se puede mostrar la disponibilidad: indíquenos sus fechas.</p>'
: EN ? '<p class="dispo__guide" role="status">Availability cannot be shown at the moment: send us your dates.</p>'
: '<p class="dispo__guide" role="status">Disponibilités momentanément indisponibles&#8239;: proposez-nous vos dates.</p>';
recap.innerHTML = '';
var verif = bloc.querySelector('.dispo__verif');
if (verif) verif.hidden = true;
}
function lire(r) { if (!r.ok) throw new Error('dispos'); return r.json(); }
if (o.api) {
bloc.setAttribute('aria-busy', 'true');
fetch(o.api, { headers: { accept: 'application/json' } })
.then(function (r) { return r.status === 404 ? fetch('/disponibilites.json').then(lire) : lire(r); })
.then(function (d) {
var tous = logements.every(function (l) {
var x = d && d.logements && d.logements[l.id];
return x && (x.etat === undefined || x.etat === 'ok') && Array.isArray(x.pris);
});
if (!tous) throw new Error('dispos');
logements.forEach(function (l) { remplir(l, d.logements[l.id].pris); });
var verif = bloc.querySelector('.dispo__verif');
if (verif && !d.verifie_a) verif.hidden = true;
else if (verif && o.verifie) {
verif.textContent = o.verifie.replace('{n}', Math.max(1, Math.round((Date.now() - Date.parse(d.verifie_a)) / 6e4)));
verif.hidden = false;
}
bloc.removeAttribute('aria-busy');
window.siteCalendrier.pret = true;
rendre();
annoncer();
})
.catch(indisponible);
} else {
rendre();
}
} catch (e) { console.error('calendrier.js', e); }
})();
(function () {
try {
var sec = document.querySelector('[data-galerie]'), d = document.getElementById('visionneuse');
if (!sec || !d || !d.showModal) return;
var photos = JSON.parse(sec.getAttribute('data-galerie')), i = 0, retour = null, avif = null;
var img = d.querySelector('img'), leg = d.querySelector('figcaption'), compte = d.querySelector('.visionneuse__compte');
leg.setAttribute('aria-live', 'polite');
var cadre = document.createElement('picture'), sA = document.createElement('source'), sW = document.createElement('source');
sA.type = 'image/avif'; sW.type = 'image/webp'; sA.sizes = sW.sizes = img.sizes = '100vw'; cadre.style.display = 'contents';
img.parentNode.insertBefore(cadre, img); cadre.appendChild(sA); cadre.appendChild(sW); cadre.appendChild(img);
function estLaBonne() {
var vu = (img.currentSrc || '').split('/').pop(), n = photos[i].src.split('/').pop().replace(/[.]jpe?g$/, '');
return vu === n + '.jpg' || (vu.indexOf(n + '-') === 0 && /^[0-9]+[.](avif|webp)$/.test(vu.slice(n.length + 1)));
}
img.addEventListener('load', function () {
if (!estLaBonne()) return;
img.style.visibility = '';
if (avif === null) avif = /[.]avif$/.test(img.currentSrc);
});
img.addEventListener('error', function () { img.style.visibility = ''; });
function montrer() {
var p = photos[i], s = photos[(i + 1) % photos.length];
img.style.visibility = 'hidden';
sA.srcset = p.avif || ''; sW.srcset = p.webp || '';
img.src = p.src; img.alt = p.legende ? '' : (p.alt || ''); leg.textContent = p.legende;
compte.textContent = (i + 1) + ' / ' + photos.length;
if (avif !== null && s !== p) { var pre = new Image(); pre.sizes = '100vw'; pre.srcset = (avif ? s.avif : s.webp) || s.src; }
}
function aller(k) { i = (i + k + photos.length) % photos.length; montrer(); }
document.querySelectorAll('[data-i]').forEach(function (b) {
var ouvrir = function () { retour = b; i = +b.getAttribute('data-i'); montrer(); d.showModal(); };
b.addEventListener('click', ouvrir);
if (b.tagName !== 'BUTTON') b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
});
d.querySelectorAll('[data-pas]').forEach(function (b) { b.addEventListener('click', function () { aller(+b.getAttribute('data-pas')); }); });
d.querySelector('[data-fermer]').addEventListener('click', function () { d.close(); });
d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
d.addEventListener('keydown', function (e) {
if (e.key === 'ArrowRight') { e.preventDefault(); aller(1); }
else if (e.key === 'ArrowLeft') { e.preventDefault(); aller(-1); }
});
var x0 = null;
d.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
d.addEventListener('pointerup', function (e) {
if (x0 === null) return;
var dx = e.clientX - x0; x0 = null;
if (Math.abs(dx) > 50) aller(dx < 0 ? 1 : -1);
});
d.addEventListener('close', function () { if (retour) setTimeout(function () { retour.focus(); }, 0); });
} catch (e) { console.error('galerie.js', e); }
})();
(function () {
try {
var cadres = document.querySelectorAll('[data-video]');
if (!cadres.length) return;
var ATTENTE = 8000;
var joignable = function (adresse) {
if (!window.fetch || !window.Promise) return null;
return new Promise(function (ok, echec) {
var minuterie = setTimeout(echec, ATTENTE);
fetch(adresse, { mode: 'no-cors', credentials: 'omit', cache: 'no-store' })
.then(function () { clearTimeout(minuterie); ok(); }, function () { clearTimeout(minuterie); echec(); });
});
};
cadres.forEach(function (c) {
var lien = c.querySelector('.lg-video__lire');
if (!lien) return;
var poser = function () {
var f = document.createElement('iframe');
f.src = c.getAttribute('data-video');
f.title = c.getAttribute('data-titre') || '';
f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
f.setAttribute('allowfullscreen', '');
c.classList.add('lg-video--lue');
while (c.firstChild) c.removeChild(c.firstChild);
c.appendChild(f);
f.focus();
};
var panne = function () {
c.classList.remove('lg-video--attente');
c.classList.add('lg-video--panne');
lien.removeAttribute('aria-label');
lien.removeAttribute('aria-busy');
};
lien.addEventListener('click', function (e) {
if (c.classList.contains('lg-video--panne')) return;
e.preventDefault();
if (c.classList.contains('lg-video--attente')) return;
var essai = joignable(c.getAttribute('data-video'));
if (!essai) { poser(); return; }
c.classList.add('lg-video--attente');
lien.setAttribute('aria-busy', 'true');
essai.then(poser, panne);
});
});
} catch (e) { console.error('video.js', e); }
})();
(function () {
try {
var EN = document.documentElement.lang === 'en', ES = document.documentElement.lang === 'es';
[['[data-equip]', '[data-equip-bouton]', ES ? 'Ocultar los servicios' : EN ? 'Hide the amenities' : 'Masquer les équipements'],
['[data-tarifs]', '[data-tarifs-bouton]', ES ? 'Ocultar lo incluido y los extras' : EN ? 'Hide what’s included and extras' : 'Masquer compris et options']].forEach(function (r) {
var sec = document.querySelector(r[0]);
var b = sec && sec.querySelector(r[1]);
if (!b) return;
var ouvrir = b.textContent;
sec.classList.add('repliable');
b.addEventListener('click', function () {
var ouvert = b.getAttribute('aria-expanded') === 'true';
b.setAttribute('aria-expanded', String(!ouvert));
b.textContent = ouvert ? ouvrir : r[2];
});
});
} catch (e) { console.error('repliables.js', e); }
})();
(function () {
try {
var d = document.getElementById('rg-visio');
if (!d || !d.showModal) return;
var img = d.querySelector('img'), attendu = '';
var cadre = document.createElement('picture'), sA = document.createElement('source'), sW = document.createElement('source');
sA.type = 'image/avif'; sW.type = 'image/webp'; sA.sizes = sW.sizes = img.sizes = '94vw'; cadre.style.display = 'contents';
img.parentNode.insertBefore(cadre, img); cadre.appendChild(sA); cadre.appendChild(sW); cadre.appendChild(img);
img.addEventListener('load', function () {
var vu = (img.currentSrc || '').split('/').pop();
if (vu === attendu + '.jpg' || (vu.indexOf(attendu + '-') === 0 && /^[0-9]+[.](avif|webp)$/.test(vu.slice(attendu.length + 1)))) img.style.visibility = '';
});
img.addEventListener('error', function () { img.style.visibility = ''; });
document.addEventListener('click', function (e) {
var b = e.target.closest('.rg-photo');
if (!b) return;
var g = b.getAttribute('data-grand');
attendu = g.split('/').pop().replace(/[.]jpe?g$/, '');
img.style.visibility = 'hidden';
sA.srcset = b.getAttribute('data-grand-avif') || ''; sW.srcset = b.getAttribute('data-grand-webp') || '';
img.src = g;
img.alt = b.getAttribute('data-legende');
var c = b.getAttribute('data-credit');
d.querySelector('figcaption').textContent = b.getAttribute('data-legende') + (c ? ' · ' + c : '');
d.showModal();
});
d.addEventListener('click', function (e) { if (e.target === d || e.target.hasAttribute('data-fermer')) d.close(); });
} catch (e) { console.error('region.js', e); }
})();
(function () {
try {
var f = document.querySelector('[data-gp-form]');
if (!f) return;
var o = new URLSearchParams(location.search).get('occasion'), s = document.getElementById('gp-occasion');
if (o && s) [].forEach.call(s.options, function (x) { if (x.text === o) s.value = x.value || x.text; });
var C = {};
try { C = JSON.parse(f.getAttribute('data-controles') || '{}'); } catch (x) { C = {}; }
function nomDe(c) {
if (C.manque && C.manque[c.name]) return C.manque[c.name];
var l = c.closest('label'), n = l && l.firstChild;
var t = ((n && n.nodeType === 3 ? n.textContent : c.name) || '').split(',')[0].trim();
return t.charAt(0).toLowerCase() + t.slice(1);
}
function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
var champA = f.querySelector('#gp-arrivee'), champD = f.querySelector('#gp-depart'), champP = f.querySelector('#gp-personnes');
var trop = f.querySelector('#gp-trop');
if (champA) champA.min = aujourdhui();
if (champA && champD) champA.addEventListener('change', function () { if (champA.value) champD.min = champA.value; });
function avertir() {
if (!trop || !champP || !C.capacite || !C.trop) return;
var plus = +champP.value > C.capacite;
trop.textContent = plus ? C.trop : ''; trop.hidden = !plus;
}
if (champP) { champP.addEventListener('input', avertir); champP.addEventListener('change', avertir); }
var EN = /^en/i.test(document.documentElement.lang), ES = /^es/i.test(document.documentElement.lang);
var AVIS = ES ? { tout: 'Estas fechas quedan fuera de nuestro periodo de apertura.', partie: 'Una parte de su estancia queda fuera de nuestro periodo de apertura.',
duree: 'En estas fechas, las estancias son de {min} noches como mínimo, y su solicitud es de {n}.', envoyer: 'Aun así, puede enviar su solicitud.' }
: EN ? { tout: 'These dates fall outside our opening period.', partie: 'Part of your stay falls outside our opening period.',
duree: 'On these dates, stays are {min} nights minimum, and your request is for {n}.', envoyer: 'You can still send your request.' }
: { tout: 'Ces dates tombent en dehors de notre période d’ouverture.', partie: 'Une partie de votre séjour tombe en dehors de notre période d’ouverture.',
duree: 'À ces dates, les séjours sont de {min} nuits au moins, et votre demande porte sur {n}.', envoyer: 'Vous pouvez quand même envoyer votre demande.' };
var reglages = null, zoneP = null;
function dansP(j, p) { var x = j.slice(5); return p.du <= p.au ? x >= p.du && x <= p.au : x >= p.du || x <= p.au; }
function lendemainIso(v) { var a = v.split('-'), d = new Date(Date.UTC(+a[0], +a[1] - 1, +a[2] + 1)); return d.toISOString().slice(0, 10); }
function avertirPeriode() {
if (!zoneP) return;
var a = champA && champA.value, d = champD && champD.value, lignes = [];
if (a && d && d > a && a >= aujourdhui()) {
var total = 0, fermees = 0, hors = 0, ouv = reglages && reglages.ouverture, per = Array.isArray(C.periodes) && C.periodes.length ? C.periodes : null;
for (var j = a; j < d && total < 400; j = lendemainIso(j)) {
total++;
if (ouv && ouv.length && !ouv.some(function (p) { return dansP(j, p); })) fermees++;
if (per && !per.some(function (p) { return dansP(j, p); })) hors++;
}
if (fermees) lignes.push(fermees === total ? AVIS.tout : AVIS.partie);
else if (hors && C.hors_periodes) lignes.push(C.hors_periodes);
var mins = ((reglages && reglages.logements) || []).map(function (l) {
var r = l.regles || {}, s = (r.saisons || []).filter(function (x) { return dansP(a, x); })[0] || {};
return s.nuits_min || r.nuits_min || 1;
});
var min = Math.max.apply(null, mins.concat([+C.nuits_min || 1]));
if (!fermees && total < min) lignes.push(AVIS.duree.replace('{min}', min).replace('{n}', total));
}
var texte = lignes.length ? lignes.join(' ') + ' ' + AVIS.envoyer : '';
if (zoneP.textContent !== texte) zoneP.textContent = texte;
zoneP.hidden = !texte;
}
if (champA && champD) {
zoneP = document.createElement('span');
zoneP.className = 'gp-form__avis'; zoneP.id = 'gp-periode'; zoneP.hidden = true; zoneP.setAttribute('aria-live', 'polite');
champD.parentNode.appendChild(zoneP);
[champA, champD].forEach(function (c) { var x = c.getAttribute('aria-describedby'); c.setAttribute('aria-describedby', (x ? x + ' ' : '') + 'gp-periode'); });
[champA, champD].forEach(function (c) { c.addEventListener('change', avertirPeriode); });
fetch('/config-site.json', { headers: { accept: 'application/json' } })
.then(function (r) { if (!r.ok) throw new Error('reglages'); return r.json(); })
.then(function (c) { reglages = c; avertirPeriode(); })
.catch(function () { avertirPeriode(); });
}
f.addEventListener('submit', function (e) {
e.preventDefault();
var noms = [], phrases = [];
f.querySelectorAll('[required]').forEach(function (c) { c.removeAttribute('aria-invalid'); });
var err = f.querySelector('.gp-form__erreur');
err.id = err.id || 'gp-erreur';
f.querySelectorAll('[aria-describedby~="' + err.id + '"]').forEach(function (c) {
var x = c.getAttribute('aria-describedby').split(' ').filter(function (v) { return v && v !== err.id; }).join(' ');
if (x) c.setAttribute('aria-describedby', x); else c.removeAttribute('aria-describedby');
});
f.querySelectorAll('[required]').forEach(function (c) {
if (!c.value) { c.setAttribute('aria-invalid', 'true'); noms.push(nomDe(c)); }
else if (c.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.value)) { c.setAttribute('aria-invalid', 'true'); phrases.push(C.form_courriel || nomDe(c)); }
});
if (champA && champA.value && champA.value < aujourdhui()) { champA.setAttribute('aria-invalid', 'true'); if (C.form_arrivee_passee) phrases.push(C.form_arrivee_passee); }
if (champA && champD && champA.value && champD.value && champD.value <= champA.value) { champD.setAttribute('aria-invalid', 'true'); if (C.form_depart_avant) phrases.push(C.form_depart_avant); }
if (!err.hasAttribute('data-debut')) err.setAttribute('data-debut', err.textContent.trim());
if (noms.length || phrases.length) {
f.querySelectorAll('[aria-invalid="true"]').forEach(function (c) { var x = c.getAttribute('aria-describedby'); c.setAttribute('aria-describedby', (x ? x + ' ' : '') + err.id); });
err.textContent = ((noms.length ? err.getAttribute('data-debut') + ' ' + noms.join(', ') + '. ' : '') + phrases.join(' ')).trim();
err.hidden = false; var p = f.querySelector('[aria-invalid="true"]'); if (p) p.focus(); return;
}
err.hidden = true;
if (f.getAttribute('action')) { (window.siteEnvoi || function (x) { x.submit(); })(f); return; }
location.href = f.getAttribute('data-merci');
});
} catch (e) { console.error('groupes.js', e); }
})();
(function () {
try {
var f = document.querySelector('[data-kd-form]');
if (!f) return;
var bon = f.querySelector('#kd-bon'), m = f.querySelector('[data-kd-montant]'), mi = f.querySelector('#kd-montant');
function montant() {
if (!bon || !m || !mi) return;
var o = bon.options[bon.selectedIndex]; var libre = !!(o && o.hasAttribute('data-libre')); m.hidden = !libre; mi.required = libre;
}
if (bon) bon.addEventListener('change', montant);
montant();
document.querySelectorAll('[data-bon]').forEach(function (a) { a.addEventListener('click', function () { if (bon) { bon.value = a.getAttribute('data-bon'); montant(); } }); });
var d = new Date(), date = f.querySelector('#kd-date');
if (date) date.min = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
function manquants(f, err) {
if (!err.hasAttribute('data-debut')) err.setAttribute('data-debut', err.textContent.trim());
var noms = [];
f.querySelectorAll('[aria-invalid="true"]').forEach(function (c) {
var l = c.closest('label'), n = l && l.firstChild;
var t = ((n && n.nodeType === 3 ? n.textContent : c.name) || '').split(',')[0].trim();
if (t) noms.push(t.charAt(0).toLowerCase() + t.slice(1));
});
err.textContent = err.getAttribute('data-debut') + ' ' + noms.join(', ') + '.';
}
var RE_COURRIEL = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\]]{2,}$/;
var lang = document.documentElement.lang;
var COURRIEL_FAUX = lang === 'es' ? 'Su dirección de correo electrónico parece incompleta.' : lang === 'en' ? 'Your email address looks incomplete.' : 'Votre adresse électronique semble incomplète.';
f.addEventListener('submit', function (e) {
e.preventDefault();
var manque = false, bas = null, faux = null;
f.querySelectorAll('[required]').forEach(function (c) {
var faible = !!c.value && c.type === 'number' && +c.value < +c.min;
var mal = !!c.value && c.type === 'email' && !RE_COURRIEL.test(c.value.trim());
if (faible) { c.setAttribute('aria-invalid', 'true'); bas = c; }
else if (mal) { faux = c; c.removeAttribute('aria-invalid'); }
else if (!c.value) { c.setAttribute('aria-invalid', 'true'); manque = true; } else c.removeAttribute('aria-invalid');
});
var err = f.querySelector('.kd-form__erreur');
if (!err.hasAttribute('data-debut')) err.setAttribute('data-debut', err.textContent.trim());
err.id = err.id || 'kd-erreur';
f.querySelectorAll('[aria-describedby~="' + err.id + '"]').forEach(function (c) {
var x = c.getAttribute('aria-describedby').split(' ').filter(function (v) { return v && v !== err.id; }).join(' ');
if (x) c.setAttribute('aria-describedby', x); else c.removeAttribute('aria-describedby');
});
if (manque || bas || faux) {
if (bas) bas.removeAttribute('aria-invalid');
if (manque) manquants(f, err); else err.textContent = '';
if (bas) {
bas.setAttribute('aria-invalid', 'true');
var lb = bas.closest('label'), t = lb && lb.firstChild && lb.firstChild.nodeType === 3 ? lb.firstChild.textContent.trim() : '';
if (t) err.textContent = (err.textContent ? err.textContent + ' ' : '') + t + '.';
}
if (faux) { faux.setAttribute('aria-invalid', 'true'); err.textContent = (err.textContent ? err.textContent + ' ' : '') + COURRIEL_FAUX; }
f.querySelectorAll('[aria-invalid="true"]').forEach(function (c) { var x = c.getAttribute('aria-describedby'); c.setAttribute('aria-describedby', (x ? x + ' ' : '') + err.id); });
err.hidden = false; var p = f.querySelector('[aria-invalid="true"]'); if (p) p.focus(); return;
}
err.hidden = true;
if (f.getAttribute('action')) { (window.siteEnvoi || function (x) { x.submit(); })(f); return; }
location.href = f.getAttribute('data-merci');
});
} catch (e) { console.error('cadeaux.js', e); }
})();
(function () {
try {
var f = document.getElementById('avis-form');
if (!f) return;
function merci() {
var bloc = document.querySelector('.mr__texte-bloc');
bloc.innerHTML = document.getElementById('avis-merci').textContent;
window.scrollTo(0, 0);
}
if (/[?&]merci\b/.test(location.search)) { merci(); return; }
var EN = document.documentElement.lang === 'en', ES = document.documentElement.lang === 'es';
var MOIS = ES ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
: EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
var libre = document.getElementById('avis-mois');
if (libre && libre.tagName === 'INPUT') {
var liste = document.createElement('select');
liste.id = 'avis-mois'; liste.name = 'mois'; liste.required = true;
var h = ES ? '<option value="">Elegir el mes</option>' : EN ? '<option value="">Choose the month</option>' : '<option value="">Choisir le mois</option>', d = new Date();
var ouverts = (libre.getAttribute('data-ouverts') || '').split(',').filter(Boolean).map(Number);
for (var k = 0; k < 12; k++) {
var m = new Date(d.getFullYear(), d.getMonth() - k, 1), t = MOIS[m.getMonth()] + (ES ? ' de ' : ' ') + m.getFullYear();
if (ouverts.length && ouverts.indexOf(m.getMonth() + 1) < 0) continue;
h += '<option>' + (ES ? t : t.charAt(0).toUpperCase() + t.slice(1)) + '</option>';
}
liste.innerHTML = h; libre.replaceWith(liste);
}
var texte = f.querySelector('textarea'), compte = f.querySelector('.avis-compte');
var assez = false;
compte.setAttribute('aria-live', 'off');
var compter = function () {
var oui = texte.value.trim().length >= 40;
compte.setAttribute('aria-live', oui !== assez ? 'polite' : 'off');
assez = oui;
compte.textContent = texte.value.length + (ES ? ' de 500 caracteres, 40 como mínimo' : EN ? ' of 500 characters, at least 40' : ' sur 500 signes, 40 au moins');
};
texte.addEventListener('input', compter);
f.addEventListener('submit', function (ev) {
ev.preventDefault();
var manque = [], fautifs = [];
var marquer = function (c, ko) {
if (!c) return;
c.setAttribute('aria-invalid', ko ? 'true' : 'false');
var x = (c.getAttribute('aria-describedby') || '').split(' ').filter(function (v) { return v && v !== 'avis-erreur'; });
if (ko) { x.push('avis-erreur'); fautifs.push(c); }
if (x.length) c.setAttribute('aria-describedby', x.join(' ')); else c.removeAttribute('aria-describedby');
};
marquer(texte, texte.value.trim().length < 40);
marquer(f.elements.prenom, !f.elements.prenom.value.trim());
marquer(f.elements.initiale, !f.elements.initiale.value.trim());
marquer(f.elements.mois, !f.elements.mois.value);
marquer(f.elements.accord, !f.elements.accord.checked);
if (texte.value.trim().length < 40) manque.push(ES ? 'su opinión (40 caracteres como mínimo)' : EN ? 'your review (at least 40 characters)' : 'votre avis (40 signes au moins)');
if (!f.elements.prenom.value.trim()) manque.push(ES ? 'su nombre' : EN ? 'your first name' : 'votre prénom');
if (!f.elements.initiale.value.trim()) manque.push(ES ? 'la inicial de su apellido' : EN ? 'the initial of your surname' : 'l’initiale de votre nom');
if (!f.elements.mois.value) manque.push(ES ? 'el mes de su estancia' : EN ? 'the month of your stay' : 'le mois de votre séjour');
if (!f.elements.accord.checked) manque.push(ES ? 'su consentimiento para la publicación' : EN ? 'your consent to publication' : 'votre accord pour la publication');
var err = f.querySelector('.avis-erreur');
err.id = 'avis-erreur';
if (manque.length) { err.hidden = false; err.textContent = (ES ? (manque.length > 1 ? 'Faltan: ' : 'Falta: ') : EN ? 'Missing: ' : 'Il manque ') + manque.join(', ') + '.'; err.scrollIntoView({ block: 'center' }); if (fautifs[0]) fautifs[0].focus({ preventScroll: true }); return; }
if (f.getAttribute('action')) { (window.siteEnvoi || function (x) { x.submit(); })(f); return; }
merci();
});
} catch (e) { console.error('page-avis.js', e); }
})();
(function () {
try {
var somm = document.querySelector('[data-sommaire]');
if (!somm) return;
var petit = window.matchMedia('(max-width: 47.56125em)');
function regler() { if (petit.matches) somm.removeAttribute('open'); else somm.setAttribute('open', ''); }
regler();
if (petit.addEventListener) petit.addEventListener('change', regler);
somm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { if (petit.matches) somm.removeAttribute('open'); }); });
var liens = {}, rubs = document.querySelectorAll('.lp__rub');
somm.querySelectorAll('a').forEach(function (a) { liens[a.getAttribute('href').slice(1)] = a; });
if (!('IntersectionObserver' in window)) return;
var vus = {};
var obs = new IntersectionObserver(function (entrees) {
entrees.forEach(function (e) { vus[e.target.id] = e.isIntersecting; });
var courant = null;
for (var i = 0; i < rubs.length; i++) { if (vus[rubs[i].id]) { courant = rubs[i].id; break; } }
if (!courant) return;
Object.keys(liens).forEach(function (k) { if (k === courant) liens[k].setAttribute('aria-current', 'true'); else liens[k].removeAttribute('aria-current'); });
}, { rootMargin: '-120px 0px -55% 0px' });
rubs.forEach(function (r) { obs.observe(r); });
} catch (e) { console.error('sommaire.js', e); }
})();
/* Démo Soralva : l'envoi mène au remerciement, rien ne part. */
window.siteEnvoi = function (f) {
if (f.id === 'avis-form') { location.href = 'donnez-votre-avis.html?merci'; return; }
location.href = f.getAttribute('data-merci') || 'merci.html';
};
