export interface AddFleetDTO {
  fleet: {
    fleetName: string;
    fleetLocation: string;
    fleetCreatedAt: Date;
    fleetUpdatedAt: Date;
    accountId: number;
  };
}
