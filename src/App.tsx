import React, { useEffect, useState } from "react";
import { calcularReparto } from "./utils/CalculadorReparto";
import { TablaStockParaReparto } from "./components/TablaStockParaReparto";
import { useFetch } from "./hooks/useFetch";
import { PreReparto, StockParaReparto, StockUnificado } from "./types";

const PRE_REPARTO_URL = "../public/Prereparto_bruto.json";
const STOCK_URL = "../public/Stock_unificado.json";

/********/

const filtroGrupoLocalizacionDesc = [
  "CICLO 2 GRUPO A2",
  "CICLO 1 GRUPO B",
  "CICLO 1 GRUPO A2",
];

const filtroEsECommerce = 1;

/********/

function App() {
  //fetching de datos de los archivos json
  const { data: preReparto } = useFetch<PreReparto[]>({ url: PRE_REPARTO_URL });
  const { data: stockUnificado } = useFetch<StockUnificado[]>({
    url: STOCK_URL,
  });

  //prereparto filtrado por los datos del problema
  const [preRepartoFiltrado, setPreRepartoFiltrado] = useState<PreReparto[]>(
    []
  );
  //resultado
  const [stockCalculado, setStockCalculado] = useState<StockParaReparto[]>([]);

  // aplicar filtrado
  useEffect(() => {
    const newData = preReparto?.filter(
      (p) =>
        filtroGrupoLocalizacionDesc.includes(p?.grupoLocalizacionDesc) &&
        p.esEcommerce == filtroEsECommerce
    );
    newData && setPreRepartoFiltrado(newData);
  }, [preReparto]);

  // calculo de stock dado un prereparto y un stock disponible
  useEffect(() => {
    if (
      !preRepartoFiltrado ||
      preRepartoFiltrado?.length == 0 ||
      !stockUnificado ||
      stockUnificado?.length == 0
    )
      return;
    const res = calcularReparto({
      preReparto: preRepartoFiltrado,
      stockUnificado,
    });
    res && setStockCalculado(res);
  }, [preRepartoFiltrado, stockUnificado]);

  return (
    <>
      {stockCalculado.length > 0 && (
        <TablaStockParaReparto data={stockCalculado} />
      )}
    </>
  );
}

export default App;
