import AxiosMockAdapter from 'axios-mock-adapter-path-params';
// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------
const routeParams = {
  ":maphim": "\\d?",
  ":masuatchieu": "\\d?",
  ":mahoadon": "\\d?",
}

const axiosMockAdapter = new AxiosMockAdapter(axios, {
  delayResponse: 200
}, routeParams);

export default axiosMockAdapter;
