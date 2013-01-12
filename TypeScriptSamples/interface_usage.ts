interface Drivable {
    start(): void;
    drive(distance: number): void;
    getPosition(): number;
}

class Car implements Drivable {
  private isRunning: bool = false;
  private distanceFromStart: number;
  
  public start(): void {
    this.isRunning = true;
  }
  public drive(distance: number): void {
    if (this.isRunning) {
      this.distanceFromStart += distance;           
    }        
  }
  public getPosition(): number {
    return this.distanceFromStart;
  }
}