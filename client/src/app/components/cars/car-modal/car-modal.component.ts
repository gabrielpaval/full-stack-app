import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/interface/car';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss']
})

export class CarModalComponent implements OnInit {

  // Input property to receive car_id from parent component
  @Input() car_id: number | undefined;

  modal: Car = {
    brand_name: '',
    model_name: '',
    year: 0,
    cilindrical_capacity: 0,
    tax: 0
  };

  invalidFields: string[] = [];

  // Constructor with injected services
  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal, 
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    if (this.car_id) {

      this._spinner.show();

      // Fetch car details from API using axios
      axios.get(`/api/cars/${this.car_id}`).then(({data}) =>{

        this.modal = data;
        this._spinner.hide();

      }).catch(() => this.toastr.error("Eroare la preluarea mașnilor!"));
    }
  }

  // Method to save or update car details
  save(): void{
    this.invalidFields = [];

    // Validate form fields
    if(!this.modal.brand_name)
      this.invalidFields.push('Marcă');

    if(!this.modal.model_name)
      this.invalidFields.push('Model');

    if(!this.modal.year || this.modal.year < 0 || this.modal.year > 9999)
      this.invalidFields.push('Anul fabricației');

    if(!this.modal.cilindrical_capacity || this.modal.cilindrical_capacity < 0 || this.modal.cilindrical_capacity > 9999)  
      this.invalidFields.push('Capacitatea cilindrică');

    if(!this.modal.tax || this.modal.tax < 0 || this.modal.tax > 9999)
      this.invalidFields.push('Taxă');
    
    // Display error toastr if there are invalid fields
    if(this.invalidFields.length > 0)
      {
        this.toastr.error(`Campuri invalide:${this.invalidFields}`);
        return; 
      }

    this._spinner.show();
    
    if (!this.car_id) {
      // POST request to save a new car
      axios.post('/api/cars', this.modal).then(() =>{

        this._spinner.hide();
        this.toastr.success("Mașina a fost salvată cu succes!");
        this.activeModal.close();

    }).catch(() => this.toastr.error("Eroare la salvarea mașinei!"));
    } else {
      // PUT request to update an existing car
      axios.put('/api/cars', this.modal).then(() =>{

        this._spinner.hide();
        this.toastr.success("Mașina a fost modificată cu succes!");
        this.activeModal.close();

      }).catch(() => this.toastr.error("Eroare la modificarea mașinei!"));
    }
  }
  
  // Method to calculate tax based on capacity
  calculateTax(capacity:number): void {
      if(capacity < 1500)
        this.modal.tax = 50;
      else if(capacity >= 1500 && capacity <= 2000)
        this.modal.tax = 100;
      else
      this.modal.tax = 200;
  }
}