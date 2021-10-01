import { featureProcesses, featureStore } from './Feature';

// tslint:disable-next-line: function-name
export function OldFeature(name: string) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    if (false === featureProcesses.has(name)) {
      featureProcesses.set(name, {
        name,
        context: target,
      });
    }

    featureProcesses.get(name)!.oldProcess = descriptor.value;
    featureProcesses.get(name)!.currentProcess = descriptor.value;
  };
}

// tslint:disable-next-line: function-name
export function NewFeature(name: string) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    if (false === featureProcesses.has(name)) {
      featureProcesses.set(name, {
        name,
        context: target,
      });
    }

    const fn = descriptor.value;
    descriptor.value = async function (this: any, ...args: any[]) {
      try {
        await fn.apply(this, args);
      } catch (error) {
        featureStore.get(name)!.enable = false;

        this.fail(error);
      }
    };
    featureProcesses.get(name)!.newProcess = descriptor.value;
  };
}
