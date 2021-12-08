import faker from 'faker';
// utils
import mock from './mock';
// utils
import mockData from '../utils/mock-data';

const skip = 10;

export const movies = [...Array(25)].map((_, index) => ({
    ma: index,
    ten: faker.lorem.sentence(),
    thoigian: faker.datatype.number({min: 60, max: 150}),
    theloai: faker.music.genre(),
    ngonngu: faker.address.country(),
    danhgia: faker.datatype.number({ min: 0, max: 5 }),
    trailer: faker.internet.url(),
    noidung: faker.lorem.sentences(),
    bia: faker.image.imageUrl(900, 1600, 'food', true)
}));

export const showtimes = [...Array(100)].map((_, index) => ({
    ma: index,
    phim: movies[faker.datatype.number({min: 0, max: 24})],
    maphong: faker.datatype.number({min:0, max: 5}),
    ca: faker.datatype.number({min:0, max: 5}),
    hang: faker.datatype.number({min: 5, max: 10}),
    cot: faker.datatype.number({min: 5, max: 10}),
}))

export const filledSlots = [...Array(100)].map((_, index) => {
    const {hang, cot} = showtimes[index];
    const results = [];
    for (let i = 0; i < cot; i+=1) {
        results[i] = [];
        for (let j = 0; j < hang; j+=1) {
            results[i][j] = faker.datatype.boolean();
        }
    }
    return results;
})

mock.onGet('/api/phim').reply((config) => {
    try {
        const { page } = config.params || { page: 0 };
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
        return [200, {results: showtimes.filter(s => s.phim.ma === Number(maphim))}]
        
    } catch (error) {
        console.log(error);
    }
})

mock.onGet("/api/vi-tri").reply((config) => {
    try {
        const { masuatchieu } = config.params;
        return [200, {results: filledSlots[Number(masuatchieu)]}]
        
    } catch (error) {
        console.log(error);
    }
})