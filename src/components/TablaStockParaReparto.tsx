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
