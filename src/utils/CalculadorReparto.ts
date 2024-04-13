import { PreReparto, StockParaReparto, StockUnificado } from "../types";

const obtenerStockPrefiltradoOrdenado = (
  preReparto: PreReparto,
  stocksUnificados: StockUnificado[]
): StockUnificado[] => {
  const stocksPrefiltrados = stocksUnificados.filter(
    (su) => su.key === preReparto.key
  );

  // Ordenar el array por tipoStockDesc: ZAR, MSR, SILO
  const order: Record<string, number> = { ZAR: 0, MSR: 1, SILO: 2 };
  stocksPrefiltrados.sort(
    (a, b) => order[a.tipoStockDesc] - order[b.tipoStockDesc]
  );

  return stocksPrefiltrados;
};

// Función que calcula el reparto para un pedido específico del pre-reparto
const buscarRepartoEnStock = (
  pedido: PreReparto,
  stocksPrefiltrados: StockUnificado[]
): StockParaReparto[] | undefined => {
  if (stocksPrefiltrados.length == 0) return;

  let pedidosPendientes = pedido.propuesta;

  // priorizando los stocks exlcusivos de eCommerce
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

  // si quedan pedidos pendientes se buscan en stocks para tiendas fisicas
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
  const resultados: StockParaReparto[] = preReparto.flatMap((pr) => {
    const stockPrefiltrado: StockUnificado[] = obtenerStockPrefiltradoOrdenado(
      pr,
      stockUnificado
    ).filter(Boolean) as StockUnificado[];

    if (stockPrefiltrado) {
      return buscarRepartoEnStock(pr, stockPrefiltrado) || [];
    }
    return [];
  });

  return resultados;
};
