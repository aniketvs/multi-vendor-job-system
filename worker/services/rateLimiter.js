class CentralRateLimiter {
 constructor(limit, intervalMs) {
    this.limit = limit;          // max units per interval
    this.tokens = limit;
    this.intervalMs = intervalMs;

    setInterval(() => {
      this.tokens = this.limit;
    }, this.intervalMs);
  }

  async acquire(weight = 1) {
    console.log("tokens",this.tokens);
    while (this.tokens < weight) {
      await new Promise(res => setTimeout(res, 100));
    }
    this.tokens -= weight;

  }
}

module.exports = CentralRateLimiter;
