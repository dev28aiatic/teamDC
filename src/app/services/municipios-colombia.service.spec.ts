import { TestBed } from '@angular/core/testing';

import { MunicipiosColombiaService } from './municipios-colombia.service';

describe('MunicipiosColombiaService', () => {
  let service: MunicipiosColombiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunicipiosColombiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
