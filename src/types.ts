export interface PreReparto {
  key: number;
  propuesta: number;
  tiendaId: number;
  grupoLocalizacionDesc: string;
  esEcommerce: number;
}
export interface StockUnificado {
  key: number;
  tipoStockDesc: string;
  stockEm05: number; // exclusivo y preferente para online
  stockEm01: number; // preferente para tiendas físicas pero tambien sirve online en caso de necesidad
  posicioncompleta: string;
}

export interface StockParaReparto {
  key: number;
  idTienda: number;
  propuesta: number;
  tipoStockDesc: string;
  estadoStock: 1 | 5;
  posicioncompleta: string;
}

export interface DataBrutaType {
  metadata: any;
  data: PreReparto[];
}
