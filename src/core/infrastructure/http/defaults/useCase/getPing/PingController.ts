import { HttpController } from '../../../../HttpController';
import { PingDTO } from './PingDTO';
import { PingUseCase } from './PingUseCase';

export class PingController extends HttpController {
  private useCase: PingUseCase;

  constructor(useCase: PingUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = {} as PingDTO;
    const result = await this.useCase.execute(dto);
    return this.ok(this.res, result.value.getValue());
  }
}
