import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import { ApiError } from "../errors/api-error";
import { Category } from "../models/category/category.model";
import { tokenMiddleware } from "../utils/jwt";


const categoryRouter = Router();
const { OK, CREATED, BAD_REQUEST } = StatusCodes;

categoryRouter.post('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { name, description, image } = req.body;
    const category = {
        name,
        description,
        image
    };
    Category.findOne({ name, description }).then((categoryFound) => {
        if (!categoryFound) {
            Category.create(category).then((createdCategory) => {
                res.status(CREATED).json(createdCategory);
            });
        }
        else {
            next(ApiError.badRequest(['DUPLICATED_CATEGORY']));
        }
    });
});

categoryRouter.get('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    Category.find({}).then((categories) => {
        res.status(OK).json(categories);
    });
});

categoryRouter.get('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Category.findOne({ _id: id }).then((category) => {
        if (!category) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            res.status(OK).json(category);
        }
    });
});

categoryRouter.delete('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Category.findOne({ _id: id }).then((categoryFound) => {
        if (!categoryFound) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            Category.deleteOne({ _id: id }).then(() => {
                res.status(OK).json();
            });
        }
    });
});

categoryRouter.patch('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const valueUpdated = {
        name,
        description,
        image
    };
    const condition = {
        _id: id
    }
    Category.findOne(condition).then((categoryFound) => {
        if (!categoryFound) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            const newCategory = {
                ...categoryFound,
                ...valueUpdated
            };
            Category.findOne({ name: newCategory.name, description: newCategory.description }).then((duplicatedCategory) => {
                if (duplicatedCategory) {
                    next(ApiError.badRequest(['DUPLICATED_CATEGORY']));
                }
                else {
                    Category.updateOne(condition, valueUpdated, {}, (err, category) => {
                        res.status(OK).json();
                    });
                }
            })
        }
    });
});


export default categoryRouter;