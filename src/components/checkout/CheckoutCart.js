import { useEffect, useState, useCallback } from 'react';
import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
    removeTicket,
    onNextStep,
    applyDiscount,
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

// ----------------------------------------------------------------------

export default function CheckoutCart() {
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();

    const [detailedTickets, setTickets] = useState([]);
    const { checkout, total, tickets } = useSelector((state) => state.ticket);
    const { cart, discount, subtotal } = checkout;
    const isEmptyCart = total === 0;

    const handleRemoveTicket = (ticket) => {
        dispatch(removeTicket(ticket));
    };

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const handleApplyDiscount = (value) => {
        dispatch(applyDiscount(value));
    };

    // const formik = useFormik({
    //     enableReinitialize: true,
    //     initialValues: { products: cart },
    //     onSubmit: async (values, { setErrors, setSubmitting }) => {
    //         try {
    //             setSubmitting(true);
    //             handleNextStep();
    //         } catch (error) {
    //             console.error(error);
    //             setErrors(error.message);
    //         }
    //     }
    // });

    // const { values, handleSubmit } = formik;

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.post(`/api/ve`, tickets);
            if (isMountedRef.current) {
                setTickets(response.data.results);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef, tickets]);

    useEffect(() => {
        getTickets();
    }, [getTickets])


    return (

        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Card
                                <Typography component="span" sx={{ color: 'text.secondary' }}>
                                    &nbsp;({total} item)
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
                            />
                        </Scrollbar>
                    ) : (
                        <EmptyContent
                            title="Cart is empty"
                            description="Look like you have no items in your shopping cart."
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
                    Continue Shopping
                </Button>
            </Grid>

            <Grid item xs={12} md={4}>
                <CheckoutSummary
                    total={total}
                    enableDiscount
                    discount={discount}
                    subtotal={subtotal}
                    onApplyDiscount={handleApplyDiscount}
                />
                <Button fullWidth size="large" type="submit" variant="contained" disabled={total === 0}>
                    Check Out
                </Button>
            </Grid>
        </Grid>

    );
}
