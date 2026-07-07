"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  Download,
  FileJson,
  FileText,
  History,
  RefreshCw,
  Search,
} from "lucide-react";
import { domainAssets, localHosts, researchAssets, type DomainAsset } from "./ops-data";

type HealthState = {
  state: "idle" | "checking" | "ok" | "warn" | "fail";
  label: string;
  detail: string;
  checkedAt: string;
};

type HealthHistoryEntry = {
  domain: string;
  state: HealthState["state"];
  label: string;
  detail: string;
  checkedAt: string;
};

const groups = ["Production", "Local Runtime", "Deployment", "Review"];
const defaultHealth: HealthState = {
  state: "idle",
  label: "Not checked",
  detail: "",
  checkedAt: "",
};

function riskTone(risk: DomainAsset["risk"]) {
  if (risk === "High") return "border-red-200 bg-red-50 text-red-700";
  if (risk === "Medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function priorityTone(priority: DomainAsset["priority"]) {
  if (priority === "P0") return "border-slate-950 bg-slate-950 text-white";
  if (priority === "P1") return "border-blue-200 bg-blue-50 text-blue-700";
  if (priority === "P2") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function healthTone(state: HealthState["state"]) {
  if (state === "ok") return "bg-emerald-500";
  if (state === "warn") return "bg-amber-500";
  if (state === "fail") return "bg-red-500";
  if (state === "checking") return "bg-blue-500";
  return "bg-slate-300";
}

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 7000);

  try {
    return await fetch(url, {
      cache: "no-store",
      ...options,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function OpsControlPlaneClient() {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");
  const [health, setHealth] = useState<Record<string, HealthState>>({});
  const [history, setHistory] = useState<HealthHistoryEntry[]>([]);
  const [report, setReport] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("pms4u.ops.healthHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored) as HealthHistoryEntry[]);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const filteredDomains = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return domainAssets.filter((asset) => {
      const matchesGroup = groupFilter === "All" || asset.group === groupFilter;
      const haystack = [
        asset.domain,
        asset.aliases.join(" "),
        asset.owner,
        asset.risk,
        asset.priority,
        asset.role,
        asset.target,
        asset.folder,
        asset.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return matchesGroup && (!needle || haystack.includes(needle));
    });
  }, [groupFilter, query]);

  const healthCounts = useMemo(() => {
    return domainAssets.reduce(
      (acc, asset) => {
        const state = health[asset.domain]?.state ?? "idle";
        acc[state] += 1;
        return acc;
      },
      { idle: 0, checking: 0, ok: 0, warn: 0, fail: 0 },
    );
  }, [health]);

  function recordHistory(entry: HealthHistoryEntry) {
    setHistory((current) => {
      const next = [entry, ...current].slice(0, 40);
      window.localStorage.setItem("pms4u.ops.healthHistory", JSON.stringify(next));
      return next;
    });
  }

  async function checkOne(asset: DomainAsset) {
    setHealth((current) => ({
      ...current,
      [asset.domain]: {
        state: "checking",
        label: "Checking",
        detail: asset.health,
        checkedAt: "",
      },
    }));

    const started = performance.now();

    try {
      const response = await fetchWithTimeout(asset.health, { method: "GET" });
      const ms = Math.max(1, Math.round(performance.now() - started));
      const result: HealthState = {
        state: response.ok ? "ok" : "warn",
        label: `${response.status} ${response.statusText || ""}`.trim(),
        detail: `${ms} ms`,
        checkedAt: new Date().toLocaleTimeString(),
      };

      setHealth((current) => ({ ...current, [asset.domain]: result }));
      recordHistory({ domain: asset.domain, ...result });
    } catch (error) {
      try {
        const fallbackStarted = performance.now();
        await fetchWithTimeout(asset.health, { method: "GET", mode: "no-cors" });
        const ms = Math.max(1, Math.round(performance.now() - fallbackStarted));
        const result: HealthState = {
          state: "ok",
          label: "Reachable",
          detail: `${ms} ms, CORS opaque`,
          checkedAt: new Date().toLocaleTimeString(),
        };

        setHealth((current) => ({ ...current, [asset.domain]: result }));
        recordHistory({ domain: asset.domain, ...result });
      } catch (fallbackError) {
        const result: HealthState = {
          state: fallbackError instanceof DOMException && fallbackError.name === "AbortError" ? "fail" : "fail",
          label: fallbackError instanceof DOMException && fallbackError.name === "AbortError" ? "Timeout" : "Offline or blocked",
          detail: asset.health,
          checkedAt: new Date().toLocaleTimeString(),
        };

        setHealth((current) => ({ ...current, [asset.domain]: result }));
        recordHistory({ domain: asset.domain, ...result });
      }
    }
  }

  async function checkAll() {
    await Promise.allSettled(filteredDomains.map((asset) => checkOne(asset)));
  }

  function exportJson() {
    const payload = {
      generatedAt: new Date().toISOString(),
      controlPlane: "PMS4U Operations Control Plane",
      domains: domainAssets,
      researchAssets,
      health,
      healthHistory: history,
      localHosts,
    };

    downloadText(
      `pms4u-operations-control-plane-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
  }

  function generateStatusReport() {
    const lines = [
      "# PMS4U Operations Control Plane Status Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Summary",
      "",
      `- Domain assets: ${domainAssets.length}`,
      `- Research assets: ${researchAssets.length}`,
      `- Health OK/reachable: ${healthCounts.ok}`,
      `- Health warnings: ${healthCounts.warn}`,
      `- Health failed/offline: ${healthCounts.fail}`,
      `- Not checked: ${healthCounts.idle}`,
      "",
      "## Domain Assets",
      "",
      ...domainAssets.map((asset) => {
        const itemHealth = health[asset.domain] ?? defaultHealth;
        return [
          `### ${asset.domain}`,
          `- Owner: ${asset.owner}`,
          `- Group: ${asset.group}`,
          `- Risk: ${asset.risk}`,
          `- Priority: ${asset.priority}`,
          `- Role: ${asset.role}`,
          `- Target: ${asset.target}`,
          `- Health: ${itemHealth.label}${itemHealth.detail ? ` (${itemHealth.detail})` : ""}`,
          "",
        ].join("\n");
      }),
      "## Research Assets",
      "",
      ...researchAssets.map((asset) => {
        return [
          `### ${asset.id} ${asset.title}`,
          `- Kind: ${asset.kind}`,
          `- Track: ${asset.track}`,
          `- Status: ${asset.status}`,
          `- Priority: ${asset.priority}`,
          `- Owner: ${asset.owner}`,
          `- Route: ${asset.href ?? "Queued"}`,
          "",
        ].join("\n");
      }),
    ];

    const text = lines.join("\n");
    setReport(text);
    downloadText(
      `pms4u-status-report-${new Date().toISOString().slice(0, 10)}.md`,
      text,
      "text/markdown",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/ops" className="text-sm font-bold tracking-[0.26em] text-slate-950">
            PMS4U OPS CONTROL PLANE
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <Link href="/research" className="hover:text-slate-950">
              Research
            </Link>
            <Link href="/ops/research-assets" className="hover:text-slate-950">
              Research Assets
            </Link>
            <Link href="/gtcs4u" className="hover:text-slate-950">
              GTCS4U
            </Link>
            <Link href="/bpbsolutionsltd" className="hover:text-slate-950">
              BPB
            </Link>
            <Link href="/console" className="font-semibold text-emerald-700 hover:text-emerald-900">
              Console
            </Link>
            <Link href="/ops/messaging" className="font-semibold text-cyan-700 hover:text-cyan-900">
              Messaging
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-white px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
              <Activity size={15} />
              Local Operational Evidence Surface
            </div>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] tracking-normal sm:text-6xl">
              PMS4U Operations Control Plane
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              A unified local control plane connecting domains, ownership, risk, priority, health
              checks, service routing, and the PMS4U research corpus.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Domains</div>
              <div className="mt-2 text-3xl font-semibold">{domainAssets.length}</div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Research</div>
              <div className="mt-2 text-3xl font-semibold">{researchAssets.length}</div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Healthy</div>
              <div className="mt-2 text-3xl font-semibold">{healthCounts.ok}</div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Failures</div>
              <div className="mt-2 text-3xl font-semibold">{healthCounts.fail}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-6">
        <div className="mx-auto grid max-w-7xl gap-3 border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px_auto] lg:items-center">
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
            <Search size={17} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search domain, owner, risk, priority, role, folder"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option>All</option>
            {groups.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/ops/messaging"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan-50 px-4 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
            >
              <ArrowRight size={16} />
              Governed Messaging
            </Link>
            <button
              type="button"
              onClick={checkAll}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Check visible
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:border-slate-950"
            >
              <FileJson size={16} />
              Export JSON
            </button>
            <button
              type="button"
              onClick={generateStatusReport}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:border-slate-950"
            >
              <ClipboardList size={16} />
              Generate Status Report
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-7xl gap-5">
          {groups
            .filter((group) => filteredDomains.some((asset) => asset.group === group))
            .map((group) => {
              const groupAssets = filteredDomains.filter((asset) => asset.group === group);

              return (
                <section key={group} className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{group}</h2>
                    <span className="text-sm text-slate-500">
                      {groupAssets.length} asset{groupAssets.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {groupAssets.map((asset) => {
                      const itemHealth = health[asset.domain] ?? defaultHealth;

                      return (
                        <article key={asset.domain} className="border border-slate-200 bg-white p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-semibold text-slate-950">{asset.domain}</h3>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{asset.role}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityTone(asset.priority)}`}>
                                {asset.priority}
                              </span>
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${riskTone(asset.risk)}`}>
                                {asset.risk}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                            <span className="inline-flex min-w-0 items-center gap-2">
                              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${healthTone(itemHealth.state)}`} />
                              <span className="truncate font-medium">{itemHealth.label}</span>
                            </span>
                            <span className="shrink-0 text-xs text-slate-500">{itemHealth.detail || asset.health}</span>
                          </div>

                          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[110px_1fr]">
                            <dt className="font-semibold text-slate-500">Owner</dt>
                            <dd>{asset.owner}</dd>
                            <dt className="font-semibold text-slate-500">Risk</dt>
                            <dd>{asset.risk}</dd>
                            <dt className="font-semibold text-slate-500">Priority</dt>
                            <dd>{asset.priority}</dd>
                            <dt className="font-semibold text-slate-500">Target</dt>
                            <dd>{asset.target}</dd>
                            <dt className="font-semibold text-slate-500">Folder</dt>
                            <dd className="break-words">/Users/alaaatia/pms4u/{asset.folder}</dd>
                            <dt className="font-semibold text-slate-500">Aliases</dt>
                            <dd>{asset.aliases.length ? asset.aliases.join(", ") : "None"}</dd>
                          </dl>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {asset.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-slate-950"
                            >
                              Open
                              <ArrowRight size={15} />
                            </a>
                            <button
                              type="button"
                              onClick={() => checkOne(asset)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-slate-950"
                            >
                              <RefreshCw size={15} />
                              Check
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <History size={15} />
              Health History
            </div>
            <div className="max-h-80 overflow-auto border border-slate-200">
              {history.length ? (
                history.map((entry, index) => (
                  <div key={`${entry.domain}-${entry.checkedAt}-${index}`} className="grid gap-2 border-b border-slate-200 p-3 text-sm last:border-b-0 sm:grid-cols-[1fr_150px_110px]">
                    <span className="font-medium">{entry.domain}</span>
                    <span>{entry.label}</span>
                    <span className="text-slate-500">{entry.checkedAt}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500">No health checks recorded in this browser yet.</div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <FileText size={15} />
              Generated Report Preview
            </div>
            <textarea
              value={report}
              readOnly
              placeholder="Generate a status report to preview the markdown here."
              className="h-80 w-full resize-none border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-700 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border border-slate-200 bg-slate-950 p-5 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Research inventory</div>
            <h2 className="mt-2 text-2xl font-semibold">Connect operations to PMS4U Technical Notes and White Papers.</h2>
          </div>
          <Link
            href="/ops/research-assets"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-100"
          >
            <Download size={16} />
            Open Research Assets
          </Link>
        </div>
      </section>
    </main>
  );
}
