export function ticketObjToArr(obj) {
    const results = [];
    Object.keys(obj).forEach(showtimeId => {
        obj[showtimeId].forEach(slot => results.push({ masuatchieu: Number(showtimeId), hang: slot.r, cot: slot.c }))
    })
    return results;
}