import { User } from "./user";
import { Evento } from "./evento";

export interface Participation{
    id? : number;
    userId : number;
    eventId : number;
    isConfirmed : number;
    usuario? : User;
    evento? : Evento;
}