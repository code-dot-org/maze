import {quarterCircle, cutout} from '../../src/neighborhoodDrawer';

describe("Painting", function () {
    it("can give us a quarter circle and a cutout", function () {
      pieSlice = quarterCircle(100);
      expect(pieSlice).toEqual(`m50 50h-50c0-25 25-50 50-50z`);
      pieCutout = cutout(100);
      expect(cutout).toEqual(`m0 0v50c0-25 25-50 50-50z`);
    })
});