export const R = {
  required: (name, value) => (value && value.toString().trim() ? '' : `Field ${name} is required`),
  maxLength: (n: number) => (name, value: string) =>
    value.length <= n ? '' : `${name} has to be shorter than ${n} characters`,
  number: (name, value) => (!isNaN(parseFloat(value)) && isFinite(value) ? '' : `${name} has to be a number`),
  value: (validator: (v: number | string | any) => boolean, reason: string) => (name, value) =>
    validator(value) ? '' : reason,
  link: (name, value) =>
    R.value((v: string) => httpRegExp.test(v), 'Has to start with http(s)://')(name, value) ||
    R.value((v: string) => urlRegExp.test(v), 'Has to be valid url')(name, value),
  greaterThan: (minValue: number) =>
    R.value((v: string) => parseInt(v, 10) >= minValue, `Has to be greater than minimal value: ${minValue}`),
  currencyDecimals: (decimals: number) =>
    R.value((v: string) => {
      const dotIndex = v.indexOf('.');
      if (dotIndex !== -1) {
        return v.length - 1 - dotIndex <= decimals;
      }
      return true;
    }, `The currency decimals are incorrect, should be at most ${decimals}`),
};

export type TValidationFunc = (name: string | undefined, value: any) => string | undefined;

export const validate = (rules: TValidationFunc[] | undefined, value: any, name?: string): string | undefined => {
  if (!rules) {
    return undefined;
  }
  const validationResult = rules.map((r) => r(name, value)).filter((v) => !!v);

  return validationResult[0];
};

export const validateMultipe = (rules: { [key: string]: TValidationFunc[] }, values: { [key: string]: any }) => {
  const errors = Object.entries(rules).reduce((acc, [name, rules]) => {
    const validations = validate(rules, values[name], name);
    return !validations ? acc : { ...acc, [name]: validations };
  }, {});

  return errors;
};

const httpRegExp = /^https?:\/\//;
const urlRegExp = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,8}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
