// Módulo de Renderização de Tabelas
const TableManager = {
  renderDRETable(tbBody, dreList, selectedMonth) {
    tbBody.innerHTML = '';
    
    dreList.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = "border-b hover:bg-gray-50";

      let cells = `<td class="px-4 py-2 font-medium text-gray-800">${item.conta}</td>`;
      
      const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      item.valores.forEach((val, idx) => {
        const opacityClass = (selectedMonth !== 'TODOS' && parseInt(selectedMonth) - 1 !== idx) ? 'opacity-30' : '';
        cells += `<td class="px-2 py-2 text-right ${opacityClass}">${Calculations.formatCurrency(val)}</td>`;
      });

      const total = Calculations.sumArray(item.valores);
      const media = total / 12;

      cells += `<td class="px-3 py-2 text-right font-medium bg-blue-50 text-blue-900">${Calculations.formatCurrency(media)}</td>`;
      cells += `<td class="px-3 py-2 text-right font-bold bg-blue-100 text-blue-950">${Calculations.formatCurrency(total)}</td>`;

      tr.innerHTML = cells;
      tbBody.appendChild(tr);
    });
  },

  renderFluxoTable(tbBody, fluxoData) {
    tbBody.innerHTML = '';
    const { saldo_inicial, entradas, saidas } = fluxoData;

    let saldoAcumulado = saldo_inicial;
    const saldos = [];
    
    entradas.forEach((ent, i) => {
      saldoAcumulado += ent + saidas[i];
      saldos.push(saldoAcumulado);
    });

    const rows = [
      { name: 'Entradas de Caixa', data: entradas, color: 'text-green-700' },
      { name: 'Saídas de Caixa', data: saidas, color: 'text-red-700' },
      { name: 'Saldo Operacional do Mês', data: entradas.map((e, i) => e + saidas[i]), color: 'font-semibold' },
      { name: 'Saldo de Caixa Acumulado', data: saldos, color: 'font-bold text-blue-900' }
    ];

    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.className = "border-b hover:bg-gray-50";
      let cells = `<td class="px-4 py-2 ${r.color}">${r.name}</td>`;
      r.data.forEach(val => {
        cells += `<td class="px-2 py-2 text-right ${r.color}">${Calculations.formatCurrency(val)}</td>`;
      });
      tr.innerHTML = cells;
      tbBody.appendChild(tr);
    });
  },

  renderRecebiveisTable(tbBody, recebiveisList) {
    tbBody.innerHTML = '';
    recebiveisList.forEach(item => {
      const total = item.recebido + item.futuro;
      const pct = total > 0 ? (item.recebido / total) * 100 : 0;

      const tr = document.createElement('tr');
      tr.className = "border-b hover:bg-gray-50";
      tr.innerHTML = `
        <td class="px-4 py-3 font-medium">${item.operadora}</td>
        <td class="px-4 py-3 text-right text-green-700 font-semibold">${Calculations.formatCurrency(item.recebido)}</td>
        <td class="px-4 py-3 text-right text-blue-600 font-semibold">${Calculations.formatCurrency(item.futuro)}</td>
        <td class="px-4 py-3 text-right font-bold">${Calculations.formatCurrency(total)}</td>
        <td class="px-4 py-3 text-right">${Calculations.formatPercent(pct)}</td>
      `;
      tbBody.appendChild(tr);
    });
  },

  renderAplicacoesTable(tbBody, aplicacoesList) {
    tbBody.innerHTML = '';
    aplicacoesList.forEach(item => {
      const rentabilidade = item.aplicado > 0 ? ((item.rendimento) / item.aplicado) * 100 : 0;

      const tr = document.createElement('tr');
      tr.className = "border-b hover:bg-gray-50";
      tr.innerHTML = `
        <td class="px-3 py-2">${item.data}</td>
        <td class="px-3 py-2 font-medium">${item.conta}</td>
        <td class="px-3 py-2">${item.fundo}</td>
        <td class="px-3 py-2 text-right">${Calculations.formatCurrency(item.aplicado)}</td>
        <td class="px-3 py-2 text-right text-green-700 font-semibold">${Calculations.formatCurrency(item.rendimento)}</td>
        <td class="px-3 py-2 text-right font-bold">${Calculations.formatCurrency(item.valor_atual)}</td>
        <td class="px-3 py-2 text-right text-blue-700">${Calculations.formatPercent(rentabilidade)}</td>
        <td class="px-3 py-2 text-center">
          <button class="text-red-500 hover:text-red-700 text-xs" onclick="alert('Registro protegido')"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbBody.appendChild(tr);
    });
  },

  openAplicacaoModal() {
    alert("Função de novo registro de aplicação acionada.");
  }
};
