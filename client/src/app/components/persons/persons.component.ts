import { Component, OnInit } from '@angular/core';
import {faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Person } from 'src/app/interface/person';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {
  faPlus = faPlus;
  persons: Person[]= [];
  showBackTop: string = '';
  limit: number = 70;
  faChevronUp = faChevronUp;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  
  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void =>{
    this._spinner.show();
    axios.get('api/persons').then(({ data })=>{
      this.persons = data;
      this._spinner.hide();
    }).catch(()=> this.toastr.error('Eroare la preluarea informatiilor!'));
  }

  addEdit = (person_id?:number) : void =>{
    const modalRef = this._modal.open(PersonModalComponent, {size: 'lg', keyboard: false, backdrop: "static"});
    modalRef.componentInstance.person_id = person_id;
    modalRef.closed.subscribe(()=>{
      this.loadData();
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-persons')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-persons', 0);
    this.limit = 70;
  }

  delete = (person: any): void =>{
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: "static"});
    modalRef.componentInstance.title = `Ștergere persoană`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana având numele: <b>${person.last_name}</b> și prenumele: <b>${person.first_name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/persons/${person.id}`).then(() =>{
        this.toastr.success("Persoana a fost ștearsă cu succes!");
        this.loadData();
      }).catch(() => this.toastr.error("Eroare la ștergerea persoanei!"));
    });
  }
}
