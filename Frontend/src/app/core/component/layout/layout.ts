import { Component ,ViewChild  } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { Sidebar } from '../../../shared/component/sidebar/sidebar';
import { MobileHeader } from '../../../shared/component/mobile-header/mobile-header';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet ,Sidebar ,MobileHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
   @ViewChild(Sidebar) sidebar!: Sidebar;
  
  pageTitle = 'All Chats';

  onMenuToggle() {
    if (this.sidebar) {
      this.sidebar.toggleSidebar();
    }
  }

  updatePageTitle(title: string) {
    this.pageTitle = title;
  }
}
