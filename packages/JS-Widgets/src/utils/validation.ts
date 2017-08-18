
export const R = {
  required: (name, value) =>
    value.toString().trim() ? '' : `Field ${name} is required`,
  maxLength: (n: number) =>
    (name, value: string) => value.length <= n ? '' : `${name} have to be shorter than ${n} characters`,
  number: (name, value) =>
    !isNaN(parseFloat(value)) && isFinite(value) ? '' : `${name} have to be number`,
  value: (validator: (v: number | string) => boolean, reason: string) =>
    (name, value) => validator(value) ? '' : reason,
};

type TValidationFunc = (value: any) => string | undefined;

export const validate = (rules: TValidationFunc[] | undefined, value: any): string | undefined => {
  if (!rules) {
    return undefined;
  }
  const validationResult = rules.map((r) => r(name, value)).filter((v) => !!v);

  return validationResult[0];
};
