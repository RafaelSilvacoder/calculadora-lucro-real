/* ==========================================================================
   PERFIS DE VEÍCULO
   Cada chave representa um "perfil" completo de cálculo: rótulos, valores
   de consumo pré-preenchidos, placeholders e custos ocultos por KM.
   "carro" tem dois perfis (gasolina/gnv) escolhidos pelas sub-abas.
   ========================================================================== */
   const PROFILES = {
    moto: {
      consumoLabel: "Consumo Médio (KM/L)",
      consumoDefault: "35",
      precoLabel: "Preço do Litro do Combustível (R$)",
      precoPlaceholder: "Ex: 5.89",
      gastoEnergiaLabel: "Gasto com combustível",
      custos: { oleo: 0.04, pneus: 0.02, mecanica: 0.012, taxas: 0.02 },
      custoLabels: {
        oleo: "Óleo / Filtro (R$/km)",
        pneus: "Pneus (R$/km)",
        mecanica: "Relação / Mecânica (R$/km)",
        taxas: "Taxas / IPVA / Seguro (R$/km)"
      },
      affiliateText: "🔧 Hora de dar aquela geral na máquina? Confira motopeças em promoção na Shopee com desconto →",
      affiliateLink: "https://s.shopee.com.br/40epImbWXq"
    },
    carro_gasolina: {
      consumoLabel: "Consumo Médio (KM/L)",
      consumoDefault: "10",
      precoLabel: "Preço do Litro do Combustível (R$)",
      precoPlaceholder: "Ex: 5.89",
      gastoEnergiaLabel: "Gasto com combustível",
      custos: { oleo: 0.025, pneus: 0.035, mecanica: 0.06, taxas: 0.08 },
      custoLabels: {
        oleo: "Óleo / Filtro (R$/km)",
        pneus: "Pneus (R$/km)",
        mecanica: "Mecânica Geral (freios, suspensão, correias) (R$/km)",
        taxas: "Taxas / IPVA / Seguro (R$/km)"
      },
      affiliateText: "🚗 Precisando de peças, ferramentas ou acessórios para o seu carro? Confira as melhores ofertas na Shopee →",
      affiliateLink: "https://s.shopee.com.br/AAFSeDbohx"
    },
    carro_gnv: {
      consumoLabel: "Consumo Médio (KM/m³)",
      consumoDefault: "12",
      precoLabel: "Preço do m³ do GNV (R$)",
      precoPlaceholder: "Ex: 4.50",
      gastoEnergiaLabel: "Gasto com gás GNV",
      custos: { oleo: 0.025, pneus: 0.04, mecanica: 0.07, taxas: 0.05 },
      custoLabels: {
        oleo: "Óleo / Filtro (R$/km)",
        pneus: "Pneus (peso extra do cilindro) (R$/km)",
        mecanica: "Mecânica (velas, cabos, filtros de gás) (R$/km)",
        taxas: "Taxas / Vistoria / IPVA (R$/km)"
      },
      affiliateText: "🚗 Precisando de peças, ferramentas ou acessórios para o seu carro? Confira as melhores ofertas na Shopee →",
      affiliateLink: "hhttps://s.shopee.com.br/AAFSeDbohx"
    },
    eletrico: {
      consumoLabel: "Consumo Médio (KM/kWh)",
      consumoDefault: "6",
      precoLabel: "Preço do kWh da Energia (R$)",
      precoPlaceholder: "Ex: 0.95",
      gastoEnergiaLabel: "Gasto com eletricidade",
      custos: { oleo: 0.00, pneus: 0.05, mecanica: 0.02, taxas: 0.03 },
      custoLabels: {
        oleo: "Óleo / Filtro (não se aplica) (R$/km)",
        pneus: "Pneus (R$/km)",
        mecanica: "Mecânica Geral (freio regenerativo) (R$/km)",
        taxas: "Taxas / Seguro / Licenciamento (R$/km)"
      },
      affiliateText: "🚗 Precisando de peças, ferramentas ou acessórios para o seu carro? Confira as melhores ofertas na Shopee →",
      affiliateLink: "https://s.shopee.com.br/AAFSeDbohx"
    }
  };
  
  let currentVehicle = "moto";     
  let currentCarroSub = "gasolina"; 
  
  /* --------------------------------------------------------------------------
     Referências de elementos do DOM
     -------------------------------------------------------------------------- */
  const el = {
    tabs: document.querySelectorAll(".tab-btn"),
    carroSubtabs: document.getElementById("carroSubtabs"),
    subtabBtns: document.querySelectorAll(".sub-tab-btn"),
  
    // Alterado para focar no TextElement interno e blindar os ícones
    labelConsumoText: document.getElementById("labelConsumoText"),
    labelPrecoText: document.getElementById("labelPrecoText"),
    consumo: document.getElementById("consumo"),
    precoUnidade: document.getElementById("precoUnidade"),
    kmRodados: document.getElementById("kmRodados"),
    faturamentoBruto: document.getElementById("faturamentoBruto"),
    metaPorKm: document.getElementById("metaPorKm"),
  
    custoOleo: document.getElementById("custoOleo"),
    custoPneus: document.getElementById("custoPneus"),
    custoMecanica: document.getElementById("custoMecanica"),
    custoTaxas: document.getElementById("custoTaxas"),
    labelOleo: document.getElementById("labelOleo"),
    labelPneus: document.getElementById("labelPneus"),
    labelMecanica: document.getElementById("labelMecanica"),
    labelTaxas: document.getElementById("labelTaxas"),
  
    accordionToggle: document.getElementById("accordionToggle"),
    accordionBody: document.getElementById("accordionBody"),
    accordionChevron: document.querySelector("#accordionToggle .chevron"),
  
    btnCalcular: document.getElementById("btnCalcular"),
    resultsPanel: document.getElementById("resultsPanel"),
  
    gaugeEl: document.getElementById("gaugeEl"),
    lucroValor: document.getElementById("lucroValor"),
  
    valGastoEnergia: document.getElementById("valGastoEnergia"),
    labelGastoEnergia: document.getElementById("labelGastoEnergia"),
    valManutencao: document.getElementById("valManutencao"),
    valCustoKm: document.getElementById("valCustoKm"),
    valGanhoBrutoKm: document.getElementById("valGanhoBrutoKm"),
  
    metaAlertCard: document.getElementById("metaAlertCard"),
  
    affiliateCard: document.getElementById("affiliateCard"),
    affiliateText: document.getElementById("affiliateText")
  };
  
  /* --------------------------------------------------------------------------
     formatBRL: formata um número como moeda brasileira (R$ 0,00)
     -------------------------------------------------------------------------- */
  function formatBRL(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  
  /* --------------------------------------------------------------------------
     getActiveProfileKey: resolve qual perfil de PROFILES deve ser usado
     -------------------------------------------------------------------------- */
  function getActiveProfileKey() {
    if (currentVehicle === "carro") return "carro_" + currentCarroSub;
    return currentVehicle; 
  }
  
  /* --------------------------------------------------------------------------
     applyProfile: aplica o perfil ativo em toda a interface
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
   applyProfile: aplica o perfil ativo em toda a interface
   -------------------------------------------------------------------------- */
function applyProfile() {
  const cfg = PROFILES[getActiveProfileKey()];

  // Correção aqui: trocado 'labelConsumo' por 'labelConsumoText' e 'labelPreco' por 'labelPrecoText'
  if (el.labelConsumoText && el.labelConsumoText.lastChild) {
    el.labelConsumoText.lastChild.textContent = " " + cfg.consumoLabel;
  }
  
  el.consumo.value = cfg.consumoDefault;
  
  if (el.labelPrecoText && el.labelPrecoText.lastChild) {
    el.labelPrecoText.lastChild.textContent = " " + cfg.precoLabel;
  }
  
  el.precoUnidade.placeholder = cfg.precoPlaceholder;

  el.custoOleo.value = cfg.custos.oleo;
  el.custoPneus.value = cfg.custos.pneus;
  el.custoMecanica.value = cfg.custos.mecanica;
  el.custoTaxas.value = cfg.custos.taxas;

  el.labelOleo.textContent = cfg.custoLabels.oleo;
  el.labelPneus.textContent = cfg.custoLabels.pneus;
  el.labelMecanica.textContent = cfg.custoLabels.mecanica;
  el.labelTaxas.textContent = cfg.custoLabels.taxas;

  el.labelGastoEnergia.innerHTML =
    '<i class="fas fa-gas-pump" style="color:var(--amber);"></i> ' + cfg.gastoEnergiaLabel;

  el.resultsPanel.classList.add("hidden");
}
  
  /* --------------------------------------------------------------------------
     Alterna a aba visual ativa entre os botões de veículo principal
     -------------------------------------------------------------------------- */
  el.tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      el.tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentVehicle = btn.dataset.vehicle;
  
      if (currentVehicle === "carro") {
        el.carroSubtabs.classList.add("open");
      } else {
        el.carroSubtabs.classList.remove("open");
      }
  
      applyProfile();
    });
  });
  
  /* --------------------------------------------------------------------------
     Alterna entre Gasolina/Flex e GNV
     -------------------------------------------------------------------------- */
  el.subtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.subtabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCarroSub = btn.dataset.subfuel;
      applyProfile();
    });
  });
  
  /* --------------------------------------------------------------------------
     Accordion "Abrir o Capô" (custos ocultos)
     -------------------------------------------------------------------------- */
  el.accordionToggle.addEventListener("click", () => {
    el.accordionBody.classList.toggle("open");
    el.accordionChevron.classList.toggle("rot");
  });
  
  /* --------------------------------------------------------------------------
     calcularLucro: função principal disparada pelo botão "Calcular Lucro Real"
     -------------------------------------------------------------------------- */
  function calcularLucro() {
    const km = parseFloat(el.kmRodados.value) || 0;
    const faturamento = parseFloat(el.faturamentoBruto.value) || 0;
    const consumo = parseFloat(el.consumo.value) || 0;
    const precoUnidade = parseFloat(el.precoUnidade.value) || 0;
    const meta = parseFloat(el.metaPorKm.value) || 0;
  
    if (km <= 0 || consumo <= 0) {
      alert("Preencha os KM rodados e o consumo médio para calcular.");
      return;
    }
  
    const gastoEnergia = (km / consumo) * precoUnidade;
  
    const custoOleoKm = parseFloat(el.custoOleo.value) || 0;
    const custoPneusKm = parseFloat(el.custoPneus.value) || 0;
    const custoMecanicaKm = parseFloat(el.custoMecanica.value) || 0;
    const custoTaxasKm = parseFloat(el.custoTaxas.value) || 0;
    const custoManutencaoPorKm = custoOleoKm + custoPneusKm + custoMecanicaKm + custoTaxasKm;
    const custoManutencaoTotal = custoManutencaoPorKm * km;
  
    const custoTotal = gastoEnergia + custoManutencaoTotal;
    const lucroLiquido = faturamento - custoTotal;
  
    const custoRealPorKm = custoTotal / km;
    const ganhoBrutoPorKm = faturamento / km;
  
    renderResultados({
      gastoEnergia,
      custoManutencaoTotal,
      lucroLiquido,
      custoRealPorKm,
      ganhoBrutoPorKm,
      faturamento,
      meta
    });
  }
  
  /* --------------------------------------------------------------------------
     renderResultados: pinta os números calculados na interface
     -------------------------------------------------------------------------- */
  function renderResultados(r) {
    el.resultsPanel.classList.remove("hidden");
  
    el.valGastoEnergia.textContent = formatBRL(r.gastoEnergia);
    el.valManutencao.textContent = formatBRL(r.custoManutencaoTotal);
    el.valCustoKm.textContent = formatBRL(r.custoRealPorKm);
    el.valGanhoBrutoKm.textContent = formatBRL(r.ganhoBrutoPorKm);
  
    const isPositivo = r.lucroLiquido >= 0;
  
    el.lucroValor.textContent = formatBRL(r.lucroLiquido);
    el.lucroValor.style.color = isPositivo ? "var(--green)" : "var(--red)";
  
    const pctLucro = r.faturamento > 0
      ? Math.min(100, Math.max(0, (r.lucroLiquido / r.faturamento) * 100))
      : 0;
    el.gaugeEl.style.setProperty("--gauge-pct", pctLucro.toFixed(1));
    el.gaugeEl.style.setProperty("--gauge-color", isPositivo ? "var(--green)" : "var(--red)");
  
    el.metaAlertCard.classList.remove("hidden");
    if (r.meta > 0 && r.ganhoBrutoPorKm < r.meta) {
      el.metaAlertCard.className = "alert-card p-4";
      el.metaAlertCard.innerHTML =
        '<i class="fas fa-triangle-exclamation mr-1"></i> <strong>Atenção:</strong> a média de hoje ficou abaixo da sua meta ideal por KM! Evite aceitar corridas desvantajosas.';
    } else {
      el.metaAlertCard.className = "goal-ok-card p-4";
      el.metaAlertCard.innerHTML =
        '<i class="fas fa-circle-check mr-1"></i> <strong>Boa!</strong> sua média de hoje está dentro (ou acima) da sua meta ideal por KM.';
    }
  
    const cfg = PROFILES[getActiveProfileKey()];
    el.affiliateText.textContent = cfg.affiliateText;
    el.affiliateCard.href = cfg.affiliateLink;
  
    el.resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  el.btnCalcular.addEventListener("click", calcularLucro);
  
  applyProfile();