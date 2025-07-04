import { TestBed } from '@angular/core/testing';

import { ApiClientService } from './api-client.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ApiClientService', () => {
    let service: ApiClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: 'apiUrl',
                    useValue: 'http://localhost:3000'
                },
                {
                    provide: JWT_OPTIONS,
                    useValue: JWT_OPTIONS
                },
                JwtHelperService,
            ]
        });
        service = TestBed.inject(ApiClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
