# lantran-01.github.io

Personal site for Dylan Tran — embedded software engineer (firmware, BSP, FPGA).

Single-page, hand-built, no frameworks and no build step. Push to `main` and
GitHub Pages serves it.

```
index.html            the whole site
css/style.css         design system + every section
js/main.js            canvas hero, scroll reveals, stat counters (no dependencies)
assets/boards/*.svg   generated line-art illustrations, one per board
assets/logos/*        employer and university logos
```

The board illustrations share one drawing vocabulary and one accent colour per
hardware family (`--acc-sbc`, `--acc-metal`, `--acc-fpga`, `--acc-ai` in
`css/style.css`). `work.html`, `education.html` and `projects.html` are kept as
redirects to the matching anchors so old links still resolve.
