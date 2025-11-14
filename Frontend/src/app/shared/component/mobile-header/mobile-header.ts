import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  imports: [],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.css',
})
export class MobileHeader {
  @Input() pageTitle: string = 'ChatApp';
  @Output() menuToggle = new EventEmitter<void>();
   
   onMenuToggle() {
    this.menuToggle.emit();
  }
}
