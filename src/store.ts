import { writable } from "svelte/store";

export const dataStore = writable<any[]>([]);

const themeColors: Record<string, string> = {
  Chemie: "#8667a1",
  Frieden: "#72b7ba",
  Literatur: "#8a6d45",
  Medizin: "#8f474c",
  Physik: "#548c64",
  Wirtschaft: "#ccbb5a",
};

export async function fetchSheetData() {
  const response = await fetch(
    "https://api.y.faz.net/spreadsheets/static/1UGuEDLZGkqM9K2RdClCPg1ECrbmPJ15eM562OlY-rAg_daten.json"
  );
  const data = await response.json();
  const objData = arraysToObjects(data);
  const dataWithColors = objData.map((row: any) => ({
    ...row,
    color: themeColors[row.fach] || "#cccccc",
  }));
  dataStore.set(dataWithColors);
  console.log("Data set in store:", dataWithColors);
}

function arraysToObjects(data: any[][]): Record<string, any>[] {
  const [header, ...rows] = data;
  return rows.map((row) => {
    const obj: Record<string, any> = {};
    header.forEach((key, i) => {
      obj[key] = row[i] ?? ""; // Falls ein Wert fehlt, leeres Feld
    });
    return obj;
  });
}
