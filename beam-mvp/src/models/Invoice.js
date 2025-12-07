export default class Invoice {
  constructor({
    id,
    invoiceNumber,
    patientId,
    patientName,
    serviceDate,
    dueDate,
    createdAt,
    amount,
    balance,
    paidAmount,
    status,
    claimType,
    payerName,
    payerId,
    cptCodes,
    icdCodes,
    description
  }) {
    this.id = id;
    this.invoiceNumber = invoiceNumber;
    this.patientId = patientId;
    this.patientName = patientName;
    this.serviceDate = serviceDate;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.amount = amount;
    this.balance = balance;
    this.paidAmount = paidAmount || 0;
    this.status = status; // draft, pending, submitted, paid, partial, denied, appealed
    this.claimType = claimType; // medical, dental, vision
    this.payerName = payerName;
    this.payerId = payerId;
    this.cptCodes = cptCodes || [];
    this.icdCodes = icdCodes || [];
    this.description = description;
  }
}
