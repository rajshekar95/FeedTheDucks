import {Users} from './Users';
import {Foods} from './Foods';

export interface Feeds{
    id : number;
    location : string;
    foodTypeId : number;
    quantity : number;
    time : Date;
    totalNumberOfDucks : number;
    userId : number;
    foods : Foods[];
    users : Users[];
}