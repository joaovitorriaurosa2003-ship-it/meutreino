# MeuTreino

App de treino (academia e cardio) de João Vitor Riau Rosa, com painel do treinador e área do atleta. Arquivo único em HTML, login com Google, dados no Firestore, instalável no celular (PWA). Publicado em meutreino.joaorosapsi.com.br via GitHub Pages.

Enquanto o Firebase não estiver configurado, o app funciona em **modo local** (dados salvos só no navegador).

## 1. Firebase (já configurado)

Projeto `meutreino-324ac`: login com Google ativo, domínio autorizado, Firestore em São Paulo com as regras do `firestore.rules` publicadas, e configuração já colada no `index.html`.

### Para recriar do zero

1. Acesse console.firebase.google.com e clique em **Adicionar projeto**. Nome: `meutreino`.
2. **Authentication** > Começar > **Método de login** > ative **Google**.
3. **Authentication** > Configurações > **Domínios autorizados** > adicione `meutreino.joaorosapsi.com.br`.
4. **Firestore Database** > Criar banco de dados > modo de produção > região `southamerica-east1` (São Paulo).
5. Em **Firestore > Regras**, cole o conteúdo do arquivo `firestore.rules` e publique.
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

## Perfis e acesso

- **Administrador** (joaovitorriaurosa2003@gmail.com): cadastra e bloqueia treinadores na aba **Equipe**, vê todos os atletas e pode editar qualquer treino da biblioteca. Também é treinador.
- **Treinador**: entra com o e-mail Google cadastrado pelo administrador. Cadastra os próprios atletas, monta e gera treinos, define a semana de cada atleta e acompanha o progresso. Só vê os atletas que cadastrou.
- **Atleta**: entra com o e-mail Google que o treinador cadastrou. Vê a semana e os treinos enviados, registra cargas, cardio e medidas. Não edita os treinos.
- **Biblioteca compartilhada**: todo treino montado ou gerado por um treinador fica visível para todos os treinadores. Só o autor (ou o administrador) edita ou exclui; os outros podem atribuir ou copiar.
- Ao atribuir, o atleta recebe uma cópia do treino. Ajustes feitos para um atleta não mudam a biblioteca. Se o autor atualizar o treino, aparece a opção "Atualizar para a versão nova".
- Quem é treinador e atleta ao mesmo tempo alterna em Ajustes ("Abrir meu treino" / "Abrir painel do treinador").
- E-mail sem cadastro vê a tela "Acesso ainda não liberado" com o próprio e-mail para enviar ao treinador.

## Estrutura dos dados

```
treinadores/{email}            nome, ativo, criado
treinos/{id}                   nm, ex[], gen, autorEmail, autorNome, criado, atualizado
atletas/{email}                nome, nascimento, altura, obs, treinadorEmail, perfil{objetivo,nivel,pesoInicial,inicio},
                               inicio, agenda[7], treinos[] (cópias), rascunho, ultimo{ts,nm}
atletas/{email}/historico/{id} date, nm, k, det[] (cargas) ou mod, min (cardio), ts
atletas/{email}/medidas/{id}   date, peso, cintura, ts
usuarios/{uid}                 dados antigos do uso pessoal (só leitura, importados em Equipe > Meu treino pessoal)
```

As regras em `firestore.rules` garantem: só o administrador grava treinadores; só treinadores leem a biblioteca; o atleta lê só o próprio documento e altera apenas rascunho, perfil, início e último treino; o treinador só acessa os atletas dele.

## Biblioteca de exercícios (`exercicios.json`)

782 exercícios da Free Exercise DB (domínio público, Unlicense), com nomes traduzidos para o português e organizados por grupo muscular: Peito, Costas, Ombros, Bíceps, Tríceps, Antebraço, Abdômen, Pernas, Glúteos, Panturrilhas, Pescoço, Cardio e Alongamento.

Campos de cada exercício: `id`, `nome`, `nome_en`, `grupo`, `primarios`, `secundarios`, `mapa` (músculos no mapa do app), `equipamento`, `nivel`, `categoria`, `mecanica`, `forca`, `impacto` (alto = pliometria), `imagens` (duas fotos, início e fim do movimento) e `instrucoes_en`.

As fotos vêm do CDN jsDelivr, fixadas no commit indicado em `commit`, e alternam no app como uma animação.

## Treinos

- **Plano:** A, B e C da rotina semanal, com séries e repetições que mudam conforme a fase.
- **Meus treinos:** montados no app (Treinos > Meus treinos > Montar novo treino). Escolha o grupo muscular, adicione exercícios da biblioteca, defina séries e repetições (em branco segue a fase) e a ordem. Ficam salvos na conta (`usuarios/{uid}.treinos`).
- **Gerador automático:** Treinos > Gerar programa automático. Escolha dias por semana (2 a 6), local (academia, só halteres ou em casa) e tempo por treino (30, 45 ou 60 min). O app monta a divisão (full body, superior/inferior, grupos por dia ou empurrar/puxar/pernas) só com exercícios de baixo impacto, com séries, repetições, descanso e carga sugerida (última carga registrada). Em 30 min, usa bi-sets. Pode salvar e já distribuir na semana.
- **Semana:** Treinos > Semana. Escolha o que fazer em cada dia (treino, cardio, caminhada leve ou descanso). A tela Hoje segue essa agenda (`usuarios/{uid}.agenda`).
- **Campos por exercício:** séries, repetições, descanso (com cronômetro automático ao marcar a série), carga alvo, método (bi-set com o próximo ou drop-set na última série) e observação.
- **Modelos:** seis treinos prontos de baixo impacto: Full body em máquinas; Peito, ombros e tríceps; Costas e bíceps; Pernas e glúteos sem impacto; Halteres (casa ou academia); Core e mobilidade. Dá para começar direto ou copiar e editar.

## GIFs dos exercícios

Coloque os arquivos em `gifs/` com o id do exercício (ex.: `gifs/legpress.gif`) e adicione o id na lista `GIFS_PRONTOS` no `index.html`. Ids: legpress, puxada, supmaq, remsent, flexora, prancha, sentlev, desenv, puxneutra, crucifixo, extensora, panturrilha, deadbug, supinc, remuni, abducao, roscapolia, tricpolia, farmer, bike, eliptico, esteira, hidro, caminhada.

## Ao publicar uma nova versão

Troque a versão (`meutreino-v5`) no `sw.js` (v2, v3...) para os celulares baixarem a versão nova.
