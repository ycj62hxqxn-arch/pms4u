import fs from "node:fs";
import path from "node:path";
import reportData from "../app/workspace-technical-report/report-data.mjs";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function list(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function gridCards(items, render) {
  return items.map((item) => `<div class="card">${render(item)}</div>`).join("");
}

function renderFacts(items) {
  return items
    .map(
      (item) =>
        `<div class="fact"><div class="label">${escapeHtml(item.label)}</div><div class="value">${escapeHtml(item.value)}</div></div>`,
    )
    .join("");
}

const { header, quickFacts, summary, milestones, how, why, changes, impact, domains, sectors, projects, projectsSection, swot, sources } =
  reportData;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(reportData.metadata.title)}</title>
  <style>
    :root {
      --bg: #050816;
      --panel: rgba(255, 255, 255, 0.04);
      --panel-strong: rgba(255, 255, 255, 0.06);
      --text: #f8fafc;
      --muted: #cbd5e1;
      --soft: #94a3b8;
      --line: rgba(255, 255, 255, 0.10);
      --cyan: #67e8f9;
      --amber: #fcd34d;
      --emerald: #6ee7b7;
      --rose: #fda4af;
      --shadow: 0 30px 120px rgba(0, 0, 0, 0.40);
      --radius: 28px;
      --radius-sm: 18px;
      --max: 1180px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.14), transparent 26%),
        radial-gradient(circle at 80% 10%, rgba(212, 175, 55, 0.12), transparent 24%),
        radial-gradient(circle at 50% 110%, rgba(34, 197, 94, 0.08), transparent 24%),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }
    a { color: var(--cyan); text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 2px 6px;
      color: #bae6fd;
    }
    .shell { width: min(var(--max), calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }
    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 32px;
      border: 1px solid var(--line);
      background: linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04));
      box-shadow: var(--shadow);
      padding: 30px;
    }
    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(56,189,248,0.14), transparent 26%),
        radial-gradient(circle at 80% 10%, rgba(212,175,55,0.12), transparent 24%),
        radial-gradient(circle at 50% 110%, rgba(34,197,94,0.08), transparent 24%);
      pointer-events: none;
    }
    .hero-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1.45fr 0.95fr;
      gap: 24px;
      align-items: start;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(252, 211, 77, 0.25);
      background: rgba(252, 211, 77, 0.10);
      color: #fef3c7;
      text-transform: uppercase;
      letter-spacing: 0.28em;
      font-size: 11px;
      font-weight: 700;
    }
    h1, h2, h3 { margin: 0; line-height: 1.15; }
    h1 { margin-top: 18px; font-size: clamp(2.4rem, 4vw, 4.8rem); letter-spacing: -0.05em; }
    h2 { font-size: clamp(1.5rem, 2.2vw, 2.1rem); margin-bottom: 10px; }
    h3 { font-size: 1.1rem; }
    .lead { margin-top: 16px; max-width: 70ch; color: var(--muted); font-size: 1rem; }
    .navlinks { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; justify-content: flex-end; }
    .navlinks a {
      padding: 9px 12px;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      background: rgba(15, 23, 42, 0.55);
      color: #dbeafe;
      font-size: 13px;
    }
    .navlinks a:hover {
      border-color: rgba(103, 232, 249, 0.55);
      background: rgba(15, 23, 42, 0.78);
      text-decoration: none;
    }
    .navlinks a.print {
      border-color: rgba(252, 211, 77, 0.20);
      background: rgba(252, 211, 77, 0.10);
      color: #fef3c7;
    }
    .facts {
      margin-top: 22px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .fact {
      padding: 16px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(0,0,0,0.35);
    }
    .fact .label {
      color: var(--soft);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .fact .value { margin-top: 8px; font-size: 1.05rem; font-weight: 700; }
    .section {
      margin-top: 26px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .section-head {
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding: 24px 24px 14px;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent);
    }
    .section-body { padding: 24px; }
    .kicker {
      color: var(--cyan);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .muted { color: var(--muted); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .card {
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(0,0,0,0.30);
      padding: 18px;
    }
    .card p { margin: 0; }
    .callout {
      border-radius: 18px;
      border: 1px solid rgba(252, 211, 77, 0.20);
      background: rgba(252, 211, 77, 0.08);
      padding: 18px;
      color: #fff7d6;
    }
    .table-wrap {
      overflow: hidden;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.10);
    }
    table { width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.22); }
    th, td { padding: 14px; text-align: left; vertical-align: top; border-bottom: 1px solid rgba(255,255,255,0.08); }
    th {
      background: rgba(255,255,255,0.04);
      color: #e2e8f0;
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    tr:last-child td { border-bottom: none; }
    .swot { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .strength { border-top: 4px solid var(--emerald); }
    .weakness { border-top: 4px solid #f59e0b; }
    .opportunity { border-top: 4px solid var(--cyan); }
    .threat { border-top: 4px solid var(--rose); }
    .source-list { margin: 0; padding-left: 18px; color: var(--muted); }
    .source-list li { margin-bottom: 6px; }
    .footer { margin-top: 18px; text-align: center; color: var(--soft); font-size: 12px; }
    @media (max-width: 960px) {
      .hero-grid, .grid-2, .grid-4, .swot, .facts { grid-template-columns: 1fr; }
      .navlinks { justify-content: flex-start; }
    }
    @media print {
      body { background: #fff; color: #000; }
      .shell { width: 100%; padding: 0; }
      .hero, .section, .fact, .card, .callout, .table-wrap { box-shadow: none !important; }
      .hero, .section { border-color: #ddd; background: #fff; }
      .hero::before, .navlinks, .no-print, .footer .link { display: none !important; }
      a[href]::after { content: ""; }
      .muted { color: #333; }
      th { background: #f3f4f6; color: #111; }
      td, th { border-bottom-color: #e5e7eb; }
      .pill { border-color: #e5e7eb; background: #fef3c7; color: #111; }
      .fact, .card, .callout { border-color: #e5e7eb; background: #fff; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="hero-grid">
        <div>
          <div class="pill">${escapeHtml(header.eyebrow)}</div>
          <h1>${escapeHtml(header.title)}</h1>
          <p class="lead">${escapeHtml(header.lead)}</p>
        </div>
        <div class="navlinks no-print">
          <a href="/">Home</a>
          <a href="/authority">Authority</a>
          <a href="/trace">Trace</a>
          <a href="/workspace-technical-report/print" class="print">Print / Export</a>
        </div>
      </div>
      <div class="facts">${renderFacts(quickFacts)}</div>
    </header>

    <section class="section">
      <div class="section-head"><div class="kicker">Summary</div><h2>${escapeHtml(summary.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="muted">${summary.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
          <div class="callout">
            <strong>${escapeHtml(summary.calloutTitle)}:</strong>
            <div style="margin-top:10px; font-size:1.1rem; color:#fff;">${escapeHtml(summary.calloutLead)}</div>
            <p style="margin:10px 0 0; color:#fff7d6;">${escapeHtml(summary.calloutBody)}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">When</div><h2>Milestones achieved</h2></div>
      <div class="section-body">
        <div class="grid-2">
          ${gridCards(milestones, (item) => `<strong>${escapeHtml(item.date)}</strong><p class="muted" style="margin-top:8px;">${escapeHtml(item.title)}</p><p class="muted" style="margin-top:8px;">${escapeHtml(item.detail)}</p>`)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">How</div><h2>${escapeHtml(how.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="card"><h3>${escapeHtml(how.implementationTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(how.implementationBody)}</p></div>
          <div class="card"><h3>${escapeHtml(how.deliveryTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(how.deliveryBody)}</p></div>
        </div>
        <div class="table-wrap" style="margin-top:16px;">
          <table>
            <thead><tr>${how.projectsTableHeaders.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
            <tbody>
              ${projects.map((project) => `<tr><td>${escapeHtml(project.name)}</td><td>${escapeHtml(project.impact)}</td><td>${escapeHtml(project.method)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Why</div><h2>${escapeHtml(why.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="card"><h3>${escapeHtml(why.problemTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(why.problemBody)}</p></div>
          <div class="card"><h3>${escapeHtml(why.rationaleTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(why.rationaleBody)}</p></div>
          <div class="card"><h3>${escapeHtml(why.categoryTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(why.categoryBody)}</p></div>
          <div class="card"><h3>${escapeHtml(why.businessTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(why.businessBody)}</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Changes and impact</div><h2>${escapeHtml(changes.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="card"><h3>${escapeHtml(changes.documentationTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(changes.documentationBody)}</p></div>
          <div class="card"><h3>${escapeHtml(changes.assetsTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(changes.assetsBody)}</p></div>
          <div class="card"><h3>${escapeHtml(changes.routesTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(changes.routesBody)}</p></div>
          <div class="card"><h3>${escapeHtml(changes.hygieneTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(changes.hygieneBody)}</p></div>
        </div>
        <div class="grid-4" style="margin-top:16px;">${renderFacts(changes.impactStats)}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Impact</div><h2>${escapeHtml(impact.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="card"><h3>${escapeHtml(impact.securityTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(impact.securityBody)}</p></div>
          <div class="card"><h3>${escapeHtml(impact.trustTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(impact.trustBody)}</p></div>
          <div class="card"><h3>${escapeHtml(impact.coherenceTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(impact.coherenceBody)}</p></div>
          <div class="card"><h3>${escapeHtml(impact.maintainabilityTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(impact.maintainabilityBody)}</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Domains and sectors</div><h2>${escapeHtml(sectors.title)}</h2></div>
      <div class="section-body">
        <p class="muted">${escapeHtml(sectors.coverage)}</p>
        <p class="muted" style="margin-top:12px;">${escapeHtml(sectors.operatingModel)}</p>
        <div class="table-wrap" style="margin-top:16px;">
          <table>
            <thead><tr><th>Domain</th><th>Repository</th><th>Sector</th><th>Role</th></tr></thead>
            <tbody>
              ${domains.map((item) => `<tr><td>${escapeHtml(item.domain)}</td><td>${escapeHtml(item.repo)}</td><td>${escapeHtml(item.sector)}</td><td>${escapeHtml(item.role)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Projects completed</div><h2>${escapeHtml(projectsSection.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          ${gridCards(projects, (project) => `<h3>${escapeHtml(project.name)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(project.impact)}</p><p class="muted" style="margin-top:12px;">${escapeHtml(project.method)}</p>`)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">SWOT</div><h2>${escapeHtml(swot.title)}</h2></div>
      <div class="section-body">
        <div class="swot">
          ${swot.items
            .map(
              (item) =>
                `<div class="card"><h3>${escapeHtml(item.title)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(item.body)}</p></div>`,
            )
            .join("")}
        </div>
        <div class="grid-2" style="margin-top:16px;">
          <div class="card"><h3>${escapeHtml(swot.conclusionTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(swot.conclusionBody)}</p></div>
          <div class="card"><h3>${escapeHtml(swot.mitigationTitle)}</h3><p class="muted" style="margin-top:8px;">${escapeHtml(swot.mitigationBody)}</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div class="kicker">Sources</div><h2>${escapeHtml(sources.title)}</h2></div>
      <div class="section-body">
        <div class="grid-2">
          <div class="card">
            <h3>Primary sources</h3>
            <ul class="source-list">${list(sources.primary)}</ul>
          </div>
          <div class="card">
            <h3>Implementation sources</h3>
            <ul class="source-list">${list(sources.implementation)}</ul>
          </div>
        </div>
      </div>
    </section>

    <div class="footer">
      Use the native route for the interactive version. This static HTML is generated from the shared report data module.
    </div>
  </div>
</body>
</html>`;

const outPath = path.join(process.cwd(), "WORKSPACE_TECHNICAL_REPORT.html");
fs.writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath}`);
