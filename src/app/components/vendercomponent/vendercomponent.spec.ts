import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vendercomponent } from './vendercomponent';

describe('Vendercomponent', () => {
  let component: Vendercomponent;
  let fixture: ComponentFixture<Vendercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Vendercomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Vendercomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
