import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import flashFill from '@iconify/icons-eva/github-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@material-ui/core';
//
import { varFadeIn, varFadeInUp, varWrapEnter, varFadeInRight } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left'
  }
}));

const HeroOverlayStyle = styled(motion.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh'
  }
}));

// ----------------------------------------------------------------------

export default function LandingHero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" variants={varFadeIn} />

        <HeroImgStyle alt="hero" src="/static/home/hero.png" variants={varFadeInUp} />

        <Container maxWidth="lg">
          <ContentStyle>
            <motion.div variants={varFadeInRight}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Xem phim <br />
                chi???u r???p <br /> c??ng
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  &nbsp;Movie New
                </Typography>
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Typography sx={{ color: 'common.white' }}>
                ?????t ngay v?? xem c??c b??? phim r???p ??ang chi???u t???i Vi???t Nam
              </Typography>
            </motion.div>

            <Stack
              component={motion.div}
              variants={varFadeInRight}
              direction="row"
              spacing={1}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <img alt="sketch icon" src="/static/home/ic_sketch_small.svg" width={20} height={20} />
              <Link
                underline="always"
                href="#"
                target="_blank"
                sx={{ color: 'common.white' }}
              >
                M???t s???n ph???m c???a m??n CSDL
              </Link>
            </Stack>

            <motion.div variants={varFadeInRight}>
              <Stack direction="row" spacing={1} sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  size="large"
                  variant="contained"
                  component="a"
                  href="https://github.com/zennomi/movie-new-react"
                  startIcon={<Icon icon={flashFill} width={20} height={20} />}
                >
                  Frontend
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  component="a"
                  href="https://github.com/ngtuan092/r-p-xi-c"
                  startIcon={<Icon icon={flashFill} width={20} height={20} />}
                >
                  Backend
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  component="a"
                  href="https://github.com/huyhoan1109/movie-new-database"
                  startIcon={<Icon icon={flashFill} width={20} height={20} />}
                >
                  Database
                </Button>
              </Stack>
            </motion.div>

            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <motion.img variants={varFadeInRight} src="/static/home/ic_material.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/ic_react.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/ic_js.svg" />
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
