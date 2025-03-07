import { ComponentFixture, TestBed } from '@angular/core/testing';

import { File2Component } from './file2.component';

describe('File2Component', () => {
  let component: File2Component;
  let fixture: ComponentFixture<File2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [File2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(File2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
