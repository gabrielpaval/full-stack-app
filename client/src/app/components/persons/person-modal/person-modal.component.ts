import { Component, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss']
})
export class PersonModalComponent implements OnInit {
  @Input() person_id: number | undefined;

  age: number | undefined; 
  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.person_id) {
      this._spinner.show();
      axios.get(`/api/persons/${this.person_id}`).then(({data}) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error("Eroare la preluarea persoanelor!"));
    }
  }

  save(): void{
    this._spinner.show();

    if (!this.person_id) {
      axios.post('api/persons', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Persoana a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error("Eroare la salvarea persoanei!"));
    } else {
      axios.put('api/persons', this.modal).then(() =>{
        this._spinner.hide();
        this.toastr.success("Persoana a fost modificată cu succes!");
        this.activeModal.close();
      }).catch(() => this.toastr.error("Eroare la modificarea persoanei"));
    }
  }

  calculateAge(cnp: string): void {
    let year= cnp.substring(1,2);
    let yearOfBirth
    if (parseInt(year) > 24) {
      yearOfBirth = "19" + year; 
    } else {
      yearOfBirth = "20" + year;
    }
    let dateOfBirth = yearOfBirth + cnp.substring(3,6);
    
    this.age = moment().diff(moment(dateOfBirth,'YYYYMMDD'),'years'); 
    console.log(this.age);  
  }
}
    


