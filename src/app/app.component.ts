import {Component} from '@angular/core';
import {asyncScheduler, from, merge, of} from 'rxjs';
import {concatMap, delay, tap, throttleTime} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app';

  constructor() {
    const stream1$ = from([1, 2, 3, 4, 5]).pipe(
      concatMap((elem) => {
        return of(elem).pipe(
          delay(500)
        );
      })
    );

    const stream2$ = from(['EVENT']).pipe(
      delay(1100)
    );


    // tslint:disable-next-line:no-console
    console.time('profiling');

    merge(stream1$, stream2$).pipe(
      throttleTime(110, asyncScheduler, {leading: false, trailing: true})
    ).subscribe({
      next: (x) => {
        console.timeLog('profiling', x);
      },
      error: () => {
      }
    });
  }
}
