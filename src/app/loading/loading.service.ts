import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  //un subject es como un observable en el sentido de que pueden subscribirse para ver sus valores, pero el observable no puede emitir valores.
  private loadingSubject = new BehaviorSubject<boolean>(false);
  //usamos el subject como un observable para que los que se subscriban solo puedan escuchar los valores pero no emitirlos, por eso lo dejamos privado y la logica para emitir queda encapsulada.
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // este metodo es como un decorator, le agrega funcionalidad al observable que le pasamos
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    //creamos un default observable que solo emite el valor null,

    return of(null).pipe(
      //usamos tap para el side effect y emitimos el valor true del loading$
      tap(() => this.loadingOn()),
      //comenzamos a emitir los valores del obs$
      concatMap(() => obs$),
      //al finalizar emitimos false al loading$
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    //cuando emitamos este valor en el subject automaticamente se va a emitir a quienes esten subscriptos al observable
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
