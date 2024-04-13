import React from "react";
import { StockParaReparto } from "../types";

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
          <th>Id Tienda</th>
          <th>Propuesta</th>
          <th>Tipo Stock Desc</th>
          <th>Estado Stock</th>
          <th>Posición Completa</th>
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
