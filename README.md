# Slap Publicidade · Formulário de Criadores

Página estática (um único `index.html`) com o formulário de inscrição de influenciadores em 8 etapas.
As respostas vão para uma planilha do Google Sheets via Google Apps Script.

## Deploy na Vercel
1. Na Vercel: **Add New → Project → Import** este repositório.
2. Framework Preset: **Other**. Sem build command, sem output directory.
3. Deploy. Cada push na `main` publica de novo.

## Conectar a planilha (uma vez)
1. Crie uma planilha no Google Sheets (ex: "Inscrições Slap").
2. **Extensões → Apps Script**, apague o conteúdo e cole o arquivo `apps-script/Code.gs`. Salve.
3. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize e copie a **URL do app da Web** (termina em `/exec`).
5. No `index.html`, preencha no topo do script:
   ```js
   const SHEETS_URL = "https://script.google.com/macros/s/.../exec";
   const AGENCY_WA  = "5571999999999"; // opcional: reserva via WhatsApp
   ```
6. Commit + push. A aba **Inscrições** é criada sozinha na primeira resposta.

> Se editar o `Code.gs` depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para manter a mesma URL.

## Rastreamento de anúncios
Parâmetros `utm_*`, `fbclid` e `src` da URL são salvos na coluna **Origem (UTM)**.
Ex: `https://seu-dominio.vercel.app/?utm_source=meta&utm_campaign=criadores`

## Meta Pixel (1080346988299156)
| Evento | Quando dispara |
|---|---|
| `PageView` | Abriu a página |
| `IniciouInscricao` (custom) | Clicou em "Iniciar inscrição" |
| `Lead` + `CompleteRegistration` | Enviou o formulário (otimizar a campanha por **Lead**) |
| `LeadQualificado` (custom) | Enviou e está dentro do perfil (2k+ seguidores e views acima de 2 mil) |
