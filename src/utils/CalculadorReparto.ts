import { PreReparto, StockParaReparto, StockUnificado } from "../types";

// para un listado de pre-repartos y stocks calcular los resultado de disponibilidad y localización
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

// Se filtra el stock para el prereparto y ordena por prioridad
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
  if (stocksPrefiltrados.length === 0) return;

  let pedidosPendientes = pedido.propuesta;
  const resultado: StockParaReparto[] = [];

  // Priorizar stocks exclusivos de eCommerce (estado 5)
  if (pedido.esEcommerce) {
    for (const stock of stocksPrefiltrados) {
      if (pedidosPendientes <= 0) break; // Terminar si ya se han cubierto los pedidos
      if (stock.stockEm05 > 0) {
        const cantidadUtilizada = Math.min(pedidosPendientes, stock.stockEm05);
        pedidosPendientes -= cantidadUtilizada;

        resultado.push({
          key: stock.key,
          idTienda: pedido.tiendaId,
          propuesta: cantidadUtilizada,
          tipoStockDesc: stock.tipoStockDesc,
          estadoStock: 5,
          posicioncompleta: stock.posicioncompleta,
        });
      }
    }
  }

  // Si quedan pedidos pendientes, buscar en stocks de tiendas físicas (estado 1)
  if (pedidosPendientes > 0) {
    for (const stock of stocksPrefiltrados) {
      if (pedidosPendientes <= 0) break; // Terminar si ya se han cubierto los pedidos
      if (stock.stockEm01 > 0) {
        const cantidadUtilizada = Math.min(pedidosPendientes, stock.stockEm01);
        pedidosPendientes -= cantidadUtilizada;

        resultado.push({
          key: stock.key,
          idTienda: pedido.tiendaId,
          propuesta: cantidadUtilizada,
          tipoStockDesc: stock.tipoStockDesc,
          estadoStock: 1,
          posicioncompleta: stock.posicioncompleta,
        });
      }
    }
  }

  return resultado;
};
