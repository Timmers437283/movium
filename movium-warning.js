/* Movium "no longer updated" warning
   Add this line right before </body> in index.html:
   <script src="movium-warning.js"></script>
*/
(function () {
  var css = `
#sunsetWarning{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);font-family:Arial,Helvetica,sans-serif;transition:opacity .45s ease,visibility 0s}
#sunsetWarning.hide{opacity:0;visibility:hidden;pointer-events:none;transition:opacity .45s ease,visibility 0s linear .45s}
#sunsetWarning *{box-sizing:border-box}
.sw-card{width:min(420px,100%);padding:34px 28px 28px;text-align:center;color:#f5f5f5;background:linear-gradient(180deg,#1a1a1a,#121212);border:1px solid #2c2c2c;border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.6);animation:swIn .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes swIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
.sw-badge{display:inline-block;margin-bottom:16px;padding:5px 11px;color:#ffb020;background:rgba(255,176,32,.1);border:1px solid rgba(255,176,32,.28);border-radius:99px;font-size:10px;font-weight:700;letter-spacing:1.8px}
.sw-card h2{margin:0 0 8px;font-size:22px;letter-spacing:-.6px;line-height:1.25}
.sw-card p{margin:0 0 26px;color:#9a9a9a;font-size:14px}
.sw-card p strong{color:#fff}
.sw-btn{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:46px;padding:0;border:0;border-radius:9px;font:inherit;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer;overflow:hidden;transition:background .2s ease,transform .15s ease,box-shadow .25s ease,width .35s ease,border-radius .35s ease}
.sw-btn:active:not(:disabled){transform:scale(.98)}
.sw-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}
.sw-primary{color:#111;background:#fff}
.sw-primary:hover{background:#e6e6e6;box-shadow:0 6px 20px rgba(255,255,255,.12)}
.sw-primary svg{width:16px;height:16px;transition:transform .2s ease}
.sw-primary:hover svg{transform:translateX(3px)}
.sw-agree{z-index:0;margin:10px auto 0;color:#fff;background:#202020;border:1px solid #353535}
.sw-agree::before{content:"";position:absolute;inset:0;z-index:-1;background:rgba(255,255,255,.12);transform:scaleX(0);transform-origin:left}
.sw-agree.counting::before{transform:scaleX(1);transition:transform 5s linear}
.sw-agree:disabled{color:#8a8a8a;cursor:not-allowed}
.sw-agree:hover:not(:disabled):not(.done){background:#2b2b2b}
.sw-agree.done{width:46px;background:#30d158;border-color:#30d158;border-radius:50%;color:#fff;cursor:default;box-shadow:0 0 0 0 rgba(48,209,88,.55);animation:swPulse .7s ease-out .25s both}
.sw-agree.done::before{display:none}
.sw-agree svg{width:22px;height:22px;stroke-dasharray:24;stroke-dashoffset:24;animation:swDraw .4s .3s ease forwards}
@keyframes swDraw{to{stroke-dashoffset:0}}
@keyframes swPulse{0%{box-shadow:0 0 0 0 rgba(48,209,88,.55);transform:scale(1)}40%{transform:scale(1.12)}100%{box-shadow:0 0 0 18px rgba(48,209,88,0);transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.sw-card,.sw-agree.done,.sw-agree svg{animation:none}.sw-agree svg{stroke-dashoffset:0}.sw-agree.counting::before{transition:none}}
`;

  var html = `
<div id="sunsetWarning" role="alertdialog" aria-modal="true" aria-labelledby="swTitle">
  <div class="sw-card">
    <span class="sw-badge">NOTICE</span>
    <h2 id="swTitle">This site is no longer being updated...</h2>
    <p>Because we have <strong>Movium 2!</strong></p>
    <a class="sw-btn sw-primary" id="swGo" href="https://timmers437283.github.io/Movium-2/">
      Click Here
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
    </a>
    <button class="sw-btn sw-agree" id="swAgree" type="button" disabled>Agree (5)</button>
  </div>
</div>`;

  function init() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var holder = document.createElement("div");
    holder.innerHTML = html.trim();
    document.body.appendChild(holder.firstChild);

    var overlay = document.getElementById("sunsetWarning");
    var agree = document.getElementById("swAgree");
    var go = document.getElementById("swGo");
    var WAIT = 5000;

    var CHECK =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

    // Make everything except the warning inert
    var inerted = [];
    var node = overlay;
    while (node && node !== document.body) {
      var parent = node.parentElement;
      if (!parent) break;
      Array.prototype.forEach.call(parent.children, function (sib) {
        if (sib !== node && !/^(SCRIPT|STYLE|LINK)$/.test(sib.tagName)) {
          sib.setAttribute("inert", "");
          inerted.push(sib);
        }
      });
      node = parent;
    }
    document.documentElement.style.overflow = "hidden";

    go.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = go.href;
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { agree.classList.add("counting"); });
    });

    var start = Date.now();
    var timer = setInterval(function () {
      var left = Math.ceil((WAIT - (Date.now() - start)) / 1000);
      if (left > 0) {
        agree.textContent = "Agree (" + left + ")";
      } else {
        clearInterval(timer);
        agree.textContent = "Agree";
        agree.disabled = false;
      }
    }, 200);

    agree.addEventListener("click", function () {
      if (agree.disabled || agree.classList.contains("done")) return;
      agree.disabled = true;
      agree.classList.add("done");
      agree.innerHTML = CHECK;
      agree.setAttribute("aria-label", "Agreed");

      setTimeout(function () {
        overlay.classList.add("hide");
        document.documentElement.style.overflow = "";
        inerted.forEach(function (el) { el.removeAttribute("inert"); });
        setTimeout(function () { overlay.remove(); }, 600);
      }, 1100);
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
