import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { CART_STORAGE_KEY, ORDERS_STORAGE_KEY } from './purchase/purchase.constants';

describe('App', () => {
  beforeEach(async () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the application shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the purchase navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav[aria-label="Navegación principal"]')?.textContent).toContain(
      'Mis pedidos',
    );
  });
});
