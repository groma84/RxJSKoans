import { Observable } from "rxjs/Rx";
import Range from "../util/range";

QUnit.module("Composable Observations");

const __ = "Fill in the blank";

test("composable add", () => {
  let received = 0;
  const numbers = [10, 100, 1000];

  Observable.from(numbers)
    .reduce((sum, v) => sum + v, 0) // XXX .sum() not yet implemented
    .subscribe(x => {
      received = x;
    });

  equal(1110, received);
});

test("composable before and after", () => {
  const names = Range.create(1, 6);
  let a = "";
  let b = "";

  Observable.from(names)
    .do(n => {
      a += n;
    })
    .filter(n => n % 2 === 0)
    .do(n => {
      b += n;
    })
    .subscribe();

  equal("123456", a);
  equal("246", b);
});

test("we wrote this", () => {
  const received = [];
  const names = ["Bart", "Marge", "Wes", "Linus", "Erik", "Matt"];

  Observable.from(names)
    .filter(n => n.length <= 4)
    .subscribe(x => received.push(x));

  equal("Bart,Wes,Erik,Matt", received);
});

test("converting events", () => {
  let received = "";
  const names = ["wE", "hOpE", "yOU", "aRe", "eNJoyIng", "tHiS"];

  Observable.from(names)
    .map(x => x.toLowerCase())
    .subscribe(x => {
      received += x + " ";
    });

  equal("we hope you are enjoying this ", received);
});

test("create a more relevant stream", () => {
  let received = "";
  const mouseXMovements = [100, 200, 150];
  const relativemouse = Observable.from(mouseXMovements).map(x => x - 50);

  relativemouse.subscribe(x => {
    received += x + ", ";
  });

  equal("50, 150, 100, ", received);
});

test("checking everything", () => {
  let received = null;
  const names = [2, 4, 6, 8];

  Observable.from(names)
    .every(x => x % 2 === 0)
    .subscribe(x => {
      received = x;
    });

  equal(true, received);
});

test("composition means the sum is greater than the parts", () => {
  let received = 0;
  const numbers = Observable.range(1, 10);

  numbers
    .filter(x => x > 8)
    .reduce((sum, v) => sum + v, 0) // XXX .sum() not yet implemented
    .subscribe(x => {
      received = x;
    });

  equal(19, received);
});
