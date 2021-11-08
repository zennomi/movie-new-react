import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileFill from '@iconify/icons-eva/file-fill';
// routes


// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: <Icon icon={homeFill} {...ICON_SIZE} />
  },
  { title: 'Phim đang chiếu', 
  path: '/movies', 
  icon: <Icon icon={fileFill} {...ICON_SIZE} /> },
  { title: 'Phim sắp chiếu', 
  path: '/movies/coming-soon', 
  icon: <Icon icon={fileFill} {...ICON_SIZE} /> }
];

export default menuConfig;
