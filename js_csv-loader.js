// Módulo para Conexão com Google Sheets (CSV Publicado)
const CSVLoader = {
  sheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSFzycVs0nB90ICJHwNSWhIA1S0syQh3ZSKjn6eqEHG0ICriC-dNz8w_-WWn_VtsA/pub?gid=1031320805&single=true&output=csv',

  async fetchRemoteData() {
    try {
      const response = await fetch(this.sheetUrl);
      if (!response.ok) throw new Error("Erro na requisição da planilha");
      const csvText = await response.text();
      return this.parseCSV(csvText);
    } catch (err) {
      console.warn("Falha ao carregar CSV do Google Sheets. Usando dados locais de reserva.", err);
      return null;
    }
  },

  parseCSV(csvText) {
    if (typeof Papa !== 'undefined') {
      const parsed = Papa.parse(csvText, { header: true, dynamicTyping: true });
      return parsed.data;
    }
    return null;
  }
};
