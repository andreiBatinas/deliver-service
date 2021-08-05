export interface AddFleetDTO {
  fleetToAdd: {
    fleetName: string;
    fleetLocation: string;
    fleetCreatedAt: Date;
    fleetUpdatedAt: Date;
    accountId: number;
  };
}
