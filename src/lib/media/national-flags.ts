export type NationalFlag = {
  code: string;
  name: string;
  welcome: string;
};

/** Representative nations — cycles on the home hero (all nations welcome). */
export const NATIONAL_FLAGS: NationalFlag[] = [
  { code: "ca", name: "Canada", welcome: "Welcome home in Canada" },
  { code: "ng", name: "Nigeria", welcome: "Nigerian community welcome" },
  { code: "pk", name: "Pakistan", welcome: "Pakistani neighbours welcome" },
  { code: "in", name: "India", welcome: "Indian families welcome" },
  { code: "jm", name: "Jamaica", welcome: "Jamaican voices welcome" },
  { code: "ph", name: "Philippines", welcome: "Filipino friends welcome" },
  { code: "et", name: "Ethiopia", welcome: "Ethiopian community welcome" },
  { code: "sy", name: "Syria", welcome: "Syrian newcomers welcome" },
];

export function flagImageUrl(code: string, width = 320): string {
  return `https://flagcdn.com/w${width}/${code}.png`;
}
