/**
 * Slap Publicidade — recebe as inscrições do formulário e grava na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script, depois Implantar > Nova implantação > App da Web.
 */
const ABA = "Inscrições";
const COLUNAS = [
  ["enviadoEm", "Data"],
  ["nome", "Nome"],
  ["instagram", "Instagram"],
  ["whatsapp", "WhatsApp"],
  ["cidade", "Cidade"],
  ["uf", "UF"],
  ["nichos", "Nicho"],
  ["seguidores", "Seguidores"],
  ["views", "Views stories"],
  ["modelo", "Modelo de parceria"],
  ["dentroDoPerfil", "Dentro do perfil (2k+)"],
  ["origem", "Origem (UTM)"],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const dados = JSON.parse(e.postData.contents || "{}");
    const aba = obterAba_();
    const linha = COLUNAS.map(([chave]) => {
      const v = dados[chave] == null ? "" : String(dados[chave]).slice(0, 500);
      if (chave === "enviadoEm" && v) return new Date(v);
      // evita que o Sheets interprete texto como fórmula
      return /^[=+\-@]/.test(v) && chave !== "whatsapp" ? "'" + v : v;
    });
    // link direto para o WhatsApp do criador
    const num = String(dados.whatsapp || "").replace(/\D/g, "");
    linha.push(num ? "https://wa.me/55" + num : "");
    aba.appendRow(linha);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Slap · endpoint de inscrições ativo.");
}

function obterAba_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(ABA);
  if (!aba) {
    aba = ss.insertSheet(ABA);
    aba.appendRow(COLUNAS.map(([, titulo]) => titulo).concat("Chamar no WhatsApp"));
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, COLUNAS.length + 1).setFontWeight("bold").setBackground("#e3e7d9");
  }
  return aba;
}
