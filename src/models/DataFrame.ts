// TODO Especify interface for the data here.
interface DataInterface extends BasicData {
  host: string;
  title: string;
}

/**
 * Sends a message to backgroundScript.
 *
 * Can receive a list of objects or a single object.
 */
export class DataFrame {
  data: Array<DataInterface | null>;
  header: Array<string>;

  constructor(input?: Array<DataInterface>) {
    // TODO specify columns
    this.header = ['host', 'title'];
    if (input) {
      this.data = input;
    } else {
      this.data = [];
    }
  }

  static from(json: { data: Array<DataInterface | null>; header: Array<string> }) {
    return Object.assign(new DataFrame(), json);
  }

  get values() {
    return this.hasData ? this.data.map((entry) => this.toArray(entry!)) : [];
  }

  get hasData() {
    return this.data ? this.data.length > 0 : false;
  }

  toArray(obj: DataInterface) {
    let arr: Array<string> = [];

    this.header.forEach((field) => {
      arr.push(obj[field]);
    });

    return arr;
  }
}

interface BasicData {
  [index: string]: string;
}
