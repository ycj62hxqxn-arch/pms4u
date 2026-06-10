
export default function DoctrineBriefing() {
    return (
        <div className="bg-[#1a1a24] text-[#E5E7EB] font-sans antialiased min-h-screen dark">
            <style dangerouslySetInnerHTML={{__html: `
                .slide { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 4rem 10%; border-bottom: 1px solid #222; }
                .lux-panel { background: linear-gradient(145deg, #232331 0%, #2a2a3c 100%); border: 1px solid rgba(212, 175, 55, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .glow-text { background: linear-gradient(90deg, #D4AF37, #FBF5B7); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .accent-text { color: #38BDF8; }
                ul.custom-list li { position: relative; padding-left: 1.5rem; margin-bottom: 0.5rem; color: #9CA3AF; }
                ul.custom-list li::before { content: '▹'; position: absolute; left: 0; color: #D4AF37; font-weight: bold; }
                ul.accent-list li::before { color: #38BDF8; }
            `}} />
            
            

    {/* Slide 1: Title */}
    <section className="slide relative" id="slide-1">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl">
            <span className="inline-block py-1 px-3 border border-gold/30 rounded-full text-gold text-xs tracking-widest uppercase mb-6 font-bold">Investoren & Member Briefing</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-tight">
                CARS<span className="accent-text">HUNTER</span>
            </h1>
            <h2 className="text-3xl text-gray-300 font-light mb-8 leading-snug">Die Zukunft des globalen Fahrzeughandels durch <span className="glow-text font-bold">Governed Execution</span>.</h2>
            <p className="text-lg text-gray-400 max-w-2xl border-l-4 border-accent pl-4">
                Ein hochsicheres, auditfähiges Betriebssystem für den exklusiven Fahrzeug-Beschaffungsmarkt — und die Grundlage für ein neues Governance-Framework digitaler Transaktionen.
            </p>
        </div>
    </section>

    {/* Slide 2: WHAT */}
    <section className="slide" id="slide-2">
        <div className="max-w-6xl">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">01. What — Was ist CARSHUNTER?</h2>
            <h3 className="text-4xl font-display text-white mb-8">Mehr als ein Marktplatz.</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="lux-panel p-8 rounded-xl">
                    <h4 className="text-xl font-bold text-white mb-4">Governed Transaction Infrastructure</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        CARSHUNTER ist <strong>keine klassische Fahrzeugplattform</strong>. Es ist eine Governed Execution Infrastructure für den internationalen Fahrzeughandel.
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                        Die Plattform orchestriert den gesamten Beschaffungsprozess — von Kundenaufnahme über Compliance-Prüfung bis zur Exportfreigabe — innerhalb eines streng kontrollierten Multi-Layer-Systems.
                    </p>
                    <p className="text-sm font-semibold text-white mb-2">Das Ergebnis:</p>
                    <ul className="custom-list text-sm">
                        <li>nachvollziehbare Prozesse</li>
                        <li>autorisierte Statusübergänge</li>
                        <li>vollständige Auditierbarkeit</li>
                        <li>manipulationsresistente Transaktionsketten</li>
                    </ul>
                    <div className="mt-6 p-4 border border-accent/30 bg-accent/5 rounded-lg">
                        <p className="text-accent text-sm font-mono">CARSHUNTER fungiert als:<br/>Execution-as-a-Service Layer für hochkritische Handelsprozesse.</p>
                    </div>
                </div>

                <div className="lux-panel p-8 rounded-xl border-t-4 border-t-accent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏛</div>
                    <h4 className="text-xl font-bold text-white mb-4">Evidence-Bound Governance</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Jeder kritische Statuswechsel ist beweisgebunden. Kein Datensatz kann ohne Autorisierung verändert werden.
                    </p>
                    <p className="text-sm text-gray-400 mb-3">Kein Fahrzeug kann als:</p>
                    <ul className="custom-list accent-list text-sm mb-4">
                        <li>exportiert,</li>
                        <li>bezahlt,</li>
                        <li>freigegeben,</li>
                        <li>compliant oder abgeschlossen markiert werden...</li>
                    </ul>
                    <p className="text-sm text-gray-400 mb-4">
                        ...ohne eine kryptografisch verifizierte Freigabe durch das zentrale Governance-System: <strong className="text-white">ALCATARA</strong>
                    </p>
                    <p className="text-sm text-gray-400 mb-3">Das Governance Gate erzeugt eine unveränderliche:</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-gold">evidence_id</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-gold">authorization_chain</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-gold">audit_signature</span>
                    </div>
                    <em className="text-xl text-accent font-display block">&quot;Silence Before Proof.&quot;</em>
                </div>
            </div>
        </div>
    </section>

    {/* Slide 3: WHY */}
    <section className="slide" id="slide-3">
        <div className="max-w-6xl">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">02. Why — Warum wird das benötigt?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                    <div className="lux-panel p-6 rounded-lg">
                        <h4 className="text-xl font-bold text-white mb-4">Das strukturelle Problem im Fahrzeughandel</h4>
                        <p className="text-gray-400 text-sm mb-4">Der internationale Fahrzeughandel basiert heute überwiegend auf:</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <ul className="custom-list text-sm" >
                                <li>manuellen Prozessen</li>
                                <li>WhatsApp-Kommunikation</li>
                                <li>fragmentierten Dokumenten</li>
                            </ul>
                            <ul className="custom-list text-sm" >
                                <li>unsynchronisierten Zahlungen</li>
                                <li>nicht verifizierbaren Status</li>
                                <li>fehlender Echtzeit-Compliance</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-red-950/20 border border-red-900/30 rounded text-sm text-red-200">
                            <strong>Das führt zu:</strong> Betrugsrisiken, Zahlungsunsicherheit, Zollproblemen, Lieferverzögerungen, fehlender Haftungsklarheit und operativer Intransparenz.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="lux-panel p-6 rounded-lg border-l-4 border-l-accent">
                        <h4 className="text-xl font-bold text-white mb-4">Die Lösung: Governed State Transitions</h4>
                        <p className="text-gray-400 text-sm mb-4">CARSHUNTER trennt bewusst:</p>
                        <div className="flex items-center gap-4 text-center mb-6">
                            <div className="flex-1 py-2 px-4 bg-white/5 border border-white/10 rounded text-white text-sm">Operative Eingabe</div>
                            <div className="text-gold font-bold text-xl">≠</div>
                            <div className="flex-1 py-2 px-4 bg-accent/10 border border-accent/30 rounded text-accent text-sm">Autorisierte Ausführung</div>
                        </div>
                        <ul className="custom-list accent-list text-sm mb-2">
                            <li>ein manipulationsresistenter Prozessfluss</li>
                            <li>ein unveränderliches Event-Ledger</li>
                            <li>eine vollständig nachvollziehbare Execution-Historie</li>
                        </ul>
                    </div>

                    <div className="lux-panel p-6 rounded-lg">
                        <h4 className="text-lg font-bold text-white mb-3">Legacy Pattern vs Governed Execution</h4>
                        <div className="text-xs space-y-3">
                            <div className="p-3 bg-gray-900 rounded border border-gray-800">
                                <span className="text-gray-500 font-bold block mb-1">LEGACY SYSTEME:</span>
                                <span className="text-gray-400">Direkte Datenbankänderung → Status aktualisiert → <span className="text-red-400">Keine Nachweise</span></span>
                            </div>
                            <div className="p-3 bg-green-950/20 rounded border border-green-900/40">
                                <span className="text-green-500 font-bold block mb-1">CARSHUNTER:</span>
                                <span className="text-gray-300">Execution Request → Governance Validation → Evidence Creation → Authorized State Transition</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Slide 4: HOW */}
    <section className="slide" id="slide-4">
        <div className="max-w-6xl">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">03. How — Wie funktioniert das System?</h2>
            <h3 className="text-4xl font-display text-white mb-10">Die Tri-Layer Architektur</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm mb-8">
                {/* Layer 1 */}
                <div className="lux-panel p-6 rounded-xl border-t border-gray-700">
                    <h4 className="font-bold text-white mb-1">🖥️ Layer 1 — Boundary Layer (UI)</h4>
                    <p className="text-xs text-accent font-mono mb-4">NEXT.JS</p>
                    <p className="text-gray-400 mb-4">Das Frontend- und Präsentationssystem (Investor Dashboards, Agenten-Portale, Kundenübersichten, Evidence Visualization, Status Monitoring).</p>
                    <div className="p-3 bg-red-950/10 border border-red-900/20 rounded">
                        <p className="text-gray-300 mb-2 font-bold">Der Boundary Layer besitzt:</p>
                        <ul className="text-red-300/80 text-xs space-y-1 ml-4 list-disc">
                            <li>keine direkte Autorität</li>
                            <li>keine Exportrechte</li>
                            <li>keine Governance-Berechtigung</li>
                        </ul>
                    </div>
                    <p className="text-gray-400 text-xs mt-3 italic">Die UI fordert Informationen ausschließlich über validierte Governance-Flows an.</p>
                </div>
                {/* Layer 2 */}
                <div className="lux-panel p-6 rounded-xl border-t border-gray-700 border-gold/30 relative z-10 scale-105">
                    <h4 className="font-bold text-white mb-1">⚙️ Layer 2 — Operational Layer</h4>
                    <p className="text-xs text-accent font-mono mb-4">FLASK / SQLITE → PostgreSQL</p>
                    <p className="text-gray-400 mb-4">Das operative Kernsystem für: Agenten, Intake-Prozesse, Fahrzeugverwaltung, Budgets, Beschaffungsprozesse, Kunden-Onboarding.</p>
                    <p className="text-gray-300 mb-2 font-bold">Der Layer arbeitet mit:</p>
                    <ul className="custom-list text-xs mb-4">
                        <li>strengen State Machines</li>
                        <li>DAG-basierten Übergängen</li>
                        <li>rollenbasierter Prozesslogik</li>
                    </ul>
                    <p className="text-gold text-xs font-bold p-2 bg-gold/10 border border-gold/20 rounded">Aber: Der Operational Layer kann keine finalen Zustände eigenständig autorisieren.</p>
                </div>
                {/* Layer 3 */}
                <div className="lux-panel p-6 rounded-xl border-t border-gray-700">
                    <h4 className="font-bold text-white mb-1">🛡️ Layer 3 — Governance Gate</h4>
                    <p className="text-xs text-accent font-mono mb-4">FASTAPI (ALCATARA)</p>
                    <p className="text-gray-400 mb-4">Die höchste Kontrollinstanz. Validiert Compliance, Zahlungsstatus, Exportfreigaben, Rollenberechtigungen, Risiko-Policies, Dokumentationsintegrität.</p>
                    <p className="text-gray-300 mb-2 font-bold">Nach erfolgreicher Prüfung erzeugt das System:</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-green-400">evidence_id</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-green-400">governance_signature</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-green-400">immutable_audit_event</span>
                    </div>
                    <p className="text-accent text-xs font-bold italic">Erst danach darf ein Statuswechsel stattfinden.</p>
                </div>
            </div>

            {/* Formal Execution Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="lux-panel p-6 rounded-lg text-sm">
                    <h4 className="text-gold font-bold mb-3">FORMAL EXECUTION MODEL: State Machine</h4>
                    <p className="text-gray-400 text-xs mb-3">Jede kritische Operation folgt einem festen Übergangssystem:</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono mb-4">
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded">INTAKE</span><span className="text-gray-600">→</span>
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded">VERIFIED</span><span className="text-gray-600">→</span>
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded">PAYMENT_CONFIRMED</span><span className="text-gray-600">→</span>
                        <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">EXPORT_AUTHORIZED</span><span className="text-gray-600">→</span>
                        <span className="bg-green-900 text-green-200 px-2 py-1 rounded">RELEASED</span><span className="text-gray-600">→</span>
                        <span className="bg-gold/30 text-gold px-2 py-1 rounded">COMPLETED</span>
                    </div>
                    <p className="text-red-400 text-xs italic">Übergänge außerhalb des definierten Governance-Flows sind systemisch blockiert.</p>
                </div>
                <div className="lux-panel p-6 rounded-lg text-sm">
                    <h4 className="text-gold font-bold mb-3">IMMUTABLE EVENT LEDGER</h4>
                    <p className="text-gray-400 text-xs mb-2">Alle kritischen Aktionen werden dauerhaft protokolliert:</p>
                    <ul className="text-xs text-gray-300 list-disc ml-4 mb-3 marker:text-gray-600 space-y-1">
                        <li>wer gehandelt hat</li>
                        <li>wann gehandelt wurde</li>
                        <li>welche Evidence genutzt wurde</li>
                        <li>welche Autorisierung vorlag</li>
                        <li>welcher Zustand verändert wurde</li>
                    </ul>
                    <p className="text-accent font-bold text-xs">Vollständige Auditierbarkeit & Vertrauen ohne Blindvertrauen.</p>
                </div>
            </div>
        </div>
    </section>

    {/* Slide 5: ROADMAP */}
    <section className="slide" id="slide-5">
        <div className="max-w-5xl">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">04. Roadmap & Timeline</h2>
            
            <div className="relative border-l-2 border-gray-800 ml-4 space-y-12 pl-10 mt-12">
                <div className="relative">
                    <div className="absolute -left-[49px] top-1 w-6 h-6 rounded-full bg-accent ring-4 ring-dark"></div>
                    <h4 className="text-xl font-bold text-white mb-2">STATUS QUO — 2026</h4>
                    <p className="text-gold text-sm font-bold mb-3">MVP erfolgreich abgeschlossen. Die Kernarchitektur ist validiert.</p>
                    <div className="bg-[#111] p-4 rounded border border-gray-800">
                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-bold">Bereits implementiert:</p>
                        <ul className="flex flex-wrap gap-2 text-xs">
                            <li className="px-3 py-1 bg-white/5 rounded">Tri-Layer Architektur</li>
                            <li className="px-3 py-1 bg-white/5 rounded">Governance Gate</li>
                            <li className="px-3 py-1 bg-white/5 rounded text-accent">Execution Request Pattern</li>
                            <li className="px-3 py-1 bg-white/5 rounded text-accent">Evidence-basierte Autorisierung</li>
                            <li className="px-3 py-1 bg-white/5 rounded">Rollenlogik</li>
                            <li className="px-3 py-1 bg-white/5 rounded">Audit-Mechanismen</li>
                        </ul>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-[49px] top-1 w-6 h-6 rounded-full bg-gray-700 ring-4 ring-dark border-2 border-gray-500"></div>
                    <h4 className="text-xl font-bold text-white mb-2">PHASE 2 — ENTERPRISE SCALING</h4>
                    <p className="text-gray-300 text-sm mb-3">Infrastruktur-Härtung</p>
                    <div className="bg-[#111] p-4 rounded border border-gray-800 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Migration auf:</p>
                            <ul className="text-gray-300 text-sm font-mono space-y-1">
                                <li>• PostgreSQL</li>
                                <li>• Redis</li>
                                <li>• RabbitMQ</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Ziele:</p>
                            <ul className="text-gray-300 text-xs space-y-1">
                                <li>• asynchrone Hochlastverarbeitung</li>
                                <li>• Queue-basierte Governance-Flows</li>
                                <li>• horizontale Skalierbarkeit</li>
                                <li>• erhöhte Ausfallsicherheit</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-[49px] top-1 w-6 h-6 rounded-full bg-gray-800 ring-4 ring-dark border-2 border-gray-600"></div>
                    <h4 className="text-xl font-bold text-gray-300 mb-2">PHASE 3 — LIVE ROLLOUT</h4>
                    <p className="text-gray-400 text-sm mb-3">Offizielle Integrationen</p>
                    <div className="bg-[#0a0a0a] p-4 rounded border border-gray-900 border-dashed">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Geplante Erweiterungen:</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                            <span className="px-2 py-1 border border-gray-800 rounded">Bank-Schnittstellen</span>
                            <span className="px-2 py-1 border border-gray-800 rounded">Escrow-Automation</span>
                            <span className="px-2 py-1 border border-gray-800 rounded">Zoll-APIs</span>
                            <span className="px-2 py-1 border border-gray-800 rounded">Dokumentenvalidierung</span>
                            <span className="px-2 py-1 border border-gray-800 rounded">globale Agentenstruktur</span>
                            <span className="px-2 py-1 border border-gray-800 rounded">Echtzeit-Compliance-Monitoring</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Slide 6: IMPACT */}
    <section className="slide" id="slide-6">
        <div className="max-w-6xl">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">05. Impact & Strategic Advantage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Trustless Execution */}
                <div className="lux-panel p-8 rounded-xl">
                    <h4 className="text-2xl font-bold text-white mb-4">Trustless Execution</h4>
                    <p className="text-gray-300 mb-6 text-sm">CARSHUNTER ersetzt blindes Vertrauen durch überprüfbare Governance.</p>
                    <p className="text-gray-400 text-xs mb-3 font-bold uppercase">Jeder Status:</p>
                    <ul className="custom-list text-sm">
                        <li>ist belegbar</li>
                        <li>ist auditierbar</li>
                        <li>ist kryptografisch nachvollziehbar</li>
                    </ul>
                </div>

                {/* De-Coupled */}
                <div className="lux-panel p-8 rounded-xl border-t-4 border-accent">
                    <h4 className="text-2xl font-bold text-white mb-4">De-Coupled Authority Architecture</h4>
                    <p className="text-gray-300 mb-4 text-sm">Die Trennung von <span className="text-white font-bold">UI</span>, <span className="text-white font-bold">Operation</span> und <span className="text-white font-bold">Governance</span> ermöglicht:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-accent">massive Skalierung</div>
                        <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-accent">höhere Sicherheit</div>
                        <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-accent">kontrollierte Autorität</div>
                        <div className="p-2 bg-white/5 border border-white/10 rounded text-center text-accent">reduzierte Risiken</div>
                    </div>
                </div>

                {/* White-Label Framework */}
                <div className="lux-panel p-8 rounded-xl md:col-span-2 border border-gold/40 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 text-9xl text-white opacity-5 select-none">🌐</div>
                    <div className="relative z-10">
                        <h4 className="text-2xl font-bold text-gold mb-3">White-Label Governance Framework</h4>
                        <p className="text-gray-300 text-sm mb-4">CARSHUNTER ist nur der erste vertikale Einsatz. Das eigentliche Asset ist das zugrundeliegende:</p>
                        <p className="text-2xl font-display text-white mb-4">Governed State Transition Framework</p>
                        <p className="text-gray-400 text-xs mb-3 mt-4">Ein universelles Governance-System für Branchen mit kritischen Übergängen:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">internationale Logistik</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Zollabwicklung</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Treuhandprozesse</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Procurement</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Banking Workflows</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">digitale Compliance-Systeme</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Supply-Chain Governance</span>
                            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">staatliche Audit-Infrastrukturen</span>
                        </div>
                    </div>
                </div>
            </div>

            

        </div>
    </section>


    {/* Slide 7: STRATEGIC DOCTRINE */}
    <section className="slide" id="slide-7">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-gold text-sm tracking-widest uppercase mb-2">06. Strategic Doctrine</h2>
            <h3 className="text-4xl font-display text-white mb-12">The Ecosystem Evolution</h3>
            
            <div className="flex flex-col gap-6 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-800"></div>

                {/* Layer 1 */}
                <div className="lux-panel p-6 rounded-xl relative ml-8 border border-gray-800">
                    <div className="absolute -left-[45px] top-6 w-5 h-5 rounded-full bg-gray-600 ring-4 ring-[#1a1a24] z-10"></div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Layer 1 — Market Entry</p>
                    <h4 className="text-2xl font-bold text-white mb-2">CARS<span className="text-accent">HUNTER</span></h4>
                    <p className="text-gray-400 text-sm">Vehicle sourcing & governed trade execution. Das operative Erst-Deployment und die erste Validierungsphase im Markt.</p>
                </div>

                {/* Layer 2 */}
                <div className="lux-panel p-6 rounded-xl relative ml-8 border border-accent/30">
                    <div className="absolute -left-[45px] top-6 w-5 h-5 rounded-full bg-accent ring-4 ring-[#1a1a24] z-10"></div>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">Layer 2 — Infrastructure</p>
                    <h4 className="text-2xl font-bold text-white mb-2">Governed Transaction Infrastructure</h4>
                    <p className="text-gray-400 text-sm">State-grade trade infrastructure, Procurement, Customs, Finance, Escrow und Audit Layers. Das System unterbaut delegierte Autorität in grenzüberschreitenden Transaktionen.</p>
                </div>

                {/* Layer 3 */}
                <div className="lux-panel p-8 rounded-xl border border-gold/40 relative ml-8 overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-5 text-9xl select-none">🏛️</div>
                    <div className="absolute -left-[47px] top-8 w-6 h-6 rounded-full bg-gold ring-4 ring-[#1a1a24] z-10"></div>
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-2">Layer 3 — Civilization Thesis</p>
                    <h4 className="text-3xl font-display font-bold text-white mb-4">Authority-Preserving Execution Systems</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-3xl">
                        Die Aufrechterhaltung von kohärenter Ausführung in einer Umgebung sich beschleunigender Komplexität. Ein Sovereign-Grade Framework für institutionalisierte Ordnung.
                    </p>
                    <div className="p-5 border-l-2 border-gold bg-gold/5 max-w-fit">
                        <p className="text-xl font-display text-gray-200 italic tracking-wide">&quot;Civilizations do not build pyramids during drift.&quot;</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-20 text-center pb-8 border-t border-gray-800 pt-12">
                <p className="text-gray-600 font-bold tracking-[0.3em] uppercase text-[10px] mb-3">Classification System</p>
                <p className="text-white tracking-[0.2em] font-mono text-sm border border-gray-700 inline-block px-4 py-2 bg-gray-900/50 rounded">
                    DOCTRINE-BACKED OPERATIONAL SOFTWARE
                </p>
            </div>
        </div>
    </section>

        </div>
    );
}
