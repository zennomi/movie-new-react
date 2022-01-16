import { createSlice } from '@reduxjs/toolkit';
// utils

const initialState = {
    isLoading: false,
    error: false,
    tickets: {},
    total: 0,
    checkout: {
        activeStep: 0,
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
            state.total = Object.keys(state.tickets).map(key => state.tickets[key].length).reduce((a, b) => a + b, 0);
        },

        // REMOVE TICKET
        removeTicket(state, action) {
            const { showtimeId, r, c } = action.payload;
            console.log({ payload: action.payload }, state.tickets[showtimeId]);
            state.tickets[showtimeId] = [...state.tickets[showtimeId].filter(ticket => !(ticket.r === r && ticket.c === c))];
            state.total = Object.keys(state.tickets).map(key => state.tickets[key].length).reduce((a, b) => a + b, 0);
        },

        resetCart(state) {
            state.tickets = {};
            state.total = 0;
            state.checkout.billing = null;
        },

        createBilling(state, action) {
            state.checkout.billing = action.payload;
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
    resetCart,
} = slice.actions;

