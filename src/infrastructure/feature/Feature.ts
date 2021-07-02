import { Logger } from '../logger';
import {
  IFeatureCriteria,
  IFeatureEntry,
  IFeatureRule,
  IFeatureToggle,
  IFeatureUser,
} from './';

export const featureStore: Map<string, IFeatureEntry> = new Map();
export const featureRules: Map<string, (...args: any[]) => boolean> = new Map();
export const featureProcesses: Map<string, IFeatureToggle> = new Map();

export class FeatureManager {
  private ft: Map<string, IFeatureEntry>;
  private r: Map<string, (...args: any[]) => boolean>;

  public log: Logger;

  constructor(log: Logger) {
    this.log = log;

    this.ft = featureStore;
    this.r = featureRules;

    this.log.info(`[FeatureManger] construct`);
  }

  private featureValidate(feature: IFeatureToggle): Error | null {
    if (undefined === feature.oldProcess) {
      this.log.warn(
        `[FeatureManger][${feature.name}] Fail due to [OldFeature] is not defined`
      );
      return new Error('Error old feature missing');
    }

    if (undefined === feature.newProcess) {
      this.log.warn(
        `[FeatureManger][${feature.name}] Fail due to [NewFeature] is not defined`
      );
      return new Error('Error new feature missing');
    }

    return null;
  }

  private validate(user: IFeatureUser, feature: IFeatureToggle): boolean {
    const f = featureStore.get(feature.name);
    let isValid = true;

    if (false === f?.enable) {
      this.log.warn(
        `[FeatureManger][${feature.name}] Fail due to [enable] is [false]`
      );
      return false;
    }

    // TODO: Have environment flags with inclusion
    if ('dev' !== f?.stability) {
      this.log.warn(`[FeatureManger][${feature.name}] Fail due to [stability]`);
      return false;
    }

    for (const criteria of f.criteria) {
      const params = [user].concat(criteria.params);

      const ruleIsValid = featureRules
        .get(criteria.id)
        ?.apply(featureRules.get(criteria.id), params);

      this.log.info(
        `[FeatureManger][${feature.name}] Apply criteria: ${criteria.id}`,
        params
      );

      if (undefined === ruleIsValid) {
        isValid = false;
        this.log.warn(
          `[FeatureManger][${feature.name}] Fail due to [${criteria.id}] definition missing.`
        );
        break;
      }

      if (false === ruleIsValid) {
        isValid = false;
        this.log.warn(
          `[FeatureManger][${feature.name}] Fail due to [${criteria.id}] criteria not meet`
        );
        break;
      }
    }

    return isValid;
  }

  public rules(r: IFeatureRule[]) {
    for (const rule of r) {
      if (false === this.r.has(rule.id)) {
        this.r.set(rule.id, rule.rule);
      }
    }
  }

  public features(ft: IFeatureEntry[]) {
    for (const feat of ft) {
      if (false === this.ft.has(feat.name)) {
        this.ft.set(feat.name, feat);
      }
    }
  }

  public execute(user: IFeatureUser) {
    featureProcesses.forEach((feat) => {
      let inUseFunc = 'OLD';

      if (null !== this.featureValidate(feat)) {
        this.log.info(
          `[FeatureManger][${feat.name}] Using [${inUseFunc}] functionality`
        );
        return;
      }

      feat.currentProcess = feat.oldProcess;

      if (true === this.validate(user, feat)) {
        feat.currentProcess = feat.newProcess;
        inUseFunc = 'NEW';
      }

      feat.context[feat.oldProcess!.name] = feat.currentProcess;

      this.log.info(
        `[FeatureManger][${feat.name}] Using [${inUseFunc}] functionality`
      );
    });
  }
}

export class Feature implements IFeatureEntry {
  public name: string;
  public criteria: IFeatureCriteria[];
  public stability: string;
  public enable: boolean = true;

  constructor(feature: IFeatureEntry) {
    this.name = feature.name;
    this.criteria = feature.criteria;
    this.stability = feature.stability;
    this.enable = feature.enable;
  }
}

// TODO: Implement this helper for non-class methods
export class FeatureToggle<T> {
  public name: string;
  public context: T;
  public target: string;

  public oldProcess: (...args: any[]) => any;
  public newProcess: (...args: any[]) => any;
  public currentProcess?: (...args: any[]) => any | null;

  constructor(
    name: string,
    context: T,
    target: string,
    oldProcess: (...args: any[]) => any,
    newProcess: (...args: any[]) => any
  ) {
    this.name = name;
    this.context = context;
    this.target = target;

    this.newProcess = newProcess;
    this.oldProcess = oldProcess;
    this.currentProcess = oldProcess;

    this.save();
  }

  private save() {
    if (false === featureProcesses.has(this.name)) {
      featureProcesses.set(this.name, this);
    }
  }
}

const fr = new FeatureManager(new Logger('FeatureManager'));

// tslint:disable-next-line: variable-name
export const FeatureRunner = fr;
