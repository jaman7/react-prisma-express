import { createSearchParams } from 'react-router-dom';
import * as moment from 'moment';

export function preparedHttpParamsValue(value: any): string {
  if (value instanceof String) {
    return value.toString();
  }
  if (moment.isMoment(value)) {
    return value.format('DD-MM-YYYY');
  }
  if (value instanceof Date) {
    return moment(value).format('DD-MM-YYYY');
  }
  if (Array.isArray(value)) {
    return value.join('&');
  }

  return value.toString();
}

export function toHttpParams(data: any): URLSearchParams {
  if (!data) {
    return new URLSearchParams();
  }

  return createSearchParams(data);
}
