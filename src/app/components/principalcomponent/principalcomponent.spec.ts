import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Principalcomponent } from './principalcomponent';

describe('Principalcomponent', () => {
  let component: Principalcomponent;
  let fixture: ComponentFixture<Principalcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Principalcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Principalcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
