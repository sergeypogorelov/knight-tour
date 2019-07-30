import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";

export class KnightTour {

    get knight(): Knight {
        return this._knight;
    }

    constructor(knight: Knight) {
        if (!knight)
            throw new Error('Knight is not specified.');

        this._knight = knight;
    }

    search() {
        
    }

    private _knight: Knight;

}
