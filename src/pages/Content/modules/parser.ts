import { DataFrame } from '../../../models/DataFrame';

/**
 * Parse data in page context.
 * @returns DataFrame element.
 */
export function parserIt() {
  // TODO Define data scraping here.
  let data = { host: document.location.host, title: document.title };
  return new DataFrame([data]);
}
