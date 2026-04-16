from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.document import Document as DocumentObject
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


DOCS_DIR = Path("docs")


def iter_blocks(document: DocumentObject):
    body = document.element.body
    for child in body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def normalize_text(text: str) -> str:
    return text.replace("\xa0", " ").replace("\r", "")


def escape_table_cell(text: str) -> str:
    return normalize_text(text).replace("|", r"\|").replace("\n", "<br>")


def format_run(run) -> str:
    text = normalize_text(run.text)
    if not text:
        return ""

    if run.bold:
        text = f"**{text}**"
    if run.italic:
        text = f"*{text}*"
    return text


def format_paragraph(paragraph: Paragraph) -> str:
    text = "".join(format_run(run) for run in paragraph.runs).strip()
    if not text:
        return ""

    style_name = getattr(paragraph.style, "name", "") or ""
    lower_style = style_name.lower()

    if lower_style.startswith("heading"):
        try:
            level = int(style_name.split()[-1])
        except ValueError:
            level = 1
        level = min(max(level, 1), 6)
        return f"{'#' * level} {text}"

    if style_name == "List Paragraph":
        return f"- {text}"

    return text


def format_table(table: Table) -> list[str]:
    rows = []
    for row in table.rows:
        cells = [escape_table_cell(cell.text.strip()) for cell in row.cells]
        rows.append(cells)

    if not rows:
        return []

    width = max(len(row) for row in rows)
    normalized = [row + [""] * (width - len(row)) for row in rows]
    header = normalized[0]
    separator = ["---"] * width

    lines = [
        f"| {' | '.join(header)} |",
        f"| {' | '.join(separator)} |",
    ]
    lines.extend(f"| {' | '.join(row)} |" for row in normalized[1:])
    return lines


def convert_docx(path: Path) -> Path:
    document = Document(path)
    lines: list[str] = []

    for block in iter_blocks(document):
        if isinstance(block, Paragraph):
            rendered = format_paragraph(block)
            if rendered:
                lines.append(rendered)
        else:
            table_lines = format_table(block)
            if table_lines:
                if lines and lines[-1] != "":
                    lines.append("")
                lines.extend(table_lines)

        if lines and lines[-1] != "":
            lines.append("")

    while lines and lines[-1] == "":
        lines.pop()

    output_path = path.with_suffix(".md")
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return output_path


def main() -> None:
    for path in sorted(DOCS_DIR.glob("*.docx")):
        output_path = convert_docx(path)
        print(f"Converted {path} -> {output_path}")


if __name__ == "__main__":
    main()
