import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() isLoading = false;

  private loadingSubscription!: Subscription;
  private hideDelay = 1000; // duración en ms para mantener el loader visible al ocultar

  constructor(private loaderService: LoaderService){}

  ngOnInit() {
    this.loadingSubscription = this.loaderService.loading$.subscribe(status => {
      if (status) {
        // Cuando loading true, mostrar inmediatamente
        this.isLoading = true;
      } else {
        // Cuando loading false, esperar hideDelay antes de ocultar
        timer(this.hideDelay).subscribe(() => this.isLoading = false);
      }
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
