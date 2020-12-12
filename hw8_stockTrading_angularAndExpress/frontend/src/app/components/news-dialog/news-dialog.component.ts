import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-dialog',
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.css']
})

export class NewsDialogComponent {
  @Input() source;
  @Input() pubishedAt;
  @Input() title;
  @Input() newsDescription;
  @Input() url;

  constructor(public activeModal: NgbActiveModal) { }
}