import { Performer } from '../../models/performer';


export interface PerformerListItemModel extends Performer {
  numberOfTasks: number;
}
