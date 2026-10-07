import InfoCard from "../components/InfoCard";

export default function AboutPage() {
  return <section className="simple-page"><p className="kicker">ABOUT GUNASO</p><h1>A simpler way to be heard.</h1><p>Gunaso gives residents and public offices a clear, transparent way to turn concerns into action.</p><div className="three-up"><InfoCard number="01" title="Built for citizens" text="File a report from any device without knowing which office to contact." /><InfoCard number="02" title="Built for action" text="Departments see the issues assigned to them and keep residents updated." /><InfoCard number="03" title="Built for trust" text="A transparent timeline shows what happened after a complaint was filed." /></div></section>;
}
