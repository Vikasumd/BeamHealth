export default class Insurance {
  constructor({ id, payer, plan, eligible, coPay, reason }) {
    this.id = id;
    this.payer = payer;
    this.plan = plan;
    this.eligible = eligible;
    this.coPay = coPay ?? null;
    this.reason = reason ?? null;
  }
}
