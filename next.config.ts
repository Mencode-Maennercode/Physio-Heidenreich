import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Statischer Export: `next build` erzeugt `out/` mit reinen HTML/JS/CSS-Dateien.
  // Genau das braucht der netcup-Webspace - dort laeuft kein Node-Server.
  output: "export",
  // Ohne Rewrite-Regeln liefert Apache nur `ordner/index.html` aus. Mit
  // trailingSlash entsteht je Route genau so ein Ordner.
  trailingSlash: true,
  // Der React Compiler laeuft als Babel-Pass ueber jede Datei und schaltet den
  // schnellen Rust-Pfad von Turbopack ab. Fuer eine ueberwiegend statische Seite
  // bringt er kaum Laufzeitvorteil, kostet aber viel Dev-Zeit.
  reactCompiler: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Der Bildoptimierer von Next braucht einen Server. Beim statischen Export
    // gibt es keinen, deshalb liegen alle Bilder fertig optimiert in public/.
    unoptimized: true,
  },
};

export default nextConfig;
