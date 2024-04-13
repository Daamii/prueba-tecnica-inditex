// const buscarRepartoEnStock = (
//   preReparto: PreReparto,
//   stockUnificado: StockUnificado[]
// ): StockParaReparto | undefined => {
//   let satisface: SatisfaceNecesidad = {
//     usaStockEm05: false,
//     usaStockEm01: false,
//   };
//   const localizacion = stockUnificado.find((su) => {
//     let satisfaceLocal = hayStockSuficiente(preReparto, su);
//     if (satisfaceLocal.usaStockEm01 || satisfaceLocal.usaStockEm05) {
//       satisface = satisfaceLocal;
//       return true;
//     }
//   });
//   //   console.log(satisface);

//   if (localizacion) {
//     const newValue: StockParaReparto = {
//       key: localizacion.key,
//       idTienda: preReparto.tiendaId,
//       propuesta: preReparto.propuesta,
//       tipoStockDesc: localizacion.tipoStockDesc,
//       estadoStock: 1,
//       posicioncompleta: localizacion.posicioncompleta,
//     };
//     //reset
//     satisface = {
//       usaStockEm05: false,
//       usaStockEm01: false,
//     };
//     return newValue;
//   }
//   //reset
//   satisface = {
//     usaStockEm05: false,
//     usaStockEm01: false,
//   };
//   return;
// };

// const condicionEcomerce = (
//   preReparto: PreReparto,
//   stockUnificado: StockUnificado
// ): boolean => {
//   return preReparto.esEcommerce
//     ? stockUnificado.stockEm05 <= preReparto.propuesta ||
//         stockUnificado.stockEm01 <= preReparto.propuesta
//     : stockUnificado.stockEm05 <= preReparto.propuesta;
// };

// const condicionAceptacion = (
//     preReparto: PreReparto,
//     stockUnificado: StockUnificado
//   ): boolean => {
//     return (
//       preReparto.key == stockUnificado.key &&
//       condicionEcomerce(preReparto, stockUnificado)
//     );
//   };

const filtradoConsiderandoEcommerce = (
  preReparto: PreReparto,
  stockPrefiltrado: StockUnificado[]
  // esEcommerce: boolean
) => {
  const esEcommerce = true;
  let piezasPendientes = preReparto.propuesta;
  const filtradPorEcommerce = filtroAvanzado(
    stockPrefiltrado,
    esEcommerce,
    piezasPendientes
  );
  const filtradPorTiendaFisica = filtroAvanzado(
    stockPrefiltrado,
    !esEcommerce,
    piezasPendientes
  );
  // console.log(filtradPorEcommerce);
};

const filtroAvanzado = (
  stockPrefiltrado: StockUnificado[],
  esEcommerce: boolean,
  piezasPendientesInicial: number
) => {
  let piezasPendientes = piezasPendientesInicial;

  const ZARs = stockPrefiltrado.filter((stp) => stp.tipoStockDesc == "ZAR");
  const MSRs = stockPrefiltrado.filter((stp) => stp.tipoStockDesc == "MSR");
  const SILOs = stockPrefiltrado.filter((stp) => stp.tipoStockDesc == "SILO");

  const resultZars = ZARs.filter((stp) => {
    if (piezasPendientes == 0) return;
    const piezasPendientesTrasComprobacion = esEcommerce
      ? comprobacionPiezasPendientesEm05(piezasPendientes, stp)
      : comprobacionPiezasPendientesEm01(piezasPendientes, stp);
    if (piezasPendientesTrasComprobacion >= 0) {
      piezasPendientes = piezasPendientesTrasComprobacion;
      return true;
    }
  });

  const resultMSRs = MSRs.filter((stp) => {
    piezasPendientes = esEcommerce
      ? comprobacionPiezasPendientesEm05(piezasPendientes, stp)
      : comprobacionPiezasPendientesEm01(piezasPendientes, stp);
    if (piezasPendientes > 0) return true;
  });
  console.log({ MSRs });
  console.log({ resultMSRs });
  const resultSILOs = SILOs.filter((stp) => {
    piezasPendientes = esEcommerce
      ? comprobacionPiezasPendientesEm05(piezasPendientes, stp)
      : comprobacionPiezasPendientesEm01(piezasPendientes, stp);
  });
  return [...resultZars, ...resultMSRs, ...resultSILOs];
};

const comprobacionPiezasPendientesEm05 = (
  piezasPendientes: number,
  stockPrefiltrado: StockUnificado
) => {
  // si hay piezas de tipo ecommerce y aun necesitamos
  if (stockPrefiltrado.stockEm05 !== 0 && piezasPendientes > 0) {
    //actualizamos las piezas que aun nos faltan
    piezasPendientes =
      //si justo hay las que necesitamos o más devolvemo que tenemos 0 pendientes
      piezasPendientes <= stockPrefiltrado.stockEm05
        ? 0
        : // si no, las pendientes menos las que haya en este stock
          piezasPendientes - stockPrefiltrado.stockEm05;
    return piezasPendientes;
  }
  return 0;
};

const comprobacionPiezasPendientesEm01 = (
  piezasPendientes: number,
  stockPrefiltrado: StockUnificado
) => {
  // si hay piezas de tipo ecommerce y aun necesitamos
  if (stockPrefiltrado.stockEm01 !== 0 && piezasPendientes > 0) {
    //actualizamos las piezas que aun nos faltan
    piezasPendientes =
      //si justo hay las que necesitamos o más devolvemo que tenemos 0 pendientes
      piezasPendientes <= stockPrefiltrado.stockEm01
        ? 0
        : // si no, las pendientes menos las que haya en este stock
          piezasPendientes - stockPrefiltrado.stockEm01;
    return piezasPendientes;
  }
  return 0;
};
