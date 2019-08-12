import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCreateComponent } from './courses-create.component';

describe('CoursesCreateComponent', () => {
  let component: CoursesCreateComponent;
  let fixture: ComponentFixture<CoursesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
