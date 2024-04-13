import React, { useEffect, useState } from "react";
import "./App.css";
import { calcularReparto } from "./CalculadorReparto";
import {
  TablaPreRepartos,
  TablaStockParaReparto,
  TablaStockUnificado,
} from "./components/Tables";
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
  const [verStock, setVerStock] = useState(false);

  const { data: preReparto } = useFetch<PreReparto[]>({ url: PRE_REPARTO_URL });
  const { data: stockUnificado } = useFetch<StockUnificado[]>({
    url: STOCK_URL,
  });

  const [preRepartoFiltrado, setPreRepartoFiltrado] = useState<PreReparto[]>(
    []
  );
  const [stockCalculado, setStockCalculado] = useState<StockParaReparto[]>([]);

  const calcularStockLocal = () => {
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
  };

  useEffect(() => {
    const newData = preReparto?.filter(
      (p) =>
        filtroGrupoLocalizacionDesc.includes(p?.grupoLocalizacionDesc) &&
        p.esEcommerce == filtroEsECommerce
    );
    // console.log(newData);
    newData && setPreRepartoFiltrado(newData);
    // newData && setPreRepartoFiltrado(newData.slice(0, 20)); //cojo solo 20 primero para samplear y debuggear
  }, [preReparto]);

  // useEffect(() => {
  //   if (
  //     !preRepartoFiltrado ||
  //     preRepartoFiltrado?.length == 0 ||
  //     !stockUnificado ||
  //     stockUnificado?.length == 0
  //   )
  //     return;
  //   const res = calcularReparto({
  //     preReparto: preRepartoFiltrado,
  //     stockUnificado,
  //   });
  //   console.log({ res });
  // }, [preRepartoFiltrado, stockUnificado]);

  // useEffect(() => {
  //   if (
  //     !preReparto ||
  //     preReparto?.length == 0 ||
  //     !stockUnificado ||
  //     stockUnificado?.length == 0
  //   )
  //     return;
  //   calcularReparto({ preReparto, stockUnificado });
  // }, [preReparto, stockUnificado]);

  return (
    <>
      <button
        onClick={() => {
          setVerStock(!verStock);
        }}
      >
        ver {verStock ? "prereparto" : "stock"}
      </button>
      <button
        onClick={() => {
          calcularStockLocal();
        }}
      >
        calcular stock
      </button>
      {stockCalculado.length > 0 ? (
        <TablaStockParaReparto data={stockCalculado} />
      ) : verStock ? (
        <TablaStockUnificado data={stockUnificado || []} />
      ) : (
        <TablaPreRepartos data={preRepartoFiltrado} />
      )}
    </>
  );
}

export default App;
