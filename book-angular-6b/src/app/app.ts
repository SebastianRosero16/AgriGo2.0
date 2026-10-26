import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PurchaseStore } from './purchase/purchase.store';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly purchaseStore = inject(PurchaseStore);

  protected readonly cartCount = this.purchaseStore.cartCount;
  protected readonly persistenceNotice = this.purchaseStore.persistenceNotice;
}
