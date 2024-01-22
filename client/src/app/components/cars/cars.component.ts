import { Component, OnInit } from '@angular/core';
import {faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CarModalComponent } from './car-modal/car-modal.component';
import { SCROLL_TOP } from 'src/app/utils/utils-table';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Car } from 'src/app/interface/car';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  faPlus = faPlus;
  cars: Car[] = [];
  showBackTop: string = '';
  limit: number = 70;
  faChevronUp = faChevronUp;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  constructor(private _modal: NgbModal, 
              private _spinner: NgxSpinnerService, 
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void =>{
    this._spinner.show();
    axios.get('api/cars').then(({data})=>{
      this.cars = data;
      this._spinner.hide();
    }).catch(()=> this.toastr.error('Eroare la preluarea mașinilor!'));
  }

  addEdit = (car_id?:number) : void =>{
    const modalRef = this._modal.open(CarModalComponent, {size: '', keyboard: false, backdrop: "static"});
    modalRef.componentInstance.car_id = car_id;
    modalRef.closed.subscribe(()=>{
      this.loadData();
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-cars', 0);
    this.limit = 70;
  }

  delete = (car: any): void =>{
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: "static"});
    modalRef.componentInstance.title = `Ștergere mașină`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți mașina având marca: <b>${car.brand_name}</b> și modelul: <b>${car.model_name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/cars/${car.id}`).then(() =>{
        this.toastr.success("Mașina a fost ștearsă cu succes!");
        this.loadData();
      }).catch(() => this.toastr.error("Eroare la ștergerea mașinei!"));
    });
  }
}
