const Calculations = {
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  },

  formatPercent(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((value || 0) / 100);
  },

  sumArray(arr) {
    return arr.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  },

  calculateDRESummary(dreList, monthIndex = null) {
    let faturamento = 0, deducoes = 0, custos = 0, despPessoal = 0, despAdmin = 0;

    dreList.forEach(item => {
      const val = monthIndex !== null ? (item.valores[monthIndex] || 0) : this.sumArray(item.valores);
      if (item.grupo === 'FATURAMENTO BRUTO') faturamento += val;
      else if (item.grupo === 'DEDUÇÕES') deducoes += val;
      else if (item.grupo === 'CUSTOS DIRECTOS') custos += val;
      else if (item.conta === 'Despesas com Pessoal') despPessoal += val;
      else if (item.conta === 'Despesas Administrativas') despAdmin += val;
    });

    const receitaLiquida = faturamento + deducoes;
    const lucroBruto = receitaLiquida + custos;
    const lucroOperacional = lucroBruto + despPessoal + despAdmin;
    const margemOperacional = faturamento > 0 ? (lucroOperacional / faturamento) * 100 : 0;
    const pctPessoal = faturamento > 0 ? (Math.abs(despPessoal) / faturamento) * 100 : 0;
    const pctAdmin = faturamento > 0 ? (Math.abs(despAdmin) / faturamento) * 100 : 0;

    return {
      faturamento,
      deducoes,
      receitaLiquida,
      custos,
      lucroBruto,
      despPessoal,
      despAdmin,
      lucroOperacional,
      margemOperacional,
      pctPessoal,
      pctAdmin
    };
  }
};