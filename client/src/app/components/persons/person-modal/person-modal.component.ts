import { Component, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
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

  // Constructor with injected services
  constructor(
    private _spinner: NgxSpinnerService, 
    public activeModal: NgbActiveModal, 
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    // Fetch car data from the API
    axios.get('/api/cars').then(({data}) => {
      this.cars = data;
    }).catch(() => {});

    if (this.person_id) {
      this._spinner.show();
      // Fetch person details from the API
      axios.get(`/api/persons/${this.person_id}`).then(({data}) => {
        this.modal = data;
        this.ownedCars = data.car_list;

        // Reset car_list if the first car has a null id
        if(data.car_list[0].id === null) {
          this.modal.car_list = [];
          this.ownedCars = [];
        }

        this._spinner.hide();
      }).catch(() => this.toastr.error("Eroare la preluarea persoanelor!"));
    }
  }

  // Method to save or update person details
  save(): void{
    this.invalidFields = [];

    // Validate form fields
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
      // POST request to save a new person
      axios.post('api/persons', this.modal).then(({data}) => {

        this.person_id = data.id;

        // Call updateCars method to handle car associations
        this.updateCars('Eroare la salvarea persoanei!', 'Persoana a fost salvată cu succes!');

      }).catch(() => this.toastr.error("Eroare la salvarea persoanei!"));
    } else {
      // PUT request to update an existing person
      axios.put('api/persons', this.modal).then(() =>{

        // Call updateCars method to handle car associations
        this.updateCars('Eroare la salvarea persoanei!', 'Persoana a fost salvată cu succes!');

      }).catch(() => this.toastr.error("Eroare la modificarea persoanei"));
    }
  }

  // Method to calculate age based on CNP
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

  // Method to update cars associated with the person
  async updateCars(errorText: string, successText: string): Promise<void> {
    try {
      const toDelete = this.ownedCars.length;
      const toAdd = this.modal.car_list.length;
  
      // Delete associations for cars that were previously owned
      await Promise.all(
        this.ownedCars.map(async (car) => {
          try {
            await axios.delete(`/api/persons/${this.person_id}/removeCar`, { data: { car_id: car.id } });
          } catch (deleteError) {
            throw deleteError;
          }
        })
      );
   
      // Create associations for cars that are currently owned
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