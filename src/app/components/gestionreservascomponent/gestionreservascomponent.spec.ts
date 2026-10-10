import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gestionreservascomponent } from './gestionreservascomponent';

describe('Gestionreservascomponent', () => {
  let component: Gestionreservascomponent;
  let fixture: ComponentFixture<Gestionreservascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Gestionreservascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Gestionreservascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
