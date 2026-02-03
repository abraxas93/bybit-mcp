import {
  IErrorService,
  IBybitService,
  ErrorService,
  BybitService,
} from '../services';

export interface IContainer {
  errorService: IErrorService;
  bybitService: IBybitService;
}

export default function createContainer(): IContainer {
  return {
    errorService: new ErrorService(),
    bybitService: new BybitService(),
  };
}
