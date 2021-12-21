import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
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
import PaymentMethods from './PaymentMethods';
import CheckoutTicketList from './CheckoutTicketList';

// axios
import axios from "../../utils/axios";

// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();

    const [detailedTickets, setTickets] = useState([]);
    const { checkout, total, tickets } = useSelector((state) => state.ticket);
    const { cart, discount, subtotal, activeStep } = checkout;
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

    const PaymentSchema = Yup.object().shape({

    });

    const formik = useFormik({
        initialValues: {
            method: 'paypal',
            card: 'mastercard',
            newCardName: '',
            newCardNumber: '',
            newCardExpired: '',
            newCardCvv: ''
        },
        validationSchema: PaymentSchema,
        onSubmit: async (values, { resetForm }) => {
            const submitData = {

            };
            if (values.method === 'paypal') {
                alert(
                    JSON.stringify(
                        {
                            ...submitData,
                            method: values.method
                        },
                        null,
                        2
                    )
                );
            } else if (values.method !== 'paypal' && !values.newCardName) {
                alert(
                    JSON.stringify(
                        {
                            ...submitData,
                            method: values.method,
                            card: values.card
                        },
                        null,
                        2
                    )
                );
            }
            if (values.newCardName) {
                alert(
                    JSON.stringify(
                        {
                            ...submitData,
                            method: values.method,
                            newCardName: values.newCardName,
                            newCardNumber: values.newCardNumber,
                            newCardExpired: values.newCardExpired,
                            newCardCvv: values.newCardCvv
                        },
                        null,
                        2
                    )
                );
            }
            resetForm();
            enqueueSnackbar('Payment success', { variant: 'success' });
        }
    });

    const getTickets = useCallback(async () => {
        try {
            const response = await axios.post(`/api/dat-ve`, tickets);
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
                    Quay lại khu vực mua vé
                </Button>
            </Grid>

            <Grid item xs={12} md={4}>
                <PaymentMethods
                    formik={formik}
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
