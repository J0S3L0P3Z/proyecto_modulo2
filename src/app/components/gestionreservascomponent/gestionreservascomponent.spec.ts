import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gestionreservascomponent } from './gestionreservascomponent';

describe('gestionreservascomponent', () => {
  let component: gestionreservascomponent;
  let fixture: ComponentFixture<gestionreservascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [gestionreservascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(gestionreservascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
