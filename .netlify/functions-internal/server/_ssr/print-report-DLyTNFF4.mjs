function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function printReport(title) {
  if (typeof window === "undefined") return;
  const source = document.querySelector("main");
  if (!source) {
    const previousTitle = document.title;
    document.title = title;
    window.print();
    document.title = previousTitle;
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    window.print();
    return;
  }
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map((node) => node.outerHTML).join("\n");
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  ${styles}
  <style>
    @page { margin: 12mm; }
    html, body {
      background: #fff !important;
      color: #000 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    body { padding: 4mm !important; }
    .print\\:hidden,
    button,
    [data-sidebar],
    [data-sonner-toaster] {
      display: none !important;
    }
  </style>
</head>
<body>${source.innerHTML}</body>
</html>`);
  doc.close();
  const cleanup = () => {
    iframe.remove();
  };
  const triggerPrint = () => {
    win.focus();
    win.print();
    window.setTimeout(cleanup, 800);
  };
  if (doc.readyState === "complete") {
    window.setTimeout(triggerPrint, 200);
  } else {
    iframe.onload = () => window.setTimeout(triggerPrint, 200);
  }
}
export {
  printReport as p
};
