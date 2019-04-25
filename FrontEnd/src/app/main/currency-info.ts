import { Hodl } from './hodl.enum';

export interface CurrencyInfo {
    code: string;
    name: string;
    hodl: Hodl;
}
