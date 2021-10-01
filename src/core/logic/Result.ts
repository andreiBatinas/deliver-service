// eslint-disable-next-line max-classes-per-file
enum ResultError {
  InvalidOperation = 'A result cannot be successful and contain an error or vice versa',
  ErrorValue = "Can't get the value of an error result. Use 'errorValue' instead.",
}

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: T | string;
  private _value: T | undefined;

  public constructor(isSuccess: boolean, error?: T | string, value?: T) {

    if (isSuccess && error) {
      throw new Error(ResultError.InvalidOperation);
    }

    if (!isSuccess && !error) {
      throw new Error(ResultError.InvalidOperation);
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T | undefined {
    if (!this.isSuccess) {
      throw new Error(ResultError.ErrorValue);
    }

    return this._value;
  }

  public errorValue(): T {
    return this.error as T;
  }

  // tslint:disable-next-line: function-name
  public static OK<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  // tslint:disable-next-line: function-name
  public static Fail<U>(error: any): Result<U> {

    return new Result<U>(false, error);
  }

  // tslint:disable-next-line: function-name
  public static Combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.OK();
  }
}

export type Either<L, A> = Wrong<L, A> | Right<L, A>;

export class Wrong<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isWrong(): this is Wrong<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isWrong(): this is Wrong<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const wrong = <L, A>(l: L): Either<L, A> => {
  return new Wrong(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
