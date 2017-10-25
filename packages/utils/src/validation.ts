
export const R = {
  required: (name, value) =>
    value && value.toString().trim() ? '' : `Field ${name} is required`,
  maxLength: (n: number) =>
    (name, value: string) => value.length <= n ? '' : `${name} has to be shorter than ${n} characters`,
  number: (name, value) =>
    !isNaN(parseFloat(value)) && isFinite(value) ? '' : `${name} has to be number`,
  value: (validator: (v: number | string | any) => boolean, reason: string) =>
    (name, value) => validator(value) ? '' : reason,
};

type TValidationFunc = (name: string, value: any) => string | undefined;

export const validate = (rules: TValidationFunc[] | undefined, value: any): string | undefined => {
  if (!rules) {
    return undefined;
  }
  const validationResult = rules.map((r) => r(name, value)).filter((v) => !!v);

  return validationResult[0];
};

export const validateMultipe = (rules: { [key: string ]: TValidationFunc[] }, values: {[key: string]: any}) => {
  const errors = Object.entries(rules).reduce((acc, [name, rules]) => {
    const validations = validate(rules, values[name]);
    return !validations ? acc : { ...acc, [name]: validations };
  }, {});

  return errors;
};
