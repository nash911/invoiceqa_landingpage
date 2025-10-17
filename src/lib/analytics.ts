export function loadClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  
  // Only load in production and if project ID is set
  if (process.env.NODE_ENV !== "production" || !clarityId) {
    return;
  }

  // Microsoft Clarity script
  (function (c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityId);
}

