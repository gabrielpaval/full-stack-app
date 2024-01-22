import { Car } from "./car";

export interface Person {
    id?: number,
    first_name: string,
    last_name: string,
    cnp: string,
    age: number,
    car_list: Car[]
}