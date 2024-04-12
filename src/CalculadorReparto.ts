import { PreReparto, StockParaReparto, StockUnificado } from "./types";

interface SatisfaceNecesidad {
  usaStockEm05: boolean;
  usaStockEm01: boolean;
}

const hayStockSuficiente = (
  preReparto: PreReparto,
  stockUnificado: StockUnificado
): SatisfaceNecesidad => {
  if (!preReparto.esEcommerce) {
    if (stockUnificado.stockEm01 <= preReparto.propuesta)
      return {
        usaStockEm05: false,
        usaStockEm01: true,
      };
  }

  if (preReparto.esEcommerce) {
    if (preReparto.propuesta <= stockUnificado.stockEm05)
      return {
        usaStockEm05: true,
        usaStockEm01: false,
      };
    else if (
      preReparto.propuesta - stockUnificado.stockEm05 <= //teniendo en cuenta que descontamos del stockEm05 que es preferente
      stockUnificado.stockEm01
    ) {
      return {
        usaStockEm05: preReparto.propuesta <= stockUnificado.stockEm05, //por si stockEm05 es 0
        usaStockEm01: true,
      };
    }
  }

  return {
    usaStockEm05: false,
    usaStockEm01: false,
  };
};

//TODO LIMITACION POR AHORA: ESTO SOLO DEVUELVE UN VALOR
const buscarRepartoEnStock = (
  preReparto: PreReparto,
  stockUnificado: StockUnificado[]
): StockParaReparto | undefined => {
  let satisfaceLocal: SatisfaceNecesidad | null = null;

  const localizacion = stockUnificado.find((su) => {
    //TODO antes de mirar el stock ecommerce o no mirar la priorización de ZONAS: ZAR > MSR > SILO
    satisfaceLocal = hayStockSuficiente(preReparto, su);
    return satisfaceLocal.usaStockEm01 || satisfaceLocal.usaStockEm05;
  });

  if (localizacion) {
    const { usaStockEm01, usaStockEm05 } = satisfaceLocal!;
    // Aqui por ahora se prioriza que use stock 1 pero debería devolver 1 valor para el 1 y otro para el 5
    const estadoStock: 1 | 5 = usaStockEm05 ? 5 : usaStockEm01 ? 1 : 1;

    return {
      key: localizacion.key,
      idTienda: preReparto.tiendaId,
      propuesta: preReparto.propuesta,
      tipoStockDesc: localizacion.tipoStockDesc,
      estadoStock,
      posicioncompleta: localizacion.posicioncompleta,
    };
  }

  return undefined;
};

export const calcularReparto = ({
  preReparto,
  stockUnificado,
}: {
  preReparto: PreReparto[];
  stockUnificado: StockUnificado[];
}): StockParaReparto[] | undefined => {
  console.log(preReparto.length);
  const resultado = preReparto
    .map((pr) => buscarRepartoEnStock(pr, stockUnificado))
    .filter(Boolean) as StockParaReparto[];
  // .filter((res): res is StockParaReparto => res !== undefined);

  console.log("resultado->", resultado.length);

  return resultado;
};
