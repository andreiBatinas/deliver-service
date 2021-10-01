export interface IValidatorResult {
  succeeded: boolean;
  message?: string;
}

export interface IValidatorArgument {
  arg: any;
  argName: string;
}

export type ValidatorArgumentCollection = IValidatorArgument[];

export class Validator {
  public static combine(guardResults: IValidatorResult[]): IValidatorResult {
    for (const result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static notNullOrUndefined(
    arg: any,
    argName: string
  ): IValidatorResult {
    if (arg === null || arg === undefined || arg === '') {
      return {
        succeeded: false,
        message: `${argName} is null or undefined`
      };
    }
    return { succeeded: true };
  }
  public static notNullOrUndefinedBulk(
    args: ValidatorArgumentCollection
  ): IValidatorResult {
    for (const arg of args) {
      const result = Validator.notNullOrUndefined(arg.arg, arg.argName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validEnum: any[],
    argName: string
  ): IValidatorResult {
    let isValid = false;

    for (const v of validEnum) {
      if (value === v) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true };
    }

    return {
      succeeded: false,
      message: `Value ${argName} is not a valid option of ${JSON.stringify(
        validEnum
      )}. Got: ${value}`
    };
  }
  // TODO: Add more validators here
}
