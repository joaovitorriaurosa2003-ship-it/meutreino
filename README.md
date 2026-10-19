# MeuTreino

App pessoal de treino (academia e cardio) de João Vitor Riau Rosa. Arquivo único em HTML, login com Google, dados no Firestore, instalável no celular (PWA). Publicado em meutreino.joaorosapsi.com.br via GitHub Pages.

Enquanto o Firebase não estiver configurado, o app funciona em **modo local** (dados salvos só no navegador).

## 1. Firebase (já configurado)

Projeto `meutreino-324ac`: login com Google ativo, domínio autorizado, Firestore em São Paulo com as regras do `firestore.rules` publicadas, e configuração já colada no `index.html`.

### Para recriar do zero

1. Acesse console.firebase.google.com e clique em **Adicionar projeto**. Nome: `meutreino`.
2. **Authentication** > Começar > **Método de login** > ative **Google**.
3. **Authentication** > Configurações > **Domínios autorizados** > adicione `meutreino.joaorosapsi.com.br`.
4. **Firestore Database** > Criar banco de dados > modo de produção > região `southamerica-east1` (São Paulo).
5. Em **Firestore > Regras**, cole o conteúdo do arquivo `firestore.rules` e publique. Só a conta joaovitorriaurosa2003@gmail.com consegue ler e gravar.
6. **Configurações do projeto** (engrenagem) > Seus apps > ícone **</>** (Web) > registre o app `MeuTreino`.
7. Copie o objeto `firebaseConfig` e cole no `index.html`, no lugar da linha que começa com `const FB_CONFIG={apiKey:"COLE_AQUI"`.

## 2. Publicar no GitHub Pages

1. Crie o repositório **privado** `meutreino` na conta `joaovitorriaurosa2003-ship-it`.
2. Envie todos os arquivos desta pasta.
3. **Settings > Pages** > Source: branch `main`, pasta `/ (root)`. O arquivo `CNAME` já define o domínio.
4. No DNS do `joaorosapsi.com.br`, crie um registro **CNAME**: nome `meutreino`, valor `joaovitorriaurosa2003-ship-it.github.io`.
5. Depois que o certificado sair, marque **Enforce HTTPS**.

Observação: GitHub Pages com repositório privado exige plano GitHub Pro.

## 3. Instalar no celular

O app é um PWA: instala direto do navegador, sem loja.

- **Android (Chrome):** abra meutreino.joaorosapsi.com.br, toque em **Instalar** no aviso da tela Hoje, ou nos três pontos > **Instalar app**.
- **iPhone (Safari):** abra o endereço no Safari > **Compartilhar** > **Adicionar à Tela de Início**.

Depois de instalado, abre em tela cheia, tem atalhos (toque longo no ícone: Treino de hoje, Registrar peso) e funciona sem internet, sincronizando quando a conexão volta.

Arquivos do PWA: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.

## Estrutura dos dados

```
usuarios/{uid}
  inicio: "2026-10-18"        data de início do plano
  rascunho: "{...}"           treino em andamento
usuarios/{uid}/historico/{id}
  date, nm, k, det[] (cargas) ou mod, min (cardio), ts
```

## Biblioteca de exercícios (`exercicios.json`)

782 exercícios da Free Exercise DB (domínio público, Unlicense), com nomes traduzidos para o português e organizados por grupo muscular: Peito, Costas, Ombros, Bíceps, Tríceps, Antebraço, Abdômen, Pernas, Glúteos, Panturrilhas, Pescoço, Cardio e Alongamento.

Campos de cada exercício: `id`, `nome`, `nome_en`, `grupo`, `primarios`, `secundarios`, `mapa` (músculos no mapa do app), `equipamento`, `nivel`, `categoria`, `mecanica`, `forca`, `impacto` (alto = pliometria), `imagens` (duas fotos, início e fim do movimento) e `instrucoes_en`.

As fotos vêm do CDN jsDelivr, fixadas no commit indicado em `commit`, e alternam no app como uma animação.

## Treinos

- **Plano:** A, B e C da rotina semanal, com séries e repetições que mudam conforme a fase.
- **Meus treinos:** montados no app (Treinos > Meus treinos > Montar novo treino). Escolha o grupo muscular, adicione exercícios da biblioteca, defina séries e repetições (em branco segue a fase) e a ordem. Ficam salvos na conta (`usuarios/{uid}.treinos`).
- **Modelos:** seis treinos prontos de baixo impacto: Full body em máquinas; Peito, ombros e tríceps; Costas e bíceps; Pernas e glúteos sem impacto; Halteres (casa ou academia); Core e mobilidade. Dá para começar direto ou copiar e editar.

## GIFs dos exercícios

Coloque os arquivos em `gifs/` com o id do exercício (ex.: `gifs/legpress.gif`) e adicione o id na lista `GIFS_PRONTOS` no `index.html`. Ids: legpress, puxada, supmaq, remsent, flexora, prancha, sentlev, desenv, puxneutra, crucifixo, extensora, panturrilha, deadbug, supinc, remuni, abducao, roscapolia, tricpolia, farmer, bike, eliptico, esteira, hidro, caminhada.

## Ao publicar uma nova versão

Troque `meutreino-v1` no `sw.js` (v2, v3...) para os celulares baixarem a versão nova.
