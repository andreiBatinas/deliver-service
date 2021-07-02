import { UniqueEntityId } from './';
import { Entity } from './Entity';

// TODO: Add observable hooks here
export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityId {
    return this._id;
  }
}
