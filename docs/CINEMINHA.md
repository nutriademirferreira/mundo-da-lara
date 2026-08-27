# Cineminha — como publicar uma animação

1. Exporte o clipe em **.mp4 (H.264 + AAC)**, largura 720 ou 1080, retrato.
2. Salve em `video/` — por exemplo `video/lara-dancando.mp4`.
3. Abra `js/app.js`, ache o array `FILMES` e acrescente uma linha:

   ```js
   { arq:'lara-dancando', capa:'lara-festa', nome:'Dançando', fala:'Lara dançando.' }
   ```

   - `arq` — nome do arquivo em `video/`, sem a extensão
   - `capa` — nome de uma imagem de `img/`, sem `.webp` (é a capa do cartão)
   - `nome` — o que aparece embaixo do cartão
   - `fala` — o que o alto-falante lê em voz alta

O atalho **Cineminha** aparece sozinho na home assim que existir ao menos
um item na lista, e some de novo se a lista ficar vazia.

## Por que as animações ficam fora do modo offline

O app inteiro pesa ~2,7 MB e cabe no cache do service worker. Um clipe
sozinho pesa 1 a 2 MB — meia dúzia deles multiplicaria o download da
primeira abertura. Então `sw.js` deixa `.mp4`, `.webm` e `.mov` passarem
direto pra rede. Sem internet, o Cineminha mostra um aviso em vez de um
erro; o resto do app continua funcionando offline como sempre.
