
;/* ===== [Image Caption Patch] render img title as caption =====
   Works with theme CSS rule: .md-image[data-img-title]::after { content: attr(data-img-title); }
   Why this exists: Typora only sets `title` on the <img> element itself.
   An <img> is a replaced element so it cannot host ::after/::before, and CSS
   attr() can only read attributes of the element itself (never of children).
   So we mirror img's title onto the wrapping .md-image span here, making it
   reachable by CSS attr(). */
;(function () {
    if (window.__imageCaptionPatch) return;
    window.__imageCaptionPatch = true;

    function syncAll() {
        var imgs = document.querySelectorAll("img[title]");
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var host = img.closest(".md-image") || img.parentElement;
            if (!host) continue;
            var t = img.getAttribute("title") || "";
            if (t) {
                if (host.getAttribute("data-img-title") !== t) host.setAttribute("data-img-title", t);
            } else if (host.hasAttribute("data-img-title")) {
                host.removeAttribute("data-img-title");
            }
        }
    }

    var timer = null;
    function schedule() {
        if (timer) return;
        timer = setTimeout(function () { timer = null; syncAll(); }, 80);
    }

    function start() {
        syncAll();
        new MutationObserver(schedule).observe(document.body, {
            childList: true, subtree: true,
            attributes: true, attributeFilter: ["title", "src"]
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
