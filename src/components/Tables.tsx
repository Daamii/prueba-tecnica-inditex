import React from "react";
import { PreReparto, StockParaReparto, StockUnificado } from "../types";

export const TablaPreRepartos = ({ data }: { data: PreReparto[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Propuesta</th>
          <th>Tienda_ID</th>
          <th>Grupo_Localización_Desc</th>
          <th>Es_Ecommerce</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.key}</td>
            <td>{item.propuesta}</td>
            <td>{item.tiendaId}</td>
            <td>{item.grupoLocalizacionDesc}</td>
            <td>{item.esEcommerce}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const TablaStockUnificado = ({ data }: { data: StockUnificado[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Tipo_Stock_Desc</th>
          <th>Stock_Em05</th>
          <th>Stock_Em01</th>
          <th>Posición_Completa</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.key}</td>
              <td>{item.tipoStockDesc}</td>
              <td>{item.stockEm05}</td>
              <td>{item.stockEm01}</td>
              <td>{item.posicioncompleta}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const TablaStockParaReparto = ({
  data,
}: {
  data: StockParaReparto[];
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Id_Tienda</th>
          <th>Propuesta</th>
          <th>Tipo_Stock_Desc</th>
          <th>Estado_Stock</th>
          <th>Posición_Completa</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.key}</td>
            <td>{item.idTienda}</td>
            <td>{item.propuesta}</td>
            <td>{item.tipoStockDesc}</td>
            <td>{item.estadoStock}</td>
            <td>{item.posicioncompleta}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
