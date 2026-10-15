# Polices hébergées avec les maquettes

Téléchargées depuis Google Fonts le 23/09/2026, avec l'accord de Rodolphe, pour que les sites clients n'appellent
plus de serveur tiers et suivent la règle « le poids est un argument » du dossier de conception. Les fichiers
d'origine, tels que Google les servait (sous-ensemble latin), sont dans `origine/`. Les fichiers de ce dossier en
sont des versions allégées par `outils/alleger-polices.py` : caractères ramenés au français et au Latin-1 complet,
et pour Fraunces, les deux réglages « douceur » et « formes bizarres » figés dans le fichier (version douce, sans
formes bizarres, décision de Rodolphe du 23/09) ; graisse et taille optique restent entières. La licence le permet ;
les mentions de droits et de licence restent inscrites dans chaque fichier (table « name »).

| Fichier | Police | Droits | Licence |
|---|---|---|---|
| `fraunces.woff2`, `fraunces-italique.woff2` | Fraunces (variable) | Copyright 2020 The Fraunces Project Authors (github.com/undercasetype/Fraunces) | SIL Open Font License 1.1 |
| `nunito-sans.woff2` | Nunito Sans (variable) | Copyright 2016 The Nunito Sans Project Authors (github.com/Fonthausen/NunitoSans) | SIL Open Font License 1.1 |
| `caveat-600.woff2` | Caveat, graisse 600 | Copyright 2014 The Caveat Project Authors (github.com/googlefonts/caveat) | SIL Open Font License 1.1 |
| `bodoni-moda.woff2`, `bodoni-moda-italique.woff2` | Bodoni Moda (variable), univers Maison | Copyright 2020 The Bodoni Moda Project Authors (github.com/indestructible-type/Bodoni) | SIL Open Font License 1.1 |
| `manrope.woff2` | Manrope (variable), univers Maison | Copyright 2018 The Manrope Project Authors (github.com/googlefonts/manrope) | SIL Open Font License 1.1 |
| `jost.woff2`, `jost-italique.woff2` | Jost (variable), univers Horizon | Copyright 2020 The Jost Project Authors (github.com/indestructible-type) | SIL Open Font License 1.1 |
| `cormorant.woff2`, `cormorant-italique.woff2` | Cormorant (variable), Signature | Copyright 2015 the Cormorant Project Authors (github.com/CatharsisFonts/Cormorant) | SIL Open Font License 1.1 |
| `eb-garamond.woff2`, `eb-garamond-italique.woff2` | EB Garamond (variable), Signature | Copyright 2017 The EB Garamond Project Authors (github.com/octaviopardo/EBGaramond12) | SIL Open Font License 1.1 |
| `young-serif.woff2` | Young Serif, Signature | Copyright 2023 The Young Serif Project Authors (github.com/noirblancrouge/YoungSerif) | SIL Open Font License 1.1 |
| `bricolage-grotesque.woff2` | Bricolage Grotesque (variable, largeur figée à 100), Signature | Copyright 2022 The Bricolage Grotesque Project Authors (github.com/ateliertriay/bricolage) | SIL Open Font License 1.1 |
| `dm-sans.woff2`, `dm-sans-italique.woff2` | DM Sans (variable), Signature | Copyright 2014 The DM Sans Project Authors (github.com/googlefonts/dm-fonts) | SIL Open Font License 1.1 |
| `work-sans.woff2`, `work-sans-italique.woff2` | Work Sans (variable), Signature | Copyright 2019 The Work Sans Project Authors (github.com/weiweihuanghuang/Work-Sans) | SIL Open Font License 1.1 |
| `source-serif-4.woff2`, `source-serif-4-italique.woff2` | Source Serif 4 (variable), Signature | Copyright 2014 The Source Serif 4 Project Authors (github.com/adobe-fonts/source-serif) | SIL Open Font License 1.1 |

Bodoni Moda et Manrope ajoutées le 24/09/2026 pour Maison, téléchargées depuis Google Fonts avec l'accord de Rodolphe,
allégées aux mêmes caractères, sans aucun réglage figé. Licences vérifiées le 24/09 dans `ofl/bodonimoda/OFL.txt` et
`ofl/manrope/OFL.txt` du dépôt github.com/google/fonts : OFL 1.1, aucun nom réservé.
Jost ajoutée le même jour pour Horizon, dans les mêmes conditions (`ofl/jost/OFL.txt` : OFL 1.1, aucun nom réservé).

Texte de la licence : https://openfontlicense.org (également https://scripts.sil.org/OFL, inscrit dans les fichiers).
Aucune de ces polices ne déclare de nom réservé (« Reserved Font Name ») : les versions allégées peuvent garder
leur nom d'origine. Vérifié le 23/09 dans les fichiers de licence officiels du dépôt Google Fonts :
github.com/google/fonts, fichiers `ofl/fraunces/OFL.txt`, `ofl/nunitosans/OFL.txt` et `ofl/caveat/OFL.txt` (la ligne
de droits y est suivie directement du texte de licence, sans nom réservé).
À livrer avec chaque site client qui les utilise (ce fichier, ou le texte de la licence).

Sept polices ajoutées le 15/10/2026 pour la formule Signature (oui de Rodolphe : « couleurs et polices définies avec
vous »). Fichiers d'origine : les TTF variables de github.com/google/fonts (`ofl/cormorant`, `ofl/ebgaramond`,
`ofl/youngserif`, `ofl/bricolagegrotesque`, `ofl/dmsans`, `ofl/worksans`, `ofl/sourceserif4`), non recopiés ici
(plusieurs Mo) ; allégés par `outils/alleger-polices-signature.py` aux mêmes caractères que les autres. Licences
vérifiées le 15/10 dans le `OFL.txt` de chaque dossier : OFL 1.1, aucun nom réservé (Lora, Playfair Display et Libre
Baskerville, qui en déclarent un, ont été écartées : une version allégée devrait changer de nom).
