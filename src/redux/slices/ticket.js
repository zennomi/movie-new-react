import { reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
    isLoading: false,
    error: false,
    tickets: {},
    total: 0
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

        // GET PRODUCTS
        getProductsSuccess(state, action) {
            state.isLoading = false;
            state.products = action.payload;
        },

        // GET PRODUCT
        getProductSuccess(state, action) {
            state.isLoading = false;
            state.product = action.payload;
        },

        // DELETE PRODUCT
        deleteProduct(state, action) {
            state.products = reject(state.products, { id: action.payload });
        },

        // ADD TICKET
        addTicket(state, action) {
            const {showtimeId, r, c} = action.payload;
            if (!state.tickets[showtimeId]) state.tickets[showtimeId] = [];
            state.tickets[showtimeId].push({r, c});
            state.total += 1;
        },

        // REMOVE TICKET
        removeTicket(state, action) {
            const {showtimeId, r, c} = action.payload;
			state.tickets[showtimeId] = [...state.tickets[showtimeId].filter(ticket => !(ticket.r === r && ticket.c === c))];
            state.total -= 1;

        }
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
} = slice.actions;

