export interface AddFleetDTO {
  fleetToAdd: {
    fleetName: string;
    fleetLocation: string;
    accountId: number;
  };
}
