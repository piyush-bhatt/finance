import { assertEquals } from "./test_deps.ts";
import { Finance } from "./mod.ts";

const cal = new Finance();

Deno.test("should compute PV", () => {
  assertEquals(cal.PV(5, 100), 95.24);
});

Deno.test("should compute PV with num of periods", () => {
  // 1st argument is rate; the 2nd argument is the cash flow
  assertEquals(cal.PV(5, 100, 5), 78.35);
});

Deno.test("should compute FV", () => {
  assertEquals(cal.FV(0.5, 1000, 12), 1061.68);
});

Deno.test("should compute NPV", () => {
  assertEquals(cal.NPV(10, -500000, [200000, 300000, 200000]), 80015.03);
});

Deno.test("should compute IRR", () => {
  const irr = cal.IRR(10000, [-6, 297, 307]);
  assertEquals(4951 <= irr && irr <= 4952, true);
});

Deno.test("should compute PP for even cash flows", () => {
  assertEquals(cal.PP(0, [-105, 25]), 4.2);
});

Deno.test("should compute PP for uneven cash flows", () => {
  const pp = cal.PP(5, [-50, 10, 13, 16, 19, 22]);
  assertEquals(3.3 <= pp && pp <= 3.6, true);
});

Deno.test("should compute ROI", () => {
  assertEquals(cal.ROI(-55000, 60000), 9.09);
});

Deno.test("should compute AM (Amortization) for inputs in years", () => {
  // 0 if inputs are in years
  assertEquals(cal.AM(20000, 7.5, 5, 0), 400.76);
});

Deno.test("should compute AM (Amortization) for inputs in months", () => {
  // 1 if inputs are in months
  assertEquals(cal.AM(20000, 7.5, 60, 1), 400.76);
});

Deno.test(
  "should compute AM (Amortization) for inputs in years when payment is at the beginning of the month",
  () => {
    // 1 if inputs are in months
    assertEquals(cal.AM(20000, 7.5, 5, 0, true), 398.27);
  },
);

Deno.test(
  "should compute AM (Amortization) for inputs in months when payment is at the beginning of the month",
  () => {
    // 1 if inputs are in months
    assertEquals(cal.AM(20000, 7.5, 60, 1, true), 398.27);
  },
);

Deno.test("should compute PI", () => {
  // rate, initial investment, and cash flows
  assertEquals(cal.PI(10, -40000, [18000, 12000, 10000, 9000, 6000]), 1.09);
});

Deno.test("should compute DF", () => {
  // rate and number of periods
  assertEquals(cal.DF(10, 6), [1, 0.91, 0.827, 0.752, 0.684]);
});

Deno.test("should compute CI", () => {
  // rate, compoundings per period, principal , and number of periods
  assertEquals(cal.CI(4.3, 4, 1500, 6), 1938.84);
});

Deno.test("should compute CAGR", () => {
  // begining value, Ending value, and number of periods
  assertEquals(cal.CAGR(10000, 19500, 3), 24.93);
});

Deno.test("should compute LR", () => {
  // total liabilities, total debts, and total income. Result is a ratio
  assertEquals(cal.LR(25, 10, 20), 1.75);
});

Deno.test("should compute CC", () => {
  // balance, monthly payment, daily interest rate
  assertEquals(cal.LR(25, 10, 20), 1.75);
});

Deno.test("should compute R72", () => {
  // interest rate
  assertEquals(cal.R72(10), 7.2);
});

Deno.test("should compute WACC", () => {
  // market value of equity, market value of debt, cost of equity, cost of debt, tax rate
  assertEquals(cal.WACC(600000, 400000, 6, 5, 35), 4.9);
});

Deno.test("should compute PMT", () => {
  // rate, number of payments, loan principal
  assertEquals(Number(cal.PMT(2, 36, -1000000).toFixed(2)), 39232.85);
});

//investment return, inflation rate
Deno.test("should compute IAR", () => {
  assertEquals(cal.IAR(0.08, 0.03), 4.854368932038833);
});

Deno.test("should compute XIRR", () => {
  assertEquals(
    cal.XIRR(
      [-1000, -100, 1200],
      [new Date(2015, 11, 1), new Date(2016, 7, 1), new Date(2016, 7, 19)],
      0,
    ),
    14.11,
  );
});

Deno.test("should compute CAPM", () => {
  assertEquals(cal.CAPM(2, 2, 10), 0.18);
});

Deno.test("should compute stockPV", () => {
  assertEquals(cal.stockPV(5, 15, 10), 105);
});
