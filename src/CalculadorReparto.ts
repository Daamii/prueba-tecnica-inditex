import { PreReparto, StockParaReparto, StockUnificado } from "./types";

const obtenerStockPrefiltrado = (
  preReparto: PreReparto,
  stocksUnificados: StockUnificado[]
): StockUnificado[] => {
  return stocksUnificados.filter((su) => su.key === preReparto.key);
};

const buscarRepartoEnStock = (
  pedido: PreReparto,
  stocksPrefiltrados: StockUnificado[]
): StockParaReparto[] | undefined => {
  if (stocksPrefiltrados.length == 0) return;
  let pedidosPendientes = pedido.propuesta;
  const order: Record<string, number> = { ZAR: 0, MSR: 1, SILO: 2 };
  // Ordenar el array por tipoStockDesc: ZAR, MSR, SILO
  stocksPrefiltrados.sort(
    (a, b) => order[a.tipoStockDesc] - order[b.tipoStockDesc]
  );

  // en este punto los stocksPrefiltrados ya aplican a la unidad preReparto nos interesa de ella su cantidad de unidades
  // ademas se depe aplicar la lógica de buscar primero en las zonas por orden

  //para los stocks ordenados primero  comprovamos los campos exlcusivos del ecommerce
  const locsTipo5 = pedido.esEcommerce
    ? stocksPrefiltrados
        .filter((stock) => {
          if (pedidosPendientes > 0 && pedidosPendientes <= stock.stockEm05) {
            pedidosPendientes -= stock.stockEm05;
            return true;
          }
        })
        .map((localizacion) => {
          return {
            key: localizacion.key,
            idTienda: pedido.tiendaId,
            propuesta: pedido.propuesta,
            tipoStockDesc: localizacion.tipoStockDesc,
            estadoStock: 5,
            posicioncompleta: localizacion.posicioncompleta,
          } as StockParaReparto;
        })
    : [];

  // si aun quedaran pedidos pendientes los buscariamos en stocks para tiendas fisicas
  const locsTipo1 =
    pedidosPendientes > 0
      ? stocksPrefiltrados
          .filter((stock) => {
            if (pedidosPendientes > 0 && pedidosPendientes <= stock.stockEm01) {
              pedidosPendientes -= stock.stockEm01;
              return true;
            }
          })
          .map((localizacion) => {
            return {
              key: localizacion.key,
              idTienda: pedido.tiendaId,
              propuesta: pedido.propuesta,
              tipoStockDesc: localizacion.tipoStockDesc,
              estadoStock: 1,
              posicioncompleta: localizacion.posicioncompleta,
            } as StockParaReparto;
          })
      : [];

  return [...locsTipo5, ...locsTipo1];
};

export const calcularReparto = ({
  preReparto,
  stockUnificado,
}: {
  preReparto: PreReparto[];
  stockUnificado: StockUnificado[];
}): StockParaReparto[] | undefined => {
  const resultadosAvanzados: StockParaReparto[] = preReparto.flatMap((pr) => {
    const stockPrefiltrado: StockUnificado[] = obtenerStockPrefiltrado(
      pr,
      stockUnificado
    ).filter(Boolean) as StockUnificado[];

    if (stockPrefiltrado) {
      return buscarRepartoEnStock(pr, stockPrefiltrado) || [];
    }
    return [];
  });

  return resultadosAvanzados;
};
