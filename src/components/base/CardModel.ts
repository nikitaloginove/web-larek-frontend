import { ICard, categoryType } from '../../types';
import { Model } from './Model';

export class CardModel extends Model<ICard> {
	description: string;
	image: string;
	title: string;
	category: categoryType;
	id: string;
	price: number;
}