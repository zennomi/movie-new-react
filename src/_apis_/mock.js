import AxiosMockAdapter from 'axios-mock-adapter-path-params';
// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------
const routeParams = {
  ":maphim": "[0-9]{1,8}",
  ":masuatchieu": "[0-9]{1,8}",
  ":mahoadon": "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}",
}

const axiosMockAdapter = new AxiosMockAdapter(axios, {
  delayResponse: 200
}, routeParams);

export default axiosMockAdapter;
