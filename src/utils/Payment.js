export class Payment {
  constructor({ id = null, groupId, from, to, amount, date, status = 'pending', comment = '' }) {
    this.id = id;             
    this.groupId = groupId;   
    this.from = from; 
    this.to = to;  
    this.amount = amount;
    this.date = date;  
    this.status = status;
    this.comment = comment;
  }
}
