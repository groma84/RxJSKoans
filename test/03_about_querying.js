import { Observable } from "rxjs/Rx";
import { EventEmitter } from "events";

QUnit.module("Querying");

const __ = "Fill in the blank";

test("Basic querying", () => {
  const strings = [];
  const numbers = Observable.range(1, 100);

  numbers
    .filter(x => x % 11 === 0)
    .map(x => x.toString())
    //.toArray()
    .subscribe(x => strings.push(x));

  equal("11,22,33,44,55,66,77,88,99", strings.toString());
});

test("querying over events", () => {
  let results = 0;
  const e = new EventEmitter();

  Observable.fromEvent(e, "click")
    .filter(click => click.x === click.y)
    .map(click => click.x + click.y)
    .subscribe(x => {
      results = x;
    });

  e.emit("click", { x: 100, y: 40 });
  e.emit("click", { x: 75, y: 75 }); // nur dieses Event kommt durch den Filter
  e.emit("click", { x: 40, y: 80 });

  equal(results, 150);
});

test("buffering with count and skip", () => {
  const results = [];
  Observable.range(1, 10)
    .bufferCount(5, null)
    .subscribe(x => results.push(x));

  equal("12345", results[0].join(""));
  equal("678910", results[1].join(""));
});
