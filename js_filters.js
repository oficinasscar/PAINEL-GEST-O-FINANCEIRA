// Módulo de Filtros por Período
const FilterManager = {
  init(onFilterChangeCallback) {
    const selAno = document.getElementById('filterAno');
    const selMes = document.getElementById('filterMes');

    if (selAno) selAno.addEventListener('change', () => onFilterChangeCallback());
    if (selMes) selMes.addEventListener('change', () => onFilterChangeCallback());
  },

  getSelectedMonth() {
    const selMes = document.getElementById('filterMes');
    return selMes ? selMes.value : 'TODOS';
  },

  getSelectedYear() {
    const selAno = document.getElementById('filterAno');
    return selAno ? selAno.value : '2026';
  }
};
