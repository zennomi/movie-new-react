import { reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
    isLoading: false,
    error: false,
    tickets: {},
    total: 0,
    checkout: {
        activeStep: 0,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        billing: null
    }
};

const slice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        onBackStep(state) {
            state.checkout.activeStep -= 1;
        },

        onNextStep(state) {
            state.checkout.activeStep += 1;
        },

        onGotoStep(state, action) {
            const goToStep = action.payload;
            state.checkout.activeStep = goToStep;
        },
        // ADD TICKET
        addTicket(state, action) {
            const { showtimeId, r, c } = action.payload;
            if (!state.tickets[showtimeId]) state.tickets[showtimeId] = [];
            state.tickets[showtimeId].push({ r, c });
            state.total += 1;
        },

        // REMOVE TICKET
        removeTicket(state, action) {
            const { showtimeId, r, c } = action.payload;
            console.log(action.payload, state.tickets[showtimeId]);
            state.tickets[showtimeId] = [...state.tickets[showtimeId].filter(ticket => !(ticket.r === r && ticket.c === c))];
            state.total -= 1;
        },

        resetCart(state) {
            state.checkout.activeStep = 0;
            state.checkout.cart = [];
            state.checkout.total = 0;
            state.checkout.subtotal = 0;
            state.checkout.discount = 0;
            state.checkout.shipping = 0;
            state.checkout.billing = null;
        },

        createBilling(state, action) {
            state.checkout.billing = action.payload;
        },

        applyDiscount(state, action) {
            const discount = action.payload;
            state.checkout.discount = discount;
            state.checkout.total = state.checkout.subtotal - discount;
        },
    }
})


// Reducer
export default slice.reducer;

// Actions
export const {
    addTicket,
    removeTicket,
    onGotoStep,
    onBackStep,
    onNextStep,
    createBilling,
    applyDiscount,
    resetCart,
} = slice.actions;

