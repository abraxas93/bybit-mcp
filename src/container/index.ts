import {
  IMathService,
  IErrorService,
  IBybitService,
  MathService,
  ErrorService,
  BybitService,
} from '../services';

export interface IContainer {
  mathService: IMathService;
  errorService: IErrorService;
  bybitService: IBybitService;
}

export default function createContainer(): IContainer {
  return {
    mathService: new MathService(),
    errorService: new ErrorService(),
    bybitService: new BybitService(),
  };
}
