import { Task } from '../../../models/task';
import { Performer } from '../../../models/performer';

export interface TaskCardModel extends Task {
  performer: Performer;
}
