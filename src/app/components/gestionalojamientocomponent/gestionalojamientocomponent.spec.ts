import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gestionalojamientocomponent } from './gestionalojamientocomponent';

describe('Gestionalojamientocomponent', () => {
  let component: Gestionalojamientocomponent;
  let fixture: ComponentFixture<Gestionalojamientocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Gestionalojamientocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Gestionalojamientocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
