export type NationalFlag = {
  code: string;
  name: string;
  welcome: string;
};

/** Nations shown on the home hero flag cycle (client-provided set). */
export const NATIONAL_FLAGS: NationalFlag[] = [
  { code: "tz", name: "Tanzania", welcome: "Tanzanian community welcome" },
  { code: "gh", name: "Ghana", welcome: "Ghanaian neighbours welcome" },
  { code: "ng", name: "Nigeria", welcome: "Nigerian community welcome" },
  { code: "tr", name: "Türkiye", welcome: "Turkish newcomers welcome" },
  { code: "et", name: "Ethiopia", welcome: "Ethiopian community welcome" },
  { code: "ke", name: "Kenya", welcome: "Kenyan voices welcome" },
  { code: "ug", name: "Uganda", welcome: "Ugandan families welcome" },
  { code: "id", name: "Indonesia", welcome: "Indonesian friends welcome" },
  { code: "so", name: "Somalia", welcome: "Somali community welcome" },
  { code: "ao", name: "Angola", welcome: "Angolan neighbours welcome" },
  { code: "cm", name: "Cameroon", welcome: "Cameroonian community welcome" },
  { code: "bw", name: "Botswana", welcome: "Botswanan voices welcome" },
];

export function flagImageUrl(code: string, width = 320): string {
  return `https://flagcdn.com/w${width}/${code}.png`;
}
