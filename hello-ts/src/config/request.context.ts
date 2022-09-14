import { NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestMap {
    tenantid: string;
    reqid: string;
    loggedin: any;
}

export class RequestContext {
  private static $instance: RequestContext;
  private readonly $storage: AsyncLocalStorage<Map<string, any>>;

  private constructor() {
    this.$storage = new AsyncLocalStorage<Map<string, any>>();
  }

  public static instance(): RequestContext {
    if (this.$instance) return this.$instance;
    this.$instance = new RequestContext();
    return this.$instance;
  }

  private store(): Map<string, any> {
      const store = this.$storage.getStore();
      return  store ? store : new Map<string, any>();
  }

  public bootRun(params: Map<string, any>, next: NextFunction) {
      this.$storage.run(new Map<string, any>(), () => {
          params.forEach((value: any, key: string) => {
            this.store().set(key, value);
          });
        
        next();
      });
  }

  public get(key: string) {
      return this.store().get(key);
  }
}
