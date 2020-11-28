import { TestBed, async, inject} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { apiHttpSpringBootService } from './api-spring-boot.service';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

describe('Service-api-spring-boot', () => {
  let service: apiHttpSpringBootService;

  let mockHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [apiHttpSpringBootService, { provide: 'BASE_URL', useFactory: getBaseUrl }]
    });

    service = TestBed.inject(apiHttpSpringBootService);

    mockHttp = TestBed.get(HttpTestingController);
  });



  it('should be created-service-api-spring-boot', () => {
    expect(service).toBeTruthy();

  });

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:max-line-length
 /* it('count-projects', async(inject([HttpTestingController, service], (httpClient: HttpTestingController, service: apiHttpSpringBootService) => {

    service.listAllProjectsForAdmin() .subscribe((projects: any) => {
        expect(projects.length).toBe(7);
      });

    })));*/

  it('count-projects', () => {

        /*service.listAllProjectsForAdmin().subscribe((projects: any) => {
            expect(projects.length).toBe(7);
          });*/

      });

  /*it('apel jsonplaceholder.typicode.com', () => {


        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');

        expect(req.request.method).toBe('GET');

        req.flush(postItem);

        httpMock.verify();

  }); */




});
