import React, { useEffect, useState } from "react";
import { calcularReparto } from "./utils/CalculadorReparto";
import { TablaStockParaReparto } from "./components/TablaStockParaReparto";
import { useFetch } from "./hooks/useFetch";
import { PreReparto, StockParaReparto, StockUnificado } from "./types";

// urls locales de fetching de datos
const PRE_REPARTO_URL = "../public/Prereparto_bruto.json";
const STOCK_URL = "../public/Stock_unificado.json";

// constantes de filtrado
// en un proyecto más avanzado con filtros modificables
// estas constantes serían valores mutables prodecendetes de un input
const filtroGrupoLocalizacionDesc = [
  "CICLO 2 GRUPO A2",
  "CICLO 1 GRUPO B",
  "CICLO 1 GRUPO A2",
];

const filtroEsECommerce = 1;

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

  // aplicar filtrado del pre reparto
  // en este caso los filtros del problema plantenado no cambian
  // pero en caso de que fuera dinámico aquí se filtarían las necesidades para el pre reparto
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
    // early return para evitar calcular reparto mientras los datos non estén listos
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
