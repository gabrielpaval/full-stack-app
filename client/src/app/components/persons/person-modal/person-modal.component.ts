import { Component, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { error } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/interface/car';
import { Person } from 'src/app/interface/person';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss']
})
export class PersonModalComponent implements OnInit {
  @Input() person_id: number | undefined;

  modal: Person = {
    last_name:"",
    first_name:"",
    cnp:"",
    age: 0,
    car_list: []
  };
  cars: Car[] = [];
  ownedCars: Car[] = [];
  invalidFields: string[] = [];

  constructor(private _spinner: NgxSpinnerService, 
              public activeModal: NgbActiveModal, 
              private toastr: ToastrService) { }

  ngOnInit(): void {
    axios.get('/api/cars').then(({data}) => {
      this.cars = data;
    }).catch(() => {});

    if (this.person_id) {
      this._spinner.show();
      axios.get(`/api/persons/${this.person_id}`).then(({data}) => {
        this.modal = data;
        this.ownedCars = data.car_list;

        if(data.car_list[0].id === null) {
          this.modal.car_list = [];
          this.ownedCars = [];
        }

        this._spinner.hide();
      }).catch(() => this.toastr.error("Eroare la preluarea persoanelor!"));
    }
  }

  save(): void{
    this.invalidFields = [];

    if(!this.modal.last_name)
      this.invalidFields.push('Nume');
    if(!this.modal.first_name)
      this.invalidFields.push('Prenume');
    if(!this.modal.cnp)
      this.invalidFields.push('CNP');
    if(!this.modal.age)
      this.invalidFields.push('Vârstă');

    if(this.invalidFields.length > 0)
      {
        this.toastr.error(`Campuri invalide:${this.invalidFields}`);
        return; 
      }

    this._spinner.show();

    if (!this.person_id) {
      axios.post('api/persons', this.modal).then(({data}) => {

        this.person_id = data.id;
        this.updateCars('Eroare la salvarea persoanei!', 'Persoana a fost salvată cu succes!');

      }).catch(() => this.toastr.error("Eroare la salvarea persoanei!"));
    } else {
      axios.put('api/persons', this.modal).then(() =>{

        this.updateCars('Eroare la salvarea persoanei!', 'Persoana a fost salvată cu succes!');

      }).catch(() => this.toastr.error("Eroare la modificarea persoanei"));
    }
  }

  calculateAge(cnp:string): void{
    let year = parseInt(cnp.substring(1, 3));
    let month = parseInt(cnp.substring(3, 5)) - 1;
    let day = parseInt(cnp.substring(5, 7));

    const today = new Date();
    if(year <= today.getFullYear() % 100)
      year += 2000;
    else
      year += 1900;

    const birthday = new Date(year, month, day);

    this.modal.age = new Date(today.getTime() - birthday.getTime()).getFullYear() - 1970;
  }

  async updateCars(errorText: string, successText: string): Promise<void> {
    try {
      const toDelete = this.ownedCars.length;
      const toAdd = this.modal.car_list.length;
  
      await Promise.all(
        this.ownedCars.map(async (car) => {
          try {
            await axios.delete(`/api/persons/${this.person_id}/removeCar`, { data: { car_id: car.id } });
          } catch (deleteError) {
            throw deleteError;
          }
        })
      );
   
      await Promise.all(
        this.modal.car_list.map(async (car) => {
          try {
            await axios.post(`/api/persons/${this.person_id}/createCar`, { car_id: car.id });
          } catch (addError) {
            throw addError;
          }
        })
      );
    
      this._spinner.hide();
      this.toastr.success(successText);
      this.activeModal.close();
    } catch (error) {
      this.toastr.error(errorText);
    }
  }
}
    


