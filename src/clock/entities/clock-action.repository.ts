import { EntityRepository, Repository } from 'typeorm';
import { Clock } from './clock.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { ClockAction } from './clock-action.entity';
import { ActionTypeEnum } from '../enums/action-type.enum';

@EntityRepository(ClockAction)
export class ClockActionRepository extends Repository<ClockAction> {
  async createAction(
    actionType: ActionTypeEnum,
    clock: Clock,
    time: number,
  ): Promise<ClockAction> {
    const action = new ClockAction();
    action.clock = clock;
    action.type = actionType;
    action.time = time;

    try {
      await action.save();

      return action;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error as occurred while creating a clock event',
      );
    }
  }

  async getActions(clock: Clock): Promise<ClockAction[]> {
    const query = this.createQueryBuilder('action');

    query.andWhere('action.clock_id = :clockId', { clockId: clock.id });

    return await query.getMany();
  }

  async calculateActionAverage(
    clock: Clock,
    actions?: ClockAction[],
  ): Promise<number> {
    if (!actions) actions = await this.getActions(clock);

    if (actions.length === 0) return 0;

    return actions.reduce((a, b) => {
      if (b.type === ActionTypeEnum.ADD) return a + b.time;
      if (b.type === ActionTypeEnum.REMOVE) return a - b.time;
    }, 0);
  }
}
