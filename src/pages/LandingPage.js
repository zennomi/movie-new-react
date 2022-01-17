// material
import { styled } from '@material-ui/core/styles';
// components
import Page from '../components/Page';
import {
  LandingHero,
  LandingHotMovie,
  LandingGenreMovie,
  LandingInComingMovie,

} from '../components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <RootStyle title="Movie New - Đặt vé xem phim online" id="move_top">
      <LandingHero />
      <ContentStyle>
        <LandingHotMovie />
        <LandingInComingMovie />
        <LandingGenreMovie />
      </ContentStyle>
    </RootStyle>
  );
}
