export interface IFeatureRule {
  id: string;
  rule(user: IFeatureUser, ...args: any[]): boolean;
}

export interface IFeatureCriteria {
  id: string;
  params: any[];
}

export interface IFeatureEntry {
  name: string;
  stability: string;
  enable: boolean;
  criteria: IFeatureCriteria[];
}

export interface IFeatureToggle {
  name: string;
  context: any;
  currentProcess?: (...args: any[]) => any;
  newProcess?: (...args: any[]) => any;
  oldProcess?: (...args: any[]) => any | null;
}

export interface IFeatureUser {
  id: string | number;
  name: string;
}
