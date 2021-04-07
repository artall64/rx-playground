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
          delay(500) // you can think that is some long poling interval
        );
      })
    );

    const stream2$ = from(['Force Refresh']).pipe(
      delay(1100) // fires right after polling event  100ms after 2 (500 + 500 + 100)
    );


    // tslint:disable-next-line:no-console
    console.time('profiling');

    merge(stream1$, stream2$).pipe(
      throttleTime(110), // problem here - forced refresh is swallowed by throttleTime
      // throttleTime(90) // no problems throttleTime is short
      // throttleTime(110, asyncScheduler, {leading: false, trailing: true}) // fix force refresh delayed by throttleTime but not swallowed
    ).subscribe({
      next: (x) => {
        console.timeLog('profiling', x);
      },
      error: () => {
      }
    });
  }
}
