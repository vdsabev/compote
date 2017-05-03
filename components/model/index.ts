export class Model<T> {
  constructor(...data: Partial<T>[]) {
    data.forEach((item) => {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          (<any>this)[key] = (<any>item)[key];
        }
      }
    });
  }
}
