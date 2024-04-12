import { PreReparto, StockUnificado } from "./../types";
import { useEffect, useState } from "react";

// export const useFetch = ({ url }: { url: string }) => {
//   const [data, setData] = useState();

//   useEffect(() => {
//     async function fetchData() {
//       const response = await fetch(url);
//       const jsonData = await response.json();
//       setData(jsonData);
//     }

//     fetchData();
//   }, []);

//   return {
//     data,
//   };
// };

// Define la función useFetch con tipado genérico
interface UseFetchResult<T> {
  data: T | null;
}

// Define la función useFetch con tipado genérico
export const useFetch = <T extends PreReparto[] | StockUnificado[]>({
  url,
}: {
  url: string;
}): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null); // Usa el tipo genérico T aquí

  useEffect(() => {
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

    fetchData();
  }, [url]);

  return { data };
};
