# 🎼 Orquestra de Bolso — Bells & Handpan

Aplicação musical colectiva para workshops: cada participante usa o seu
telemóvel como instrumento musical. Versão 1 com **cinco naipes** —
Bells, Handpan, FM Bell, Sub Bass e Coro Formant — sobre a escala fixa de
**Ré menor natural**, com 50 lugares (10 por naipe).

## Como executar

1. Instalar [Node.js](https://nodejs.org) (18 ou superior). Não há mais
   dependências: nenhuma instalação `npm` é necessária.

2. Na pasta do projecto:

   ```bash
   node server.js
   ```

3. O terminal mostra o endereço local, por exemplo:

   ```
   Nos celulares:  http://192.168.0.10:3000
   ```

4. Abrir esse endereço no navegador do telemóvel, escolher **Bells** ou
   **Handpan** e tocar. Nada para instalar nos telemóveis.

## Versão 1 — o que está implementado

- **Seis naipes** (10 lugares cada, 60 no total), com tessituras
  deslocadas por oitava para não se acumularem na mesma zona:
  - **🔔 Bells** — sinos, 1 oitava acima (brilho)
  - **🥁 Handpan** — registo médio (corpo acústico)
  - **✨ FM Bell** — sino elétrico FM, 1 oitava acima (brilho electrónico)
  - **🌊 Sub Bass** — seno com queda de pitch, 2 oitavas abaixo (fundação)
  - **🗣 Coro Formant** — vogal sintética via bandpass duplo (coro robótico)
  - **🪘 Djembé** — percussão de membrana: toque grave seco e slap agudo
  - **🌌 Theremin** — melodia livre por arrasto (fora da atribuição por lugar)
- Reverb global (ConvolverNode com resposta ao impulso sintetizada de
  2,6 s, mix 18%) aplicado a todos os naipes
- Cada instrumento com **2 botões de nota** grandes (telemóvel em
  orientação vertical).
- **Escala fixa**: Ré menor natural (Ré – Mi – Fá – Sol – Lá – Sib – Dó).
- Atribuições (configuração central em `public/index.html`,
  `SESSION_CONFIG`):
  - Bells: **Ré** e **Lá**
  - Handpan: **Fá** e **Dó**
- Som **100% sintetizado localmente** com Web Audio API — sem ficheiros de
  áudio, sem URLs externas, sem Internet para reproduzir.
- Interação em dois passos: **toca no botão para armar a nota** (fica com
  contorno branco) e **agita o telemóvel para a tocar**. Tocar de novo no
  botão desarma-o.
- Detecção de agitação via acelerómetro (`devicemotion`), com limiar de
  intensidade e pausa mínima entre disparos. No iOS a permissão de
  movimento é pedida no momento de armar (requisito do Safari).
- O telemóvel **não precisa de estar a tocar no ecrã** para produzir o som
  depois da nota armada — ideal para gesto colectivo.
- Decaimento natural: a nota continua a soar depois de levantar o dedo.
- Timbres distintos:
  - **Bells**: parciais inarmónicos de sino (razões ~1 : 2.76 : 5.40 : 8.93),
    ataque rápido e ressonância longa.
  - **Handpan**: fundamental dominante com oitava/quinta suavizadas, ataque
    amortecido (~30 ms) e corpo tonal longo.
- Limitação de notas simultâneas (máx. 8 grupos de nota, com purga das
  terminadas) para evitar acumulação sonora em toques rápidos; ao exceder,
  a nota mais antiga desvanece suavemente em vez de cortar.
- Activação de áudio por interacção (requisito dos navegadores móveis):
  o ecrã indica "toca num botão para activar o som".
- Modo **lugar** (sem servidor): `?lugar=N` (1–50) atribui a esse
  lugar, de forma determinística e calculada localmente, um instrumento
  (Bells/handpan alternados por lugar) e **2 notas** com cobertura
  equilibrada das 5 notas da escala. Permite QR codes permanentes no
  GitHub Pages. Ex.: `https://ncint.github.io/Orquestra-de-bolso/?lugar=7`
  abre directamente o Handpan do lugar 7 (Fá e Dó). Sem servidor não é
  possível reconfigurar a escala ao vivo (nota de limitação).
- Contador de dispositivos ligados via SSE (opcional: se falhar, o
  instrumento continua a funcionar localmente).

## Arquitectura

- `server.js` — servidor HTTP em Node.js puro: ficheiros estáticos +
  stream SSE (`/events`) para o contador de dispositivos.
- `public/index.html` — aplicação completa do participante, organizada em
  módulos claros no script:
  1. **Configuração musical** — `SCALES` (escalas e notas) e `SESSION_CONFIG`
     (instrumentos e atribuição de notas). Preparado para no futuro receber a
     configuração de sessão do servidor (escala escolhida, notas por lugar).
  2. **Motor de áudio** (`AudioEngine`) — síntese e reprodução local.
  3. **Interface** — ecrãs de escolha e de instrumento.
  4. **Rede** — apenas contador; sem dependência para reproduzir.

## Testes

**Executados no ambiente de desenvolvimento:**
- Servidor arranca e serve a página (HTTP 200).
- Stream SSE abre e emite contagem de dispositivos.
- Verificação de sintaxe do código do cliente.
- Validação das frequências das notas atribuídas contra a escala.

**Ainda não realizados (requerem dispositivos físicos):**
- Latência e responsividade em telemóveis reais (Android/iOS).
- Activação de áudio no Safari iOS e Chrome Android.
- Comportamento com ~50 dispositivos no TP-Link Archer C50 AC1200.
  A rede local ainda não foi testada.

## Evolução prevista (versão 2 — ainda não implementada)

- Painel de controlo do maestro (escala, atribuição de notas, início/fim).
- QR codes permanentes: cada QR identifica um **lugar** na orquestra; a nota
  é atribuída pela configuração da sessão, não codificada no QR.
- Distribuição equilibrada de 2 notas por participante (~50 lugares).
- Actualização da configuração nos telemóveis através da rede local.
