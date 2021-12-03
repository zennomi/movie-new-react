import faker from 'faker';
// utils
import mock from './mock';
// utils
import mockData from '../utils/mock-data';

const skip = 10;

export const movies = [...Array(25)].map((_, index) => ({
    maphim: index,
    tenphim: faker.lorem.sentence(),
    thoigian: faker.datatype.number(),
    theloai: faker.music.genre(),
    ngonngu: faker.address.country(),
    rate: faker.datatype.number({ min: 0, max: 5 }),
    trailer: faker.internet.url(),
    ghichu: faker.lorem.sentences,
    poster: faker.image.imageUrl(900, 1600, 'food', true)
}));

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
        console.log(maphim)
        return [200, { result: movies[maphim] }]
    } catch (error) {
        console.log(error);
    }
})