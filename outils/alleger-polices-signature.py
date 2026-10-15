"""Les 7 polices ajoutées pour Signature (15/10/2026), allégées comme celles des univers (alleger-polices.py du
23/09) : caractères ramenés au français et au Latin-1 complet, mentions de droits et de licence gardées."""
import io, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

CARACTERES = ("U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+0178,U+02C6,U+02DC,U+2013-2014,U+2018-201A,"
              "U+201C-201E,U+2020-2022,U+2026,U+202F,U+2030,U+2039-203A,U+2044,U+20AC,U+2122,U+2190-2193,U+2212")
POLICES = {   # fichier servi : (fichier d'origine de github.com/google/fonts, axes figés à leur valeur par défaut)
    "cormorant.woff2": ("Cormorant[wght].ttf", {}),
    "cormorant-italique.woff2": ("Cormorant-Italic[wght].ttf", {}),
    "eb-garamond.woff2": ("EBGaramond[wght].ttf", {}),
    "eb-garamond-italique.woff2": ("EBGaramond-Italic[wght].ttf", {}),
    "young-serif.woff2": ("YoungSerif-Regular.ttf", {}),
    "bricolage-grotesque.woff2": ("BricolageGrotesque[opsz,wdth,wght].ttf", {"wdth": 100}),
    "dm-sans.woff2": ("DMSans[opsz,wght].ttf", {}),
    "dm-sans-italique.woff2": ("DMSans-Italic[opsz,wght].ttf", {}),
    "work-sans.woff2": ("WorkSans[wght].ttf", {}),
    "work-sans-italique.woff2": ("WorkSans-Italic[wght].ttf", {}),
    "source-serif-4.woff2": ("SourceSerif4[opsz,wght].ttf", {}),
    "source-serif-4-italique.woff2": ("SourceSerif4-Italic[opsz,wght].ttf", {}),
}

def main(source: Path, cible: Path):
    cible.mkdir(parents=True, exist_ok=True)
    for nom, (origine, axes) in POLICES.items():
        f = TTFont(source / origine)
        if axes:
            f = instancer.instantiateVariableFont(f, axes)
            t = io.BytesIO(); f.flavor = None; f.save(t); t.seek(0); f = TTFont(t)
        o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["*"]; o.name_IDs = ["*"]
        o.name_languages = ["*"]; o.notdef_outline = True
        o.drop_tables = [x for x in o.drop_tables if x != "STAT"]
        s = subset.Subsetter(o); s.populate(unicodes=subset.parse_unicodes(CARACTERES)); s.subset(f)
        f.flavor = "woff2"; f.save(cible / nom)
        axes_f = [(a.axisTag, a.minValue, a.maxValue) for a in f["fvar"].axes] if "fvar" in f else "statique"
        print(f"{nom}: {(cible / nom).stat().st_size // 1024} Ko {axes_f}")

if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
