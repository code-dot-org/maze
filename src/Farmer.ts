import Cell from './Cell';
import Subtype from './Subtype';
import DirtDrawer from './DirtDrawer';

class Farmer<T extends Cell> extends Subtype<T, DirtDrawer> {
  /** @override */
  isFarmer(): boolean {
    return true;
  }
}

export default Farmer;
