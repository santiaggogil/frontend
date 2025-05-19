import { DateTime } from 'luxon'
export class Service {
    id?: number;
    name?: string;
    cost?: number;
    start_date?: DateTime;
    end_date?: DateTime;
    description?:string;
}
