import { ICoordinate } from './coordinate.interface';

/**
 * chess board cell
 */
export interface ICell {
    /**
     * indicates if the knight has already touched this cell
     */
    touched: boolean;

    /**
     * cell coordinate
     */
    coordinate: ICoordinate;
}
