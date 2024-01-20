import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss']
})
export class CarModalComponent implements OnInit {
  @Input() car_id: number | undefined;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.car_id) {
      this._spinner.show();
      axios.get(`/api/cars/${this.car_id}`).then(({data}) =>{
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error("Eroare la preluarea mașnilor!"));
    }
  }

  save(): void{
    this._spinner.show();
    
    if (!this.car_id) {
      axios.post('/api/cars', this.modal).then(() =>{
        this._spinner.hide();
        this.toastr.success("Mașina a fost salvată cu succes!");
        this.activeModal.close();
    }).catch(() => this.toastr.error("Eroare la salvarea mașinei!"));
    } else {
      axios.put(`/api/cars/${this.car_id}`, this.modal).then(() =>{
        this._spinner.hide();
        this.toastr.success("Mașina a fost modificată cu succes!");
        this.activeModal.close();
      }).catch(() => this.toastr.error("Eroare la modificarea mașinei!"));
    }
  }

}
