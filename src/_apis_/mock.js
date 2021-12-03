import AxiosMockAdapter from 'axios-mock-adapter-path-params';
// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------
const routeParams = {
  ":maphim": "\\d?"
}

const axiosMockAdapter = new AxiosMockAdapter(axios, {
  delayResponse: 0
}, routeParams);

export default axiosMockAdapter;