/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Optional React adapter. React is not a mandatory project dependency.
 */

import React from "react";

export function ConfidenceDot({ status = "hypothesis", label = status }) {
  const safe = ["confirmed", "probable", "hypothesis"].includes(status) ? status : "hypothesis";
  return (
    <span className={`ds-confidence ds-confidence--${safe}`}>
      <span className="ds-confidence__dot" aria-hidden="true" />
      <span className="ds-confidence__label">{label}</span>
    </span>
  );
}

export function ProvenanceNote({ eyebrow = "Proveniência", children }) {
  return (
    <aside className="ds-provenance-note">
      <p className="ds-provenance-note__eyebrow">{eyebrow}</p>
      <p className="ds-provenance-note__text">{children}</p>
    </aside>
  );
}

export function StatusBadge({ children = "Beta" }) {
  return <span className="ds-status-badge">{children}</span>;
}
