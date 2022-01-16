import { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
    removeTicket,
    onNextStep,
} from '../../redux/slices/ticket';

//
import Scrollbar from '../Scrollbar';
import EmptyContent from '../EmptyContent';
import CheckoutSummary from './CheckoutSummary';
import CheckoutTicketList from './CheckoutTicketList';

// axios
import axios from "../../utils/axios";

// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';

// utils
import { ticketObjToArr } from '../../utils/formatTickets'

// ----------------------------------------------------------------------

export default function CheckoutCart() {
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();

    const [detailedTickets, setTickets] = useState([]);
    const { checkout, total, tickets } = useSelector((state) => state.ticket);
    const { activeStep } = checkout;
    const isEmptyCart = total === 0;

    const handleRemoveTicket = (ticket) => {
        dispatch(removeTicket(ticket));
    };

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.post(`/api/ve/chi-tiet`, ticketObjToArr(tickets));
            if (isMountedRef.current) {
                setTickets(response.data.results);
            }
        } catch (err) {
            //
        }

    }, [isMountedRef, tickets]);

    useEffect(() => {
        getTickets();
        return () => setTickets([]);
    }, [getTickets])

    return (

        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Giỏ vé
                                <Typography component="span" sx={{ color: 'text.secondary' }}>
                                    &nbsp;({total} vé)
                                </Typography>
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />

                    {!isEmptyCart ? (
                        <Scrollbar>
                            <CheckoutTicketList
                                detailedTickets={detailedTickets}
                                onDelete={handleRemoveTicket}
                                activeStep={activeStep}
                            />
                        </Scrollbar>
                    ) : (
                        <EmptyContent
                            title="Giỏ vé trống"
                            description="Có vẻ chưa có vé nào trong giỏ."
                            img="/static/illustrations/illustration_empty_cart.svg"
                        />
                    )}
                </Card>

                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/movies/book"
                    startIcon={<Icon icon={arrowIosBackFill} />}
                >
                    Quay lại khu vực mua vé
                </Button>
            </Grid>

            <Grid item xs={12} md={4}>
                <CheckoutSummary
                    total={total}
                    detailedTickets={detailedTickets}
                />
                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={detailedTickets.filter(t => t.trong).length === 0}
                    onClick={() => { handleNextStep() }}
                >
                    Thanh toán
                </Button>
            </Grid>
        </Grid>

    );
}
