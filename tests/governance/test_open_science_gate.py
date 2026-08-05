# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.
"""
Testes do gate de Ciência Aberta (GOV-02), contrato GOV02_ACCEPTANCE_TESTS.md secção H.
Determinísticos, sem rede, com fixtures em diretórios temporários.
"""
import importlib.util
import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stdout, redirect_stderr
from pathlib import Path

_HERE = Path(__file__).resolve()
_GATE = _HERE.parents[2] / "scripts" / "governance" / "open_science_gate.py"
_spec = importlib.util.spec_from_file_location("os_gate", _GATE)
osg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(osg)

REQUIRED_DOCS = ["RT82_COMPLIANCE_MATRIX.md", "RESEARCH_OUTPUTS_REGISTER.json", "DATA_MANAGEMENT_PLAN_DRAFT.md",
                 "LICENSING_AND_RIGHTS_DECISIONS.md", "DEPOSIT_AND_PRESERVATION_PLAN_DRAFT.md",
                 "SHAREABLE_SKILLS_POLICY.md", "OPEN_SCIENCE_DECISIONS.json"]


def make_gov(tmp, pending=("HD-01", "HD-02", "HD-03", "HD-04", "HD-05", "HD-06", "HD-07"),
             security=False, restricted_paths=None):
    gov = Path(tmp) / "gov"
    gov.mkdir()
    decisions = {i: {"topic": i, "state": "PENDING-HUMAN" if i in pending else "CONFIRMED"}
                 for i in ("HD-01", "HD-02", "HD-03", "HD-04", "HD-05", "HD-06", "HD-07")}
    doc = {
        "decisions": decisions,
        "gate_profiles": {
            "baseline": {"requires_documents": REQUIRED_DOCS, "forbid_official_license_while_pending": True},
            "public-git-content": {"blocked_while_pending": ["HD-01", "HD-02"], "empty_public_knowledge_required": True},
            "release-or-deposit": {"blocked_while_pending": ["HD-01", "HD-03", "HD-04", "HD-05", "HD-06"]},
            "shareable-skill": {"blocked_while_pending": ["HD-03", "HD-07"], "requires_security_confirmed": True},
        },
        "public_proteus_snapshots": ["public/data/proteus-knowledge-public.json"],
        "official_license_files": ["LICENSE", "codemeta.json"],
        "security_hardening_confirmed": security,
    }
    (gov / "OPEN_SCIENCE_DECISIONS.json").write_text(json.dumps(doc))
    register = {"classification_values": ["public", "restricted", "controlled", "pending"],
                "outputs": [{"id": "museum-collection", "classification": "restricted", "paths": ["museum-collection"]}]}
    (gov / "RESEARCH_OUTPUTS_REGISTER.json").write_text(json.dumps(register))
    for d in REQUIRED_DOCS:
        p = gov / d
        if not p.exists():
            p.write_text("stub")
    return gov


def run(profile, gov, repo=".", snapshot=None):
    out, err = io.StringIO(), io.StringIO()
    args = ["--profile", profile, "--dir", str(gov), "--repo", str(repo)]
    if snapshot:
        args += ["--snapshot", str(snapshot)]
    with redirect_stdout(out), redirect_stderr(err):
        code = osg.main(args)
    return code, out.getvalue() + err.getvalue()


def write_snapshot(tmp, name, data):
    p = Path(tmp) / name
    p.write_text(json.dumps(data))
    return p


class OpenScienceGate(unittest.TestCase):
    def test_H01_baseline_pass(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            code, out = run("baseline", gov, repo=t)
            self.assertEqual(code, osg.EXIT_OK, out)

    def test_H06_official_license_blocks_baseline(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)  # HD-03 pending
            (Path(t) / "codemeta.json").write_text("{}")
            code, out = run("baseline", gov, repo=t)
            self.assertEqual(code, osg.EXIT_BLOCKED)
            self.assertIn("licença oficial", out)

    def test_H02_H08_public_content_inreview_blocks(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)  # HD-01/HD-02 pending
            snap = write_snapshot(t, "proteus-knowledge-public.json",
                                  {"assertions": [{"id": "a1", "status": "in_review"}], "entities": [], "relations": []})
            code, out = run("public-git-content", gov, repo=t, snapshot=snap)
            self.assertEqual(code, osg.EXIT_BLOCKED)

    def test_H03_public_knowledge_nonempty_blocks(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            snap = write_snapshot(t, "proteus-knowledge-public.json",
                                  {"assertions": [{"id": "a1", "status": "published"}], "entities": [], "relations": []})
            code, out = run("public-git-content", gov, repo=t, snapshot=snap)
            self.assertEqual(code, osg.EXIT_BLOCKED)

    def test_public_content_empty_passes_when_pending(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            snap = write_snapshot(t, "proteus-knowledge-public.json",
                                  {"assertions": [], "entities": [], "relations": []})
            code, out = run("public-git-content", gov, repo=t, snapshot=snap)
            self.assertEqual(code, osg.EXIT_OK, out)

    def test_H07_restricted_in_public_blocks(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            snap = write_snapshot(t, "proteus-catalog-public.json",
                                  {"works": [{"id": "museum-collection", "status": "published"}]})
            code, out = run("public-git-content", gov, repo=t, snapshot=snap)
            self.assertEqual(code, osg.EXIT_BLOCKED)

    def test_H04_release_or_deposit_blocks(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            code, out = run("release-or-deposit", gov, repo=t)
            self.assertEqual(code, osg.EXIT_BLOCKED)

    def test_H05_shareable_skill_blocks(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t)
            code, out = run("shareable-skill", gov, repo=t)
            self.assertEqual(code, osg.EXIT_BLOCKED)
            self.assertIn("segurança", out)

    def test_release_passes_when_all_confirmed(self):
        with tempfile.TemporaryDirectory() as t:
            gov = make_gov(t, pending=())  # nada pendente
            code, out = run("release-or-deposit", gov, repo=t)
            self.assertEqual(code, osg.EXIT_OK, out)


if __name__ == "__main__":
    unittest.main()
