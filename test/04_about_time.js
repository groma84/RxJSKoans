import { Observable, Scheduler, Subject } from "rxjs/Rx";

QUnit.module("Time");

const __ = "Fill in the blank";

asyncTest("launching an event via a scheduler", () => {
  let received = "";
  const delay = 95; // Fix this value
  Scheduler.async.schedule(() => {
    received = "Finished";
  }, delay);

  setTimeout(() => {
    start();
    equal("Finished", received);
  }, 100);
});

asyncTest("launching an event in the future", () => {
  let received = null;
  const time = 95;
  const people = new Subject();

  people.delay(time).subscribe(x => {
    received = x;
  });
  people.next("Godot");

  setTimeout(() => {
    equal("Godot", received);
    start();
  }, 100);
});

asyncTest("a watched pot", () => {
  let received = "";
  const delay = 200;
  const timeout = 205;
  const timeoutEvent = Observable.of("Tepid");

  Observable.of("Boiling")
    .delay(delay)
    .timeoutWith(timeout, timeoutEvent)
    .subscribe(x => {
      received = x;
    });

  setTimeout(() => {
    equal(received, "Boiling");
    start();
  }, 200);
});

asyncTest("you can place a time limit on how long an event should take", () => {
  const received = [];
  const timeout = 200;
  const timeoutEvent = Observable.of("Tepid");
  const temperatures = new Subject();

  temperatures
    .timeoutWith(timeout, timeoutEvent)
    .subscribe(x => received.push(x));

  temperatures.next("Started");

  setTimeout(() => {
    temperatures.next("Boiling");
  }, 300);

  setTimeout(() => {
    // es kommt "Started" sofort, und nach 200ms timed das ganze Observable aus mit "Tepid".
    // "Boiling" kommt gar nicht mehr zum Zuge, weil es zu spät kommt.
    equal("Started, Tepid", received.join(", "));
    start();
  }, 400);
});

asyncTest("debouncing", () => {
  expect(1);

  const received = [];
  const events = new Subject();
  events.debounceTime(100).subscribe(x => received.push(x));

  events.next("f");
  events.next("fr");
  events.next("fro");
  events.next("from");

  setTimeout(() => {
    events.next("r");
    events.next("rx");
    events.next("rxj");
    events.next("rxjs");

    setTimeout(() => {
      // es kommt jeweils nur das letzte Event an, weil die mit next() sofort aufeinander folgen, und wir ja 100ms abwarten,
      // ob sich noch was tut
      equal("from rxjs", received.join(" "));
      start();
    }, 200);
  }, 200);
});

asyncTest("buffering", () => {
  const received = [];
  const events = new Subject();
  events
    .bufferTime(100)
    .map(c => c.join(""))
    .subscribe(x => received.push(x));

  events.next("R");
  events.next("x");
  events.next("J");
  events.next("S");

  setTimeout(() => {
    events.next("R");
    events.next("o");
    events.next("c");
    events.next("k");
    events.next("s");

    setTimeout(() => {
      // wir sammeln 100ms lang alle Stream Events und geben sie als gesammeltes Array raus: [R, x, J, S] und [R, o, c, k, s]
      equal(received.join(" "), "RxJS Rocks ");
      start();
    }, 200);
  }, 200);
});

asyncTest("time between calls", () => {
  const received = [];
  const events = new Subject();

  events
    .timeInterval()
    .filter(t => t.interval > 100)
    .subscribe(t => {
      received.push(t.value);
    });

  events.next("too");
  events.next("fast");

  setTimeout(() => {
    events.next("slow");

    setTimeout(() => {
      events.next("down");

      equal("slow down", received.join(" "));
      start();
    }, 120);
  }, 120);
});

asyncTest("results can be ambiguous timing", () => {
  let results = 0;
  const first = Observable.timer(10).mapTo(-1);
  const secnd = Observable.timer(20).mapTo(1);

  first.race(secnd).subscribe(x => {
    results = x;
  });

  setTimeout(() => {
    equal(results, -1);
    start();
  }, 300);
});
