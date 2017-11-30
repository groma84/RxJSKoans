import { Observable } from "rxjs/Rx";

QUnit.module("Mapping");

const __ = "Fill in the blank";

test("flatMap can be a cartesian product", () => {
  const results = [];
  // range hat als Parameter: start, count
  // also bekommen wir hier: ab 1, 0 Werte - ab 2, 1 Wert - ab 3, 2 Werte -> [2, 3, 4]
  Observable.range(1, 3)
    .flatMap((x, i) => Observable.range(x, i))
    .subscribe(::results.push);

  equal("234", results.join(""));
});

test("switchMap only gets us the latest value", () => {
  const results = [];
  Observable.range(1, 3)
    .switchMap(x => Observable.range(x, x))
    .subscribe(::results.push);

  equal("123345", results.join(""));
});
