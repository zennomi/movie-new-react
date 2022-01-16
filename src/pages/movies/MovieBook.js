import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import {
	Box, Card, Chip, Button, Divider, Typography, CardContent,
	Container, Grid, Stack, Autocomplete, TextField
} from '@material-ui/core';
import { StaticDatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import EventIcon from '@material-ui/icons/Event';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CancelIcon from '@material-ui/icons/Cancel';
// components
import Page from "../../components/Page";
import MFab from "../../components/@material-extend/MFab";
import Scrollbar from '../../components/Scrollbar';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addTicket, removeTicket } from '../../redux/slices/ticket';
// axios
import axios from "../../utils/axios";

// utils
import { fDate } from '../../utils/formatTime';
import { fAmountTime } from '../../utils/formatNumber';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../../components/animate';

const RootStyle = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	position: 'relative',
	paddingTop: theme.spacing(15),
	[theme.breakpoints.up('md')]: {
		paddingBottom: theme.spacing(15)
	}
}));

export default function MovieBook() {
	const [searchParams, setSearchParams] = useSearchParams();
	const maphim = Number(searchParams.get("maphim"));
	const isMountedRef = useIsMountedRef();
	const dispatch = useDispatch();

	const [movie, setMovie] = useState();
	const [movies, setMovies] = useState();
	const [date, setDate] = useState(new Date());
	const [showtimes, setShowtimes] = useState([]);
	const [showtime, setShowtime] = useState({});
	const [filledSlots, setFilledSlots] = useState([[]]);

	const { tickets } = useSelector((state) => state.ticket);

	const handleClickSlot = (showtimeId, r, c) => {
		dispatch(addTicket({ showtimeId, r, c }))
		setFilledSlots(slots => {
			slots[r][c] = true;
			return [...slots];
		})
	}

	const handleClickRemove = (showtimeId, r, c) => {
		dispatch(removeTicket({ showtimeId, r, c }))
		if (showtime.ma && showtimeId.toString() === showtime.ma.toString()) {
			setFilledSlots(slots => {
				slots[r][c] = false;
				return [...slots];
			})
		}
	}

	const getMovie = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim/${maphim}`);
			if (isMountedRef.current) {
				setMovie(response.data.result);
			}
		} catch (err) {
			console.log(err);
		}
	}, [isMountedRef, maphim]);

	const getMovies = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim`);
			if (isMountedRef.current) {
				setMovies(response.data.results);
			}
		} catch (err) {
			console.log(err);
		}
	}, [isMountedRef]);

	const getShowtimes = async () => {
		try {
			const response = await axios.get(`/api/suat-chieu`, { params: { maphim: maphim || undefined, ngay: fDate(date) } });
			setShowtimes(response.data.results);
		} catch (err) {
			console.log(err);
		}
	}

	const getFilledSlots = async () => {
		try {
			const response = await axios.get(`/api/suat-chieu/${showtime.ma}/ghe`);
			const { results } = response.data;
			if (tickets[showtime.ma]) {
				tickets[showtime.ma].forEach(({ r, c }) => {
					results[r][c] = true;
				})
			}
			setFilledSlots(response.data.results);
		} catch (err) {
			//
		}
	}

	useEffect(() => {
		if (maphim != null) getMovie();
	}, [getMovie]);

	useEffect(() => {
		getMovies();
	}, [getMovies]);

	useEffect(() => {
		if (!maphim && !date) return;
		getShowtimes();
		return () => setShowtimes([]);
	}, [maphim, date]);

	useEffect(() => {
		if (!showtime) return;
		getFilledSlots();
		return () => setFilledSlots([]);
	}, [showtime]);

	return (
		<Page title="Đặt vé">
			<RootStyle>
				<Container maxWidth="lg">
					<Box sx={{ mb: { xs: 5, md: 10 } }}>
						<MotionInView variants={varFadeInUp}>
							<Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
								Đặt vé
							</Typography>
						</MotionInView>
						<MotionInView variants={varFadeInDown}>
							<Typography variant="h2" sx={{ textAlign: 'center' }}>
								Chọn lịch phim và thanh toán~
							</Typography>
						</MotionInView>
					</Box>
					<Box>
						<Grid container spacing={1}>
							<Grid item xs={12} md={4}>
								<Card sx={{ overflow: 'visible', marginBottom: 2 }}><CardContent>

									<Stack spacing={2}>
										<Typography variant="h5" sx={{ color: 'primary.main' }}>
											Chọn phim và ngày
										</Typography>
										<Autocomplete
											options={movies || []}
											getOptionLabel={option => option.ten}
											isOptionEqualToValue={(option, value) => option.ten === value.ten}
											renderInput={(params) => <TextField {...params} label="Phim" />}
											value={movie}
											onChange={(event, newMovie, reason) => {
												if (reason === 'clear') {
													console.log("clear1");
													setMovie({ ma: null, ten: '' });
													setSearchParams({});
												} else {
													setMovie(newMovie);
													setSearchParams({ maphim: newMovie.ma })
												}
											}}
											key={movie && movie.ten}
											sx={{ w: 1 }}
										/>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<StaticDatePicker
												displayStaticWrapperAs="desktop"
												clearable="true"
												label="Ngày"
												inputFormat="dd/MM/yyyy"
												value={date}
												onChange={(newDate) => { setDate(newDate) }}
												renderInput={(params) => <TextField {...params} />}
												sx={{ w: 1 }}
												disablePast
												disableMaskedInput
											/>
										</LocalizationProvider>
									</Stack>
								</CardContent></Card>
								<Card>
									<CardContent>
										<Stack spacing={1}>
											<Typography variant="h5" sx={{ color: 'primary.main' }}>
												Các suất chiếu
											</Typography>
											<Scrollbar
											sx={{
												height: '500px',
												p: 1
											  }}
											>
												{showtimes.map(s => (
													<Box key={s.ma}>
														<Divider />
														<Grid
															container
															spacing={1}
															style={{ cursor: 'pointer' }}
															sx={{ bgcolor: s.ma === showtime?.ma ? 'primary.main' : '', borderRadius: 1, p: 1 }}
															onClick={() => { setShowtime(s) }}
														>
															<Grid item xs={2}>
																<Card sx={{ borderRadius: 0.5 }}>
																	<img
																		src={s.phim.bia}
																		alt={s.phim.ten}
																	/>
																</Card>
															</Grid>
															<Grid item xs={10}>
																<Typography>
																	{s.phim.ten}
																</Typography>
																<Grid item container spacing={1}>
																	<Grid item>
																		<Chip color="primary" variant={s.ma === showtime?.ma ? "filled" : "outlined"} icon={<EventIcon />} label={`${s.ngay} ${s.ca}`} size="small" />
																	</Grid>
																	<Grid item>
																		<Chip color="primary" variant={s.ma === showtime?.ma ? "filled " : "outlined"} icon={<HourglassEmptyIcon />} label={fAmountTime(s.phim.thoigian)} size="small" />
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
													</Box>
												))}
											</Scrollbar>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={8}>
								<Card sx={{ marginBottom: 2 }}>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h5" sx={{ color: 'primary.main' }}>
												Phòng phim
											</Typography>
											<Box>
												<Stack spacing={1}>
													<Card sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 'bold', textAlign: 'center' }}>
														<CardContent>
															Màn hình
														</CardContent>
													</Card>
													{
														showtime && filledSlots &&
														filledSlots.map((x, i) =>
															<Grid container spacing={1} key={i}>
																{x.map((y, j) =>
																	<Grid item key={j} xs={12 / x.length}>
																		<Button
																			sx={{ minWidth: 0, width: 1, fontSize: 10 }}
																			variant="contained"
																			color={y ? "primary" : "inherit"}
																			onClick={() => { if (!y) handleClickSlot(showtime.ma, i, j) }}
																		>
																			{`${i + 1}-${j + 1}`}
																		</Button>
																	</Grid>
																)

																}
															</Grid>
														)
													}
												</Stack>
											</Box>
										</Stack>
									</CardContent>
								</Card>
								<Card>

									<CardContent>
										<Typography variant="h5" sx={{ color: 'primary.main' }}>
											Vé đã đặt
										</Typography>
										<Stack spacing={1}>
											{
												Object.keys(tickets).map(key =>
													tickets[key].map(ticket =>
														<Card>
															<CardContent>
																<Box sx={{
																	display: 'flex', p: 1, bgcolor: 'background.paper'
																}} >
																	<Box sx={{ flexGrow: 1 }}>
																		<Typography>
																			{key}
																		</Typography>
																		<Chip label={`Hàng ${ticket.r + 1}`} />
																		<Chip label={`Cột ${ticket.c + 1}`} />
																	</Box>
																	<Box>
																		<MFab
																			color="error"
																			onClick={() => { handleClickRemove(key, ticket.r, ticket.c) }}
																			size="small"
																		>
																			<CancelIcon />
																		</MFab>
																	</Box>
																</Box>
															</CardContent>
														</Card>
													))
											}
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</RootStyle>
		</Page >
	)
}