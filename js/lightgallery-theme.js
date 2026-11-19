(function () {
  function syncLightGalleryTheme() {
    var isDark =
      document.documentElement.classList.contains("dark") ||
      document.body.getAttribute("theme") === "dark";
    var items = document.querySelectorAll("a.lightgallery[data-dark-src]");
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var nextSrc = isDark
        ? el.getAttribute("data-dark-src")
        : el.getAttribute("data-light-src");
      if (nextSrc) {
        el.setAttribute("href", nextSrc);
        el.setAttribute("data-thumbnail", nextSrc);
      }
    }
  }

  function initScalableSvgHook() {
    var galleryRoot =
      document.querySelector("article.page.single") ||
      document.getElementById("content");
    if (!galleryRoot) return;

    galleryRoot.addEventListener("onAferAppendSlide", function (e) {
      var idx = e.detail && e.detail.index;
      var slides = document.querySelectorAll(".lg-outer .lg-item");
      var img = slides[idx] && slides[idx].querySelector(".lg-image");
      if (!img) return;

      var markIfScalableSvg = function () {
        var src = img.getAttribute("src") || "";
        if (src.toLowerCase().indexOf(".svg") !== -1 && img.naturalWidth >= 400) {
          img.classList.add("lg-svg-scalable");
        }
      };

      if (img.complete && img.naturalWidth) {
        markIfScalableSvg();
      } else {
        img.addEventListener("load", markIfScalableSvg, { once: true });
      }
    });
  }

  syncLightGalleryTheme();
  initScalableSvgHook();

  if (window.switchThemeEventSet) {
    window.switchThemeEventSet.add(syncLightGalleryTheme);
  }
  document.addEventListener("prerenderingchange", syncLightGalleryTheme);
  window.addEventListener("pageshow", syncLightGalleryTheme);
  window.addEventListener("storage", function (e) {
    if (e.key === "theme") syncLightGalleryTheme();
  });
})();
