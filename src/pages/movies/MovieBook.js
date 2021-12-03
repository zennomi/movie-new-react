import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import {
	Box, Card, Chip, Button, Divider, Typography, CardContent,
	Container, Link, Fab, Grid, Stack, Autocomplete, TextField
} from '@material-ui/core';
import { DesktopDatePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import EventIcon from '@material-ui/icons/Event';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CancelIcon from '@material-ui/icons/Cancel';
// components
import Page from "../../components/Page";
import MFab from "../../components/@material-extend/MFab";

// axios
import axios from "../../utils/axios";

// utils
import mockData from '../../utils/mock-data';
import { fDate } from '../../utils/formatTime';

// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';


//
import { varFadeInUp, MotionInView, varFadeInDown } from '../../components/animate';
import Label from '../../components/Label';


const RootStyle = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	position: 'relative',
	paddingTop: theme.spacing(15),
	[theme.breakpoints.up('md')]: {
		paddingBottom: theme.spacing(15)
	}
}));

const MOCK_MOVIES = [...Array(8)].map((_, index) => ({
	id: mockData.id(index),
	title: mockData.text.title(index),
	image: mockData.image.feed(index),
	short: mockData.role(index),
	description: mockData.text.description(index),
}));

const MOCK_SLOTS = [...Array(8)].map((_, index) => ({
	id: mockData.id(index),
	title: mockData.text.title(index),
	image: mockData.image.feed(index),
	short: mockData.role(index),
	description: mockData.text.description(index),
}));

const ROWS = 10;
const COLS = 10;
const FILLED_SLOTS = [
	[true, false, true, false, true, false, false, true, false, true],
	[true, false, true, true, false, false, true, false, true, false],
	[true, false, true, false, false, true, true, false, true, false],
	[true, true, false, false, true, false, true, false, true, false],
	[true, false, true, false, false, true, true, false, true, false],
	[true, false, true, false, false, true, true, false, true, false],
	[true, false, true, false, true, false, false, true, true, false],
	[true, false, true, false, true, true, false, false, true, false],
	[true, false, true, false, true, false, true, false, false, true],
	[true, false, true, false, true, false, true, false, false, true],
	[true, false, true, false, true, false, true, false, false, true],
	[true, false, true, false, true, true, false, false, true, false],
]

export default function MovieBook() {
	const location = useLocation();
	const isMountedRef = useIsMountedRef();

	const maphim = Number(new URLSearchParams(location.search).get("maphim"));

	const [movie, setMovie] = useState();
	const [movies, setMovies] = useState();
	const [date, setDate] = useState(new Date());
	const [filledSlot, setFilledSlot] = useState([...FILLED_SLOTS]);
	const [tickets, setTickets] = useState([]);

	const handleClickSlot = (r, c) => {
		setFilledSlot((prevFilledSlot) => {
			const newFilledSlot = [...prevFilledSlot];
			newFilledSlot[r][c] = true;
			console.log(newFilledSlot);
			return newFilledSlot;
		});
		setTickets((prevTickets) => [...prevTickets, { movie, r, c }])
	}

	const handleClickRemove = (r, c) => {
		setFilledSlot((prevFilledSlot) => {
			const newFilledSlot = [...prevFilledSlot];
			newFilledSlot[r][c] = false;
			console.log(newFilledSlot);
			return newFilledSlot;
		});
		setTickets((prevTickets) => prevTickets.filter(ticket => !(ticket.r === r && ticket.c === c)));
	}

	const getMovie = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim/${maphim}`);
			if (isMountedRef.current) {
				setMovie(response.data.result);
			}
		} catch (err) {
			//
		}
	}, [isMountedRef]);

	const getMovies = useCallback(async () => {
		try {
			const response = await axios.get(`/api/phim`);
			if (isMountedRef.current) {
				setMovies(response.data.results);
			}
		} catch (err) {
			//
		}
	}, [isMountedRef]);

	useEffect(() => {
		if (maphim != null) getMovie();
	}, [getMovie]);

	useEffect(() => {
		getMovies();
	}, [getMovies]);

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
											onChange={(event, newMovie) => { setMovie(newMovie) }}
											key={movie && movie.ten}
											sx={{ w: 1 }}
										/>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DesktopDatePicker
												label="Ngày"
												inputFormat="dd/MM/yyyy"
												value={date}
												onChange={(newDate) => { setDate(newDate) }}
												renderInput={(params) => <TextField {...params} />}
												sx={{ w: 1 }}
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
											{MOCK_SLOTS.map(slot =>
											(
												<>
													<Divider />
													<Grid container spacing={1}>
														<Grid item>
															<Chip color="primary" icon={<EventIcon />} label={fDate(date)} size="small" />
														</Grid>

														<Grid item>
															<Chip icon={<QueryBuilderIcon />} label="18h00" size="small" />
														</Grid>
														<Grid item>
															<Chip icon={<HourglassEmptyIcon />} label="01h34m" size="small" />
														</Grid>
													</Grid>
													<Grid container spacing={1}>
														<Grid item xs={2}>
															<img
																src={slot.image}
																alt="Live from space album cover"
																style={{ width: '100%' }}
															/>
														</Grid>
														<Grid item xs={10}>
															<Typography>
																{slot.title}
															</Typography>
														</Grid>
													</Grid>
												</>
											))}
										</Stack>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={8}>
								<Card sx={{ marginBottom: 2 }}>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h5" sx={{ color: 'primary.main' }}>
												Các suất chiếu
											</Typography>
											<Box>
												<Stack spacing={1}>
													<Card sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 'bold' }}>
														<CardContent>
															Màn hình
														</CardContent>
													</Card>
													{
														[...Array(ROWS)].map((_, i) =>
															<Grid container spacing={1} key={i}>
																{[...Array(COLS)].map((_, j) =>
																	<Grid item key={j} xs={12 / COLS}>
																		<Button
																			sx={{ minWidth: 0, width: 1 }}
																			variant="contained"
																			color={filledSlot[i][j] ? "primary" : "inherit"}
																			onClick={() => { handleClickSlot(i, j) }}
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
												tickets.map(ticket =>
													<Card>
														<CardContent>
															<Box sx={{
																display: 'flex', p: 1, bgcolor: 'background.paper'
															}} >
																<Box sx={{ flexGrow: 1 }}>
																	<Typography>
																		{ticket.movie.title}
																	</Typography>
																	<Chip label={`Hàng ${ticket.r}`} />
																	<Chip label={`Cột ${ticket.c}`} />
																</Box>
																<Box>
																	<MFab
																		color="error"
																		onClick={() => { handleClickRemove(ticket.r, ticket.c) }}
																		size="small"
																	>
																		<CancelIcon />
																	</MFab>
																</Box>
															</Box>
														</CardContent>
													</Card>
												)
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