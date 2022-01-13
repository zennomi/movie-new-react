import faker from 'faker';
// utils
import mock from './mock';
// utils
import { fDate } from '../utils/formatTime';


const skip = 10;

export const movies = [...Array(25)].map((_, index) => ({
    ma: index,
    ten: faker.lorem.sentence(),
    thoigian: faker.datatype.number({ min: 60, max: 150 }),
    theloai: [faker.music.genre(), faker.music.genre(), faker.music.genre()],
    ngonngu: faker.address.country(),
    danhgia: faker.datatype.number({ min: 0, max: 5 }), // bổ sung
    trailer: faker.internet.url(),
    noidung: faker.lorem.sentences(),
    bia: faker.image.imageUrl(900, 1600, 'food', true), // bổ sung
    rating: "R18"
}));

export const showtimes = [...Array(200)].map((_, index) => ({ // lịch chiếu
    ma: index,
    phim: movies[faker.datatype.number({ min: 0, max: 24 })],
    maphong: faker.datatype.number({ min: 0, max: 5 }),
    ngay: fDate((new Date()).valueOf() + 24 * 60 * 60 * 1000 * faker.datatype.number({ min: 0, max: 5 })), // dd/MM/YY
    ca: faker.datatype.number({ min: 0, max: 5 }),
    hang: faker.datatype.number({ min: 5, max: 10 }),
    cot: faker.datatype.number({ min: 5, max: 10 }),
}))

export const filledSlots = [...Array(200)].map((_, index) => {
    const { hang, cot } = showtimes[index];
    const results = [];
    for (let i = 0; i < cot; i += 1) {
        results[i] = [];
        for (let j = 0; j < hang; j += 1) {
            results[i][j] = faker.datatype.boolean();
        }
    }
    return results;
})

const shift = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

mock.onGet('/api/phim').reply((config) => {
    try {
        const { page, theloai } = config.params || { page: 0 };
        const maxLength = movies.length;

        const results = movies.slice(page * skip, (page + 1) * skip);

        return [200, { results, maxLength }];
    } catch (error) {
        console.log(error);
    }
});

mock.onGet('/api/phim-sap-chieu').reply((config) => {
    try {
        const { page, theloai } = config.params || { page: 0 };
        const maxLength = movies.length;

        const results = movies.slice(page * skip, (page + 1) * skip);

        return [200, { results, maxLength }];
    } catch (error) {
        console.log(error);
    }
});


mock.onGet("/api/phim/:maphim").reply((config) => {
    try {
        let { maphim } = config.routeParams;
        maphim = Number(maphim);
        return [200, { result: movies[maphim] }]
    } catch (error) {
        console.log(error);
    }
})

mock.onGet("/api/suat-chieu").reply((config) => {
    try {
        const { maphim, ngay } = config.params;
        if (maphim) return [200, { results: showtimes.filter(s => s.phim.ma === Number(maphim) && s.ngay === ngay) }];
        return [200, { results: showtimes.filter(s => s.ngay === ngay).slice(0, 10) }];
    } catch (error) {
        console.log(error);
    }
})

mock.onGet("/api/suat-chieu/:masuatchieu/ghe").reply((config) => {
    try {
        const { masuatchieu } = config.routeParams;
        console.log(masuatchieu);
        return [200, { results: filledSlots[Number(masuatchieu)] }]

    } catch (error) {
        console.log(error);
    }
})

mock.onPost("/api/ve/chi-tiet").reply((config) => {
    // lấy thông tin chi tiết của vé
    try {
        const tickets = JSON.parse(config.data);
        const detailedTickets = [];
        Object.keys(tickets).forEach(showtimeId => {
            const suatchieu = showtimes[showtimeId];
            tickets[showtimeId].forEach(v => {
                detailedTickets.push({ phim: suatchieu.phim, suatchieu: { ...suatchieu, gio: shift[suatchieu.ca] }, hang: v.r, cot: v.c, gia: faker.datatype.number({ min: 10, max: 15 }) * 1e4, trong: faker.datatype.number({ max: 5 }) > 1 })
            });
        })
        // form ve [{masuatchieu, hang, cot}] return [{suatchieu: {phim, ca: (HH:MM), ngay, gia}}, hang, cot]
        return [200, { results: detailedTickets }];
    } catch (error) {
        console.log(error);
    }
})

mock.onPost("/api/ve/dat").reply((config) => {
    // tạm thời tạo vé, nếu không thanh toán xong thì xoá, nhớ thêm trường expired để nhỡ khách hàng không thanh toán
    try {
        const tickets = JSON.parse(config.data);
        const detailedTickets = [];
        Object.keys(tickets).forEach(showtimeId => {
            const suatchieu = showtimes[showtimeId];
            tickets[showtimeId].forEach(v => {
                if (faker.datatype.number({ max: 5 }) > 1) detailedTickets.push({ suatchieu: { ...suatchieu, gio: shift[suatchieu.ca] }, hang: v.r, cot: v.c, gia: faker.datatype.number({ min: 10, max: 15 }) * 1e4 })
            });
        })
        return [200, { results: detailedTickets }];
        // form ve [{masuatchieu, hang, cot}] return [{suatchieu: {phim, ca: (HH:MM), ngay, gia}}, hang, cot] (vé mình giữ được trong 5 phút)
    } catch (error) {
        console.log(error);
    }
})

mock.onPost("/api/ve/huy").reply((config) => {
    // form ve [{masuatchieu, hang, cot}] xoá vé
    const status = "success"
    return [200, { status }];
})

mock.onGet("/api/hoa-don/:mahoadon").reply((config) => {
    const { mahoadon } = config.routeParams;
    console.log(mahoadon);
    try {
        return [200, {
            result: {
                ma: faker.datatype.uuid(),
                ve: [...Array(5)].map(() => {
                    const suatchieu = showtimes[faker.datatype.number({ min: 0, max: 199 })];
                    return {
                        ma: faker.datatype.uuid(),
                        suatchieu: { ...suatchieu, gio: shift[suatchieu.ca] },
                        hang: faker.datatype.number({ max: suatchieu.hang }),
                        cot: faker.datatype.number({ max: suatchieu.cot })
                    }
                })
            }
        }
        ];
    } catch (error) {
        console.log(error);
    }
});

mock.onPost("/api/hoa-don").reply((config) => {
    // form ve [{masuatchieu, hang, cot}] chốt vé, trả về uuid của hoá đơn mới
    try {
        return [200, { result: faker.datatype.uuid() }];
    } catch (error) {
        console.log(error);
    }
})