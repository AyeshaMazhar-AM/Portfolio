// =========================================================
// Ayesha Mazhar — Portfolio JS
// =========================================================

document.documentElement.classList.add('js-enabled');

// ---- Footer year ----
document.querySelectorAll('#year').forEach(function(el){
  el.textContent = new Date().getFullYear();
});

// ---- Hero visual: subtle cursor-follow parallax ----
(function(){
  var visual = document.getElementById('heroVisual');
  if(!visual) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion || window.innerWidth < 900) return;

  var hero = document.getElementById('hero');
  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    visual.style.transform = 'translate(' + (x * 12) + 'px,' + (y * 12) + 'px)';
  });
  hero.addEventListener('mouseleave', function(){
    visual.style.transform = 'translate(0,0)';
  });
})();

// ---- Mobile nav toggle ----
(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(!toggle || !links) return;
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---- Scroll reveal: fade/slide elements in as they enter the viewport ----
(function(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function(el){ observer.observe(el); });
})();

// ---- Scroll-spy: highlight the nav link for the section in view ----
(function(){
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if(!sections.length || !navLinks.length) return;

  var map = {};
  navLinks.forEach(function(link){
    map[link.getAttribute('href').replace('#','')] = link;
  });

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = map[entry.target.id];
      if(!link) return;
      if(entry.isIntersecting){
        navLinks.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(function(s){ observer.observe(s); });
})();

// =========================================================
// Contact form
//
// SETUP (pick one — see README.md for full instructions):
//
// Option A — Google Apps Script (free, also appends each
// submission as a row in a Google Sheet and can email you):
//   1. Create a Google Sheet, add a script (Extensions > Apps Script)
//      using the snippet in README.md, deploy it as a Web App.
//   2. Paste the deployment URL below as CONTACT_ENDPOINT.
//
// Option B — Formspree (formspree.io):
//   1. Create a free form at formspree.io, copy its endpoint URL
//      (looks like https://formspree.io/f/xxxxxxx).
//   2. Paste it below as CONTACT_ENDPOINT.
//
// Until you set CONTACT_ENDPOINT, the form falls back to opening
// the visitor's email client with a pre-filled message — it still
// works, it's just one click less automatic.
// =========================================================
var CONTACT_ENDPOINT = "https://formspree.io/f/mqpklbez"; // already configured

(function(){
  var form = document.getElementById('contactForm');
  if(!form) return;

  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setStatus(msg, kind){
    statusEl.textContent = msg;
    statusEl.className = 'form-status mono' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    if(!data.name || !data.email || !data.subject || !data.message){
      setStatus('Please fill in every field before sending.', 'err');
      return;
    }

    // Fallback: no endpoint configured yet — open the email client instead.
    if(!CONTACT_ENDPOINT){
      var body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
      var mailto = 'mailto:ayeshamazhar332@gmail.com?subject=' +
        encodeURIComponent(data.subject) + '&body=' + body;
      window.location.href = mailto;
      setStatus('Opening your email app — contact form isn\u2019t connected to auto-send yet.', 'ok');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', '');

    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function(res){
        if(!res.ok) throw new Error('Request failed');
        setStatus('Message sent — thank you! I\u2019ll get back to you soon.', 'ok');
        form.reset();
      })
      .catch(function(){
        setStatus('Something went wrong sending that. Please email me directly instead.', 'err');
      })
      .finally(function(){
        submitBtn.disabled = false;
      });
  });
})();
