import Drawer from '../../src/drawer';

describe("Drawer", function () {
  it("can generate the correct cellIds", function () {
    expect(Drawer.cellId('dirt', 0, 0)).toEqual('dirt_0_0');
    expect(Drawer.cellId('dirt', 2, 4)).toEqual('dirt_2_4');
    expect(Drawer.cellId('dirt', 1, 5)).toEqual('dirt_1_5');
    expect(Drawer.cellId('dirt', 3, 1)).toEqual('dirt_3_1');
  });
});

