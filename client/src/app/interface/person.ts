import { Car } from "./car";

// Interface to define the structure of a Person object
export interface Person {
    id?: number,
    first_name: string,
    last_name: string,
    cnp: string,
    age: number,
    car_list: Car[]
}