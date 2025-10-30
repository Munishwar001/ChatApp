import { Component } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie'; 
@Component({
  selector: 'app-not-found',
  imports: [LottieComponent],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  options = {
    path: './Loader cat.json',
    loop: true,
    autoplay: true,
  };
}
