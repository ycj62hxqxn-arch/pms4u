"use client";

import { MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Quality = "ok" | "confirm";

type Vehicle = {
  series: "X5" | "X6" | "X7";
  engine: "30d xDrive" | "40d xDrive" | "M60i xDrive";
  exterior: string;
  interior: string;
  package: string;
  year: "2026";
  vin: string;
  quality: Quality;
};

const inventory: Vehicle[] = [
  { series: "X5", engine: "30d xDrive", exterior: "Manhattan Green", interior: "Coffee", package: '22"', year: "2026", vin: "WBA11EV0509398676", quality: "ok" },
  { series: "X5", engine: "30d xDrive", exterior: "Skyscraper Grey", interior: "Tartufo", package: "Air", year: "2026", vin: "WBA11EV0109345523", quality: "ok" },
  { series: "X5", engine: "30d xDrive", exterior: "Sapphire Black", interior: "White", package: "Air", year: "2026", vin: "WBA11EV0009346078", quality: "ok" },
  { series: "X5", engine: "30d xDrive", exterior: "Dravit Grey", interior: "Tartufo", package: 'Air + 22"', year: "2026", vin: "WBA11EV0X09348324", quality: "confirm" },
  { series: "X5", engine: "30d xDrive", exterior: "Sapphire Black", interior: "Black", package: 'Air + 22"', year: "2026", vin: "WBA11EV0209347541", quality: "ok" },
  { series: "X5", engine: "30d xDrive", exterior: "Manhattan Green", interior: "Coffee", package: "Pano", year: "2026", vin: "WBA11EV0509369064", quality: "ok" },
  { series: "X5", engine: "40d xDrive", exterior: "Sapphire Black", interior: "Black", package: "Air", year: "2026", vin: "WBA21EV0509337249", quality: "ok" },
  { series: "X5", engine: "40d xDrive", exterior: "Dravit Grey", interior: "Black", package: 'Individual + Air + 22" + Carbon', year: "2026", vin: "WBA21EV0X09390268", quality: "confirm" },
  { series: "X6", engine: "40d xDrive", exterior: "Tanzanite Blue", interior: "Tartufo", package: 'Individual + Air + 22" + Pano + Carbon + M Sport Pro', year: "2026", vin: "WBA21EY0209400352", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "Manhattan Green", interior: "Black", package: '22" + M Sport Pro', year: "2026", vin: "WBA21EN0809408931", quality: "ok" },
  { series: "X7", engine: "40d xDrive", exterior: "Dravit Grey", interior: "Coffee", package: 'Individual + M Sport Pro + 22"', year: "2026", vin: "WBA21EN0009395110", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "Skyscraper Grey", interior: "Black", package: 'M Sport Pro + 22"', year: "2026", vin: "WBA21EN0809389605", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "Manhattan Green", interior: "Tartufo", package: "M Sport Pro", year: "2026", vin: "WBA21EN0209399000", quality: "ok" },
  { series: "X7", engine: "40d xDrive", exterior: "Dravit Grey", interior: "Coffee", package: 'Individual + 22" + M Sport Pro', year: "2026", vin: "WBA21EN0X09379349", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "Tanzanite Blue", interior: "Black", package: 'Individual + 22" + M Sport Pro + Carbon Black', year: "2026", vin: "WBA21EN0709384167", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "On request", interior: "Tartufo", package: '22" + Pano + Carbon + M Sport Pro', year: "2026", vin: "WBA21EN0609378909", quality: "confirm" },
  { series: "X7", engine: "40d xDrive", exterior: "Skyscraper Grey", interior: "Tartufo", package: '22" + Pano + Carbon + M Sport Pro', year: "2026", vin: "WBA21EN0209377563", quality: "ok" },
  { series: "X7", engine: "40d xDrive", exterior: "Mineral White", interior: "Black", package: '22" + Carbon + M Sport Pro', year: "2026", vin: "WBA21EN0609371104", quality: "ok" },
  { series: "X7", engine: "M60i xDrive", exterior: "Dravit Grey", interior: "Tartufo", package: 'Individual + 22" + Carbon', year: "2026", vin: "WBA31EM0209391677", quality: "ok" },
  { series: "X7", engine: "M60i xDrive", exterior: "Skyscraper Grey", interior: "Tartufo", package: '22" + Pano + Carbon + B&W', year: "2026", vin: "WBA31EM0709382618", quality: "ok" },
  { series: "X7", engine: "M60i xDrive", exterior: "Tanzanite Blue", interior: "Tartufo", package: 'Individual + 22" + Pano + Carbon + B&W', year: "2026", vin: "WBA31EM0109356130", quality: "ok" },
];

const whatsAppNumber = "4917681330467";

function maskVin(vin: string) {
  return vin.length <= 3 ? "***" : `${vin.slice(0, -3)}***`;
}

function buildWhatsAppLink(vehicle: Vehicle) {
  const message = [
    "Hello CARSHUNTER,",
    "Please send me an offer for this BMW unit:",
    `${vehicle.series} ${vehicle.engine}`,
    `Color: ${vehicle.exterior}`,
    `Interior: ${vehicle.interior}`,
    `Spec: ${vehicle.package}`,
    `Year: ${vehicle.year}`,
    `Ref VIN: ${maskVin(vehicle.vin)}`,
  ].join("\n");

  return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
}

export default function CarshunterDropsClient() {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<"all" | Vehicle["series"]>("all");
  const [engine, setEngine] = useState<"all" | Vehicle["engine"]>("all");
  const [quality, setQuality] = useState<"all" | Quality>("all");

  const visibleInventory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return inventory.filter((vehicle) => {
      const haystack = `${vehicle.series} ${vehicle.engine} ${vehicle.exterior} ${vehicle.interior} ${vehicle.package} ${vehicle.vin}`.toLowerCase();

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (series === "all" || vehicle.series === series) &&
        (engine === "all" || vehicle.engine === engine) &&
        (quality === "all" || vehicle.quality === quality)
      );
    });
  }, [engine, quality, query, series]);

  const counts = {
    total: visibleInventory.length,
    x5: visibleInventory.filter((vehicle) => vehicle.series === "X5").length,
    x6: visibleInventory.filter((vehicle) => vehicle.series === "X6").length,
    x7: visibleInventory.filter((vehicle) => vehicle.series === "X7").length,
  };

  return (
    <main className="min-h-screen bg-[#0c111c] text-[#f2f5fb]">
      <div className="mx-auto w-[min(1240px,94vw)] py-7">
        <header className="relative overflow-hidden rounded-2xl border border-[#2a3855] bg-[linear-gradient(160deg,#111a2d,#0f1627)] p-6 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_36%,rgba(214,163,79,0.18),transparent_38%),radial-gradient(circle_at_78%_72%,rgba(77,134,255,0.15),transparent_42%),linear-gradient(110deg,rgba(12,17,28,0.28)_20%,rgba(12,17,28,0.84)_66%)] opacity-60" />
          <div className="absolute right-4 top-4 z-10 grid size-[88px] place-items-center rounded-full border-2 border-[#d6a34f] bg-[#0f1627] shadow-xl">
            <span className="grid size-[66px] place-items-center rounded-full border border-[#d6a34f]/60 text-xl font-extrabold text-[#f6d79c]">
              CH
            </span>
          </div>

          <div className="relative z-10 max-w-4xl pr-28 max-sm:pr-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a34f]">CARSHUNTER Big Day Drops</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-5xl">BMW Stock Drop - 17.06.2026</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#9aa8c4] sm:text-base">
              Publish-ready BMW X5, X6, and X7 campaign inventory with masked VIN references and
              direct WhatsApp offer requests for each unit.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["X5 Series", "X6 Series", "X7 Series", "30d / 40d / M60i", "Model Year 2026"].map((chip) => (
                <span key={chip} className="rounded-full border border-[#2a3855] bg-[#13203a] px-3 py-1.5 text-xs text-[#dce7ff]">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="my-5 grid gap-3 lg:grid-cols-4">
          <label className="rounded-xl border border-[#2a3855] bg-[#131b2b] p-3 text-xs text-[#9aa8c4]">
            <span className="mb-2 flex items-center gap-2">
              <Search className="size-4" />
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-[#2a3855] bg-[#0f1627] px-3 py-2 text-sm text-white outline-none focus:border-[#d6a34f]"
              placeholder="VIN, color, package"
            />
          </label>

          <label className="rounded-xl border border-[#2a3855] bg-[#131b2b] p-3 text-xs text-[#9aa8c4]">
            <span className="mb-2 block">Series</span>
            <select
              value={series}
              onChange={(event) => setSeries(event.target.value as "all" | Vehicle["series"])}
              className="w-full rounded-lg border border-[#2a3855] bg-[#0f1627] px-3 py-2 text-sm text-white outline-none focus:border-[#d6a34f]"
            >
              <option value="all">All series</option>
              <option value="X5">X5</option>
              <option value="X6">X6</option>
              <option value="X7">X7</option>
            </select>
          </label>

          <label className="rounded-xl border border-[#2a3855] bg-[#131b2b] p-3 text-xs text-[#9aa8c4]">
            <span className="mb-2 block">Engine</span>
            <select
              value={engine}
              onChange={(event) => setEngine(event.target.value as "all" | Vehicle["engine"])}
              className="w-full rounded-lg border border-[#2a3855] bg-[#0f1627] px-3 py-2 text-sm text-white outline-none focus:border-[#d6a34f]"
            >
              <option value="all">All engines</option>
              <option value="30d xDrive">30d xDrive</option>
              <option value="40d xDrive">40d xDrive</option>
              <option value="M60i xDrive">M60i xDrive</option>
            </select>
          </label>

          <label className="rounded-xl border border-[#2a3855] bg-[#131b2b] p-3 text-xs text-[#9aa8c4]">
            <span className="mb-2 block">Status</span>
            <select
              value={quality}
              onChange={(event) => setQuality(event.target.value as "all" | Quality)}
              className="w-full rounded-lg border border-[#2a3855] bg-[#0f1627] px-3 py-2 text-sm text-white outline-none focus:border-[#d6a34f]"
            >
              <option value="all">All units</option>
              <option value="ok">Ready to offer</option>
              <option value="confirm">Confirm details</option>
            </select>
          </label>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Visible units", counts.total],
            ["X5", counts.x5],
            ["X6", counts.x6],
            ["X7", counts.x7],
          ].map(([label, value]) => (
            <article key={label} className="rounded-xl border border-[#2a3855] bg-[#131b2b] p-4">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-[#9aa8c4]">{label}</div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#2a3855] bg-[#0f1627]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse">
              <thead className="bg-[#15203a]">
                <tr>
                  {["Series", "Engine", "Exterior", "Interior", "Package", "Year", "VIN", "Status", "Offer"].map((heading) => (
                    <th key={heading} className="border-b border-[#202d47] px-3 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#b8c8e9]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleInventory.map((vehicle) => (
                  <tr key={vehicle.vin}>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.series}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.engine}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.exterior}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.interior}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.package}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">{vehicle.year}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm font-bold">{maskVin(vehicle.vin)}</td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${
                          vehicle.quality === "ok"
                            ? "border-emerald-500/50 bg-emerald-400/10 text-emerald-300"
                            : "border-[#d6a34f]/50 bg-[#d6a34f]/10 text-[#ffd089]"
                        }`}
                      >
                        {vehicle.quality === "ok" ? "Ready to offer" : "Confirm details"}
                      </span>
                    </td>
                    <td className="border-b border-[#202d47] px-3 py-3 text-sm">
                      <a
                        href={buildWhatsAppLink(vehicle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#1db954] bg-[#25d366] px-3 py-1.5 text-xs font-bold text-[#062a1f] transition hover:brightness-110"
                      >
                        <MessageCircle className="size-4" />
                        WhatsApp offer
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="py-5 text-sm text-[#9aa8c4]">
          CARSHUNTER client campaign surface. VIN references are intentionally masked for public sharing.
        </footer>
      </div>
    </main>
  );
}
