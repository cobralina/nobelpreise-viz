export type SelectedPerson = {
  year: string;
  category: string;
  name: string;
  herkunftsland: string;
  forschungsstandort: string;
  infotext: string;
  imgurl: string;
  imgcredit: string;
  vita: string;
};

export type originDataObject = {
  artikellink: string;
  beschreibung: string;
  color: string;
  fach: string;
  forschungsstandort: string;
  foto: string;
  fotoquelle: string;
  geschlecht: string;
  herkunftsland: string;
  jahr: string;
  name: string;
  vita: string;
};

export type GroupedByYear = { [year: string]: originDataObject[] }[];

export type CircleData = originDataObject & { cx: number };
