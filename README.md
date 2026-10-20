# 🎼 Orquestra de Bolso

Web app de criação musical colaborativa para workshops: cada celular vira um
instrumento e todos tocam juntos em tempo real, na mesma rede Wi-Fi.

## Como usar no workshop

1. **Prepare a rede**: conecte seu router à internet (opcional) e os celulares
   dos participantes ao Wi-Fi dele. O computador que roda o servidor deve estar
   na mesma rede (cabo no router ou no mesmo Wi-Fi).

2. **Rode o servidor** no seu computador (precisa de Node.js 18+):

   ```bash
   node server.js
   ```

   Ele imprime no terminal o endereço para os celulares, algo como
   `http://192.168.0.10:3000`.

3. **Participantes**: cada um abre esse endereço no navegador e escolhe
   Percussão ou Melodia — nada para instalar.

4. **Você (facilitador)**: abra `http://<seu-ip>:3000/?admin=1` para o painel
   de controle com os modos de jogo.

## Modos de jogo

- **Livre** — todos tocam como quiserem.
- **Grupos** — metade da sala em percussão, metade em melodia.
- **1 grupo por vez** — só o grupo ativo toca (bom para exercitar escuta e espera).
- **Onda sonora** — varredura sonora pela sala.

## Requisitos

- Node.js 18 ou superior (nenhuma dependência externa)
- Wi-Fi comportando os dispositivos (a maioria dos routers domésticos aceita 30+)
- Navegador moderno nos celulares (Android ou iPhone)
