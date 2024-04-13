import { PreReparto, StockUnificado } from "./../types";
import { useEffect, useState } from "react";
interface UseFetchResult<T> {
  data: T | null;
}

// hook para obtener los datos de los jsons
export const useFetch = <T extends PreReparto[] | StockUnificado[]>({
  url,
}: {
  url: string;
}): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  async function fetchData() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data };
};
