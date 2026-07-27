// Módulo de Gerenciamento de Gráficos (Chart.js)
const ChartsManager = {
  instances: {},

  destroyChart(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  renderReceitaCustos(canvasId, meses, receitas, custos) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          { label: 'Faturamento Bruto', data: receitas, backgroundColor: '#0D47A1' },
          { label: 'Custos Diretos', data: custos.map(v => Math.abs(v)), backgroundColor: '#42A5F5' }
        ]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Receita Bruta vs. Custos Diretos (R$)' } } }
    });
  },

  renderLucroMensal(canvasId, meses, lucros) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Lucro Operacional (R$)',
          data: lucros,
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Evolução do Lucro Operacional Mensal' } } }
    });
  },

  renderDespesasPie(canvasId, despPessoal, despAdmin) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Despesas c/ Pessoal', 'Despesas Administrativas'],
        datasets: [{
          data: [Math.abs(despPessoal), Math.abs(despAdmin)],
          backgroundColor: ['#0D47A1', '#42A5F5']
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Distribuição das Despesas' } } }
    });
  },

  renderWaterfall(canvasId, summary) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Faturamento', 'Deduções', 'Custos', 'Pessoal', 'Admin', 'Lucro Op.'],
        datasets: [{
          label: 'DRE Destaque',
          data: [
            summary.faturamento,
            summary.deducoes,
            summary.custos,
            summary.despPessoal,
            summary.despAdmin,
            summary.lucroOperacional
          ],
          backgroundColor: ['#0D47A1', '#D32F2F', '#D32F2F', '#D32F2F', '#D32F2F', '#2E7D32']
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Visão Geral do Resultado (Waterfall)' } } }
    });
  },

  renderEntradasSaidas(canvasId, meses, entradas, saidas) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          { label: 'Entradas de Caixa', data: entradas, backgroundColor: '#2E7D32' },
          { label: 'Saídas de Caixa', data: saidas, backgroundColor: '#D32F2F' }
        ]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Entradas vs Saídas de Caixa' } } }
    });
  },

  renderSaldoAcumulado(canvasId, meses, saldos) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Saldo Acumulado (R$)',
          data: saldos,
          borderColor: '#0D47A1',
          borderWidth: 2,
          fill: false
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Evolução do Saldo de Caixa' } } }
    });
  },

  renderRecebidoFuturo(canvasId, recebido, futuro) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Recebido', 'A Receber (Futuro)'],
        datasets: [{
          data: [recebido, futuro],
          backgroundColor: ['#0D47A1', '#42A5F5']
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Proporção de Cartão Recebido vs. Futuro' } } }
    });
  },

  renderOperadoras(canvasId, operadoras) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: operadoras.map(o => o.operadora),
        datasets: [
          { label: 'Recebido', data: operadoras.map(o => o.recebido), backgroundColor: '#0D47A1' },
          { label: 'Futuro', data: operadoras.map(o => o.futuro), backgroundColor: '#42A5F5' }
        ]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Volume por Adquirente / Operadora' } } }
    });
  },

  renderEvolucaoPatrimonial(canvasId, datas, valores) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: datas,
        datasets: [{
          label: 'Patrimônio em Aplicações (R$)',
          data: valores,
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Evolução do Saldo Aplicado' } } }
    });
  },

  renderDistribuicaoFundos(canvasId, fundos, valores) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: fundos,
        datasets: [{
          data: valores,
          backgroundColor: ['#0D47A1', '#42A5F5', '#2E7D32', '#FFB300']
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Alocação por Fundo' } } }
    });
  }
};
