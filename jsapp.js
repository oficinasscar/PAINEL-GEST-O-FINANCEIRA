let globalData = null;

async function initApp() {
  const remoteData = await CSVLoader.fetchRemoteData();

  if (remoteData) {
    console.log("Dados atualizados via Google Sheets!");
  }

  try {
    const response = await fetch('data/sample_data.json');
    globalData = await response.json();
  } catch (err) {
    console.error("Erro ao carregar dados locais de fallback", err);
  }

  if (globalData) {
    renderDashboard();
  }

  FilterManager.init(() => renderDashboard());
  
  const btnReload = document.getElementById('btnReload');
  if (btnReload) {
    btnReload.addEventListener('click', () => initApp());
  }

  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('w-64');
      sidebar.classList.toggle('w-16');
      document.querySelectorAll('.sidebar-text').forEach(el => el.classList.toggle('hidden'));
    });
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  const activeTab = document.getElementById(`tab-${tabName}`);
  const activeNav = document.getElementById(`nav-${tabName}`);

  if (activeTab) activeTab.classList.remove('hidden');
  if (activeNav) activeNav.classList.add('active');
}

function renderDashboard() {
  if (!globalData) return;

  const selectedMonth = FilterManager.getSelectedMonth();
  const monthIdx = selectedMonth === 'TODOS' ? null : parseInt(selectedMonth) - 1;

  const summary = Calculations.calculateDRESummary(globalData.dre, monthIdx);
  renderKPIs(summary);

  const tbDRE = document.getElementById('tbDRE');
  if (tbDRE) TableManager.renderDRETable(tbDRE, globalData.dre, selectedMonth);

  const tbFluxo = document.getElementById('tbFluxo');
  if (tbFluxo) TableManager.renderFluxoTable(tbFluxo, globalData.fluxo_caixa);

  const tbRecebiveis = document.getElementById('tbRecebiveis');
  if (tbRecebiveis) TableManager.renderRecebiveisTable(tbRecebiveis, globalData.recebiveis);

  const tbAplicacoes = document.getElementById('tbAplicacoes');
  if (tbAplicacoes) TableManager.renderAplicacoesTable(tbAplicacoes, globalData.aplicacoes);

  const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const faturamentoSeries = globalData.dre.filter(d => d.grupo === 'FATURAMENTO BRUTO').reduce((acc, curr) => {
    curr.valores.forEach((v, i) => acc[i] = (acc[i] || 0) + v);
    return acc;
  }, []);

  const custosSeries = globalData.dre.filter(d => d.grupo === 'CUSTOS DIRECTOS').reduce((acc, curr) => {
    curr.valores.forEach((v, i) => acc[i] = (acc[i] || 0) + v);
    return acc;
  }, []);

  const lucrosSeries = MESES.map((_, i) => Calculations.calculateDRESummary(globalData.dre, i).lucroOperacional);

  ChartsManager.renderReceitaCustos('chartReceitaCustos', MESES, faturamentoSeries, custosSeries);
  ChartsManager.renderLucroMensal('chartLucroMensal', MESES, lucrosSeries);
  ChartsManager.renderDespesasPie('chartDespesas', summary.despPessoal, summary.despAdmin);
  ChartsManager.renderWaterfall('chartWaterfall', summary);

  let saldoAcumulado = globalData.fluxo_caixa.saldo_inicial;
  const saldosAcumulados = globalData.fluxo_caixa.entradas.map((e, i) => {
    saldoAcumulado += e + globalData.fluxo_caixa.saidas[i];
    return saldoAcumulado;
  });
  ChartsManager.renderEntradasSaidas('chartEntradasSaidas', MESES, globalData.fluxo_caixa.entradas, globalData.fluxo_caixa.saidas);
  ChartsManager.renderSaldoAcumulado('chartSaldoAcumulado', MESES, saldosAcumulados);

  const totalRecebidoCartao = globalData.recebiveis.reduce((acc, c) => acc + c.recebido, 0);
  const totalFuturoCartao = globalData.recebiveis.reduce((acc, c) => acc + c.futuro, 0);
  ChartsManager.renderRecebidoFuturo('chartRecebidoFuturo', totalRecebidoCartao, totalFuturoCartao);
  ChartsManager.renderOperadoras('chartOperadoras', globalData.recebiveis);

  const datasAplic = globalData.aplicacoes.map(a => a.data);
  const valoresAplic = globalData.aplicacoes.map(a => a.valor_atual);
  const fundosAplic = globalData.aplicacoes.map(a => a.fundo);
  ChartsManager.renderEvolucaoPatrimonial('chartEvolucaoPatrimonial', datasAplic, valoresAplic);
  ChartsManager.renderDistribuicaoFundos('chartDistribuicaoFundos', fundosAplic, valoresAplic);
}

function renderKPIs(s) {
  const container = document.getElementById('dreCards');
  if (!container) return;

  const kpis = [
    { title: 'Faturamento Bruto', val: Calculations.formatCurrency(s.faturamento), target: 'Meta: Crescimento' },
    { title: 'Lucro Operacional (R$)', val: Calculations.formatCurrency(s.lucroOperacional), target: 'Meta: > R$ 30k' },
    { title: 'Lucro Operacional (%)', val: Calculations.formatPercent(s.margemOperacional), target: 'Meta: ≥ 25%/mês', metaOK: s.margemOperacional >= 25 },
    { title: 'Despesas c/ Pessoal', val: Calculations.formatPercent(s.pctPessoal), target: 'Meta: < 7,5%/mês', metaOK: s.pctPessoal < 7.5 },
    { title: 'Despesas Admin', val: Calculations.formatPercent(s.pctAdmin), target: 'Meta: < 8,8%/mês', metaOK: s.pctAdmin < 8.8 },
    { title: 'Receita Líquida', val: Calculations.formatCurrency(s.receitaLiquida), target: 'Pós Deduções' },
    { title: 'Custos Diretos', val: Calculations.formatCurrency(Math.abs(s.custos)), target: 'CMV + CSP' },
    { title: 'Lucro Bruto', val: Calculations.formatCurrency(s.lucroBruto), target: 'Resultado Bruto' }
  ];

  container.innerHTML = kpis.map(k => `
    <div class="kpi-card flex flex-col justify-between">
      <span class="text-[10px] font-medium text-gray-500 uppercase tracking-wider">${k.title}</span>
      <span class="text-sm font-bold text-brand-primary my-1">${k.val}</span>
      <span class="text-[10px] ${k.metaOK === false ? 'text-red-600 font-semibold' : 'text-gray-400'}">${k.target}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});