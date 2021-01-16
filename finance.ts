/**
 * @class Finance
 */
export class Finance {
    /**
     * Present Value (PV)
     * The current worth of a future sum of money or stream of cash flows given a specified rate of return
     * @param rate
     * @param cashFlow
     * @param numOfPeriod
     */
    public PV(rate: number, cashFlow: number, numOfPeriod?: number): number {
      numOfPeriod = typeof numOfPeriod !== "undefined" ? numOfPeriod : 1;
      rate = rate / 100;
      const pv = cashFlow / Math.pow(1 + rate, numOfPeriod);
      return Math.round(pv * 100) / 100;
    }
  
    /**
     * Future Value (FV)
     * The value of an asset or cash at a specified date in the future that is equivalent in value to a specified sum today
     * @param rate
     * @param cashFlow
     * @param numOfPeriod
     */
    public FV(rate: number, cashFlow: number, numOfPeriod: number): number {
      rate = rate / 100;
      const fv = cashFlow * Math.pow(1 + rate, numOfPeriod);
      return Math.round(fv * 100) / 100;
    }
  
    /**
     * Net Present Value (NPV)
     * Compares the money received in the future to an amount of money received today, while accounting for time and interest [through the discount rate].
     * It's based on the principal of time value of money (TVM), which explains how time affects monetary value
     * @param rate
     * @param initialInvestment
     * @param cashFlows
     */
    public NPV(
      rate: number,
      initialInvestment: number,
      cashFlows: number[]
    ): number {
      rate = rate / 100;
      let npv = initialInvestment;
      for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
      }
      return Math.round(npv * 100) / 100;
    }
  
    /**
     * Internal Rate of Return (IRR)
     * The discount rate often used in capital budgeting that makes the net present value of all cash flows from a particular project equal to zero
     * @param cfs
     * @param cashFlows
     */
    public IRR(cfs: number, cashFlows: number[]): number {
      let numberOfTries = 1;
      // Cash flow values must contain at least one positive value and one negative value
      let positive, negative;
      cashFlows.forEach(function (value) {
        if (value > 0) positive = true;
        if (value < 0) negative = true;
      });
      if (!positive || !negative) {
        throw new Error(
          "IRR requires at least one positive value and one negative value",
        );
      }
      const npv = (rate: number): any => {
        numberOfTries++;
        if (numberOfTries > cfs) {
          throw new Error("IRR can't find a result");
        }
        const rrate = 1 + rate / 100;
        let npv = cashFlows[0];
        for (var i = 1; i < cashFlows.length; i++) {
          npv += cashFlows[i] / Math.pow(rrate, i);
        }
        return npv;
      };
      return Math.round(this.seekZero(npv) * 100) / 100;
    }
  
    /**
     * Extended Internal Rate of Return (XIRR)
     * The return on investments where there are multiple transactions happening at different times
     * @param cashFlows
     * @param dates
     * @param guess
     */
    public XIRR(cashFlows: number[], dates: Date[], guess: number): any {
      if (cashFlows.length != dates.length) {
        throw new Error("Number of cash flows and dates should match");
      }
      let positive, negative;
      Array.prototype.slice.call(cashFlows).forEach(function (value) {
        if (value > 0) positive = true;
        if (value < 0) negative = true;
      });
  
      if (!positive || !negative) {
        throw new Error(
          "XIRR requires at least one positive value and one negative value",
        );
      }
  
      guess = !!guess ? guess : 0;
  
      let limit = 100; //loop limit
      let guess_last;
      const durs = [];
  
      durs.push(0);
  
      //Create Array of durations from First date
      for (let i = 1; i < dates.length; i++) {
        durs.push(this.durYear(dates[0], dates[i]));
      }
  
      do {
        guess_last = guess;
        guess = guess_last - this.sumEq(cashFlows, durs, guess_last);
        limit--;
      } while (guess_last.toFixed(5) != guess.toFixed(5) && limit > 0);
  
      const xirr = guess_last.toFixed(5) != guess.toFixed(5) ? null : guess * 100;
  
      return xirr !== null ? Math.round(xirr * 100) / 100 : null;
    }
  
    /**
     * Payback Period (PP)
     * The length of time required to recover the cost of an investment
     * @param numOfPeriods
     * @param cashFlows
     */
    public PP(numOfPeriods: number, cashFlows: number[]): any {
      // for even cash flows
      if (numOfPeriods === 0) {
        return Math.abs(cashFlows[0]) / cashFlows[1];
      }
      // for uneven cash flows
      let cumulativeCashFlow = cashFlows[0];
      let yearsCounter = 1;
      for (let i = 1; i < cashFlows.length; i++) {
        cumulativeCashFlow += cashFlows[i];
        if (cumulativeCashFlow > 0) {
          yearsCounter += (cumulativeCashFlow - cashFlows[i]) / cashFlows[i];
          return yearsCounter;
        } else {
          yearsCounter++;
        }
      }
    }
  
    /**
     * Return on Investment (ROI)
     * A simple calculation that tells you the bottom line return of any investment
     * @param initialInvestment
     * @param earnings
     */
    public ROI(initialInvestment: number, earnings: number): number {
      const roi =
        ((earnings - Math.abs(initialInvestment)) / Math.abs(initialInvestment)) *
        100;
      return Math.round(roi * 100) / 100;
    }
  
    /**
     * Amortization (AM)
     * The paying off of debt with a fixed repayment schedule in regular installments over a period of time
     * @param principal
     * @param rate
     * @param period
     * @param yearOrMonth
     * @param payAtBeginning
     */
    public AM(
      principal: number,
      rate: number,
      period: number,
      yearOrMonth: 0 | 1,
      payAtBeginning?: boolean,
    ): number {
      let numerator, denominator;
      const ratePerPeriod = rate / 12 / 100;
      const buildNumerator = (numInterestAccruals: number) => {
        if (payAtBeginning) {
          //if payments are made in the beginning of the period, then interest shouldn't be calculated for first period
          numInterestAccruals -= 1;
        }
        return ratePerPeriod * Math.pow(1 + ratePerPeriod, numInterestAccruals);
      };
      // for inputs in years
      if (yearOrMonth === 0) {
        numerator = buildNumerator(period * 12);
        denominator = Math.pow(1 + ratePerPeriod, period * 12) - 1;
  
        // for inputs in months
      } else if (yearOrMonth === 1) {
        numerator = buildNumerator(period);
        denominator = Math.pow(1 + ratePerPeriod, period) - 1;
      } else {
        throw new Error("Value not provided for yearOrMonth");
      }
      const am = principal * (numerator / denominator);
      return Math.round(am * 100) / 100;
    }
  
    /**
     * Profitability Index (PI)
     * An index that attempts to identify the relationship between the costs and benefits of a proposed project through the use of a ratio calculated
     * @param rate
     * @param initialInvestment
     * @param cashFlows
     */
    public PI(
      rate: number,
      initialInvestment: number,
      cashFlows: number[]
    ): number {
      let totalOfPVs = 0;
      for (let i = 0; i < cashFlows.length; i++) {
        // calculate discount factor
        const discountFactor = 1 / Math.pow(1 + rate / 100, i + 1);
        totalOfPVs += cashFlows[i] * discountFactor;
      }
      const PI = totalOfPVs / Math.abs(initialInvestment);
      return Math.round(PI * 100) / 100;
    }
  
    /**
     * Discount Factor (DF)
     * The factor by which a future cash flow must be multiplied in order to obtain the present value
     * @param rate
     * @param numOfPeriods
     */
    public DF(rate: number, numOfPeriods: number): number[] {
      const dfs: number[] = [];
      for (var i = 1; i < numOfPeriods; i++) {
        const discountFactor = 1 / Math.pow(1 + rate / 100, i - 1);
        const roundedDiscountFactor = Math.ceil(discountFactor * 1000) / 1000;
        dfs.push(roundedDiscountFactor);
      }
      return dfs;
    }
  
    /**
     * Compound Interest (CI)
     * The interest calculated on the initial principal and also on the accumulated interest of previous periods of a deposit or loan
     * @param rate
     * @param numOfCompoundings
     * @param principal
     * @param numOfPeriods
     */
    public CI(
      rate: number,
      numOfCompoundings: number,
      principal: number,
      numOfPeriods: number,
    ): number {
      const CI = principal *
        Math.pow(
          1 + rate / 100 / numOfCompoundings,
          numOfCompoundings * numOfPeriods,
        );
      return Math.round(CI * 100) / 100;
    }
  
    /**
     * Compound Annual Growth Rate (CAGR)
     * The year-over-year growth rate of an investment over a specified period of time
     * @param beginningValue
     * @param endingValue
     * @param numOfPeriods
     */
    public CAGR(
      beginningValue: number,
      endingValue: number,
      numOfPeriods: number,
    ): number {
      const CAGR = Math.pow(endingValue / beginningValue, 1 / numOfPeriods) - 1;
      return Math.round(CAGR * 10000) / 100;
    }
  
    /**
     * Leverage Ratio (LR)
     * Used to calculate the financial leverage of a company or individual to get an idea of the methods of financing or to measure ability to meet financial obligations
     * @param totalLiabilities
     * @param totalDebts
     * @param totalIncome
     */
    public LR(
      totalLiabilities: number,
      totalDebts: number,
      totalIncome: number,
    ): number {
      return (totalLiabilities + totalDebts) / totalIncome;
    }
  
    /**
     * Rule of 72 (R72)
     * A rule stating that in order to find the number of years required to double your money at a given interest rate, you divide the compound return into 72
     * @param rate
     */
    public R72(rate: number): number {
      return 72 / rate;
    }
  
    /**
     * Weighted Average Cost of Capital (WACC)
     * The rate that a company is expected to pay on average to all its security holders to finance its assets
     * @param marketValueOfEquity
     * @param marketValueOfDebt
     * @param costOfEquity
     * @param costOfDebt
     * @param taxRate
     */
    public WACC(
      marketValueOfEquity: number,
      marketValueOfDebt: number,
      costOfEquity: number,
      costOfDebt: number,
      taxRate: number,
    ): number {
      const E = marketValueOfEquity;
      const D = marketValueOfDebt;
      const V = marketValueOfEquity + marketValueOfDebt;
      const Re = costOfEquity;
      const Rd = costOfDebt;
      const T = taxRate;
  
      const WACC = ((E / V) * Re) / 100 + (((D / V) * Rd) / 100) * (1 - T / 100);
      return Math.round(WACC * 1000) / 10;
    }
  
    /**
     * Loan Payment Per Period (PMT)
     * Payment for a loan based on constant payments and a constant interest rate
     * @param fractionalRate
     * @param numOfPayments
     * @param principal
     */
    public PMT(
      fractionalRate: number,
      numOfPayments: number,
      principal: number,
    ): number {
      const rate = fractionalRate / 100;
      const pmt = -(principal * rate) / (1 - Math.pow(1 + rate, -numOfPayments));
      return Math.round(pmt * 100) / 100;
    }
  
    /**
     * Inflation-adjusted Return (IAR)
     * Measure the return taking into account the time period's inflation rate
     * @param investmentReturn
     * @param inflationRate
     */
    public IAR(investmentReturn: number, inflationRate: number): number {
      return 100 * ((1 + investmentReturn) / (1 + inflationRate) - 1);
    }
  
    /**
     * Capital Asset Pricing Model (CAPM)
     * Calculates expected return of an asset
     * @param riskFreeRate
     * @param sensitivity
     * @param expectedReturn
     */
    public CAPM(
      riskFreeRate: number,
      sensitivity: number,
      expectedReturn: number,
    ): number {
      return (
        riskFreeRate / 100 +
        sensitivity * (expectedReturn / 100 - riskFreeRate / 100)
      );
    }
  
    /**
     * Stock PV
     * Value of stock with dividend growing at a constant growth rate to perpetuity.
     * @param g
     * @param ke
     * @param D0
     */
    public stockPV(g: number, ke: number, D0: number): number {
      const valueOfStock = (D0 * (1 + g / 100)) / (ke / 100 - g / 100);
      return Math.round(valueOfStock);
    }
  
    /**
     * Returns Sum of f(x)/f'(x).
     * @param cfs
     * @param durs
     * @param guess
     */
    private sumEq(cfs: number[], durs: number[], guess: number) {
      let sum_fx = 0;
      let sum_fdx = 0;
      for (let i = 0; i < cfs.length; i++) {
        sum_fx = sum_fx + cfs[i] / Math.pow(1 + guess, durs[i]);
      }
      for (let i = 0; i < cfs.length; i++) {
        sum_fdx = sum_fdx + -cfs[i] * durs[i] * Math.pow(1 + guess, -1 - durs[i]);
      }
      return sum_fx / sum_fdx;
    }
  
    /**
     * Returns duration in years between two dates.
     * @param first
     * @param last
     */
    private durYear(first: Date, last: Date) {
      return (
        Math.abs(last.getTime() - first.getTime()) / (1000 * 3600 * 24 * 365)
      );
    }
  
    /**
     * Seeks the zero point of the function fn(x), accurate to within x \pm 0.01. fn(x) must be decreasing with x.
     * @param fn
     */
    private seekZero(fn: (input: number) => number): number {
      let x = 1;
      while (fn(x) > 0) {
        x += 1;
      }
      while (fn(x) < 0) {
        x -= 0.01;
      }
      return x + 0.01;
    }
  }
  