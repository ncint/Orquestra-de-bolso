# Samples de percussão — pasta para carregamento

Coloca aqui os teus samples de percussão. A app procura-os
automaticamente por estas chaves (um ficheiro por botão):

| Chave (nome do ficheiro) | Instrumento | Botão |
|---|---|---|
| `djembe-grave.wav` | Djembé | nota grave |
| `djembe-slap.wav` | Djembé | slap |
| `cymbal-aberto.wav` | Prato | aberto |
| `cymbal-fechado.wav` | Prato | fechado/choke |
| `shaker-seco.wav` | Shaker | seco |
| `shaker-leve.wav` | Shaker | leve |
| `clap-forte.wav` | Clap | forte |
| `clap-suave.wav` | Clap | suave |
| `timbales-casara.wav` | Timbales | casara |
| `timbales-rim.wav` | Timbales | rimshot |

Formatos aceites: **WAV** (recomendado) e MP3.

Se um ficheiro destes existir, substitui a síntese; senão, toca o
som sintetizado actual (fallback). Também continuam a funcionar os
samples Sassaby originais na pasta `public/samples/`.

## Como carregar
GitHub → `public/samples/perc/` → *Add file → Upload files* →
arrasta os WAVs → *Commit*. Publica automaticamente.
